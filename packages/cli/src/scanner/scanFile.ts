import * as fs from 'fs';
import * as ts from 'typescript';
import { SyntaxKind, type NodeArray, type VariableStatement } from 'typescript';

import type { ScanOptions, ScanResult } from './types';
import { defaultOptions } from './types';
import { scanNodes } from './scanNodes';

export function scanFile(
  path: string,
  options: ScanOptions = {}
): ScanResult {
  const opts = { ...defaultOptions, ...options };
  const content = fs.readFileSync(path, 'utf8');

  const tsFile = ts.createSourceFile(
    path,
    content,
    ts.ScriptTarget.ES2020,
    false,
    ts.ScriptKind.TSX
  );

  const fileScanResult = scanNodes(tsFile.statements, path, content, opts);

  if (Object.keys(fileScanResult).length > 0) {
    const namespace = extractNamespace(
      tsFile.statements as unknown as NodeArray<VariableStatement>,
      opts.moduleInitFunction
    );

    if (!namespace) {
      console.warn(
        `${path}: Cannot find "${opts.moduleInitFunction}('ComponentName')"`
      );
    }

    return { [namespace || 'unknown']: fileScanResult };
  }

  return {};
}

function extractNamespace(
  nodes: NodeArray<VariableStatement>,
  moduleInitFunction: string
): string {
  const initCall = nodes.find((node) => {
    return (
      node.kind === SyntaxKind.VariableStatement &&
      node.declarationList?.declarations?.[0]?.initializer?.kind ===
        SyntaxKind.CallExpression &&
      (
        node.declarationList.declarations[0].initializer as unknown as {
          expression?: { escapedText?: string };
        }
      ).expression?.escapedText === moduleInitFunction
    );
  });

  if (initCall) {
    const initializer = initCall.declarationList.declarations[0]
      .initializer as unknown as {
      arguments?: Array<{ text?: string }>;
    };

    return initializer.arguments?.[0]?.text ?? '';
  }

  return '';
}
