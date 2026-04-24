import { NodeArray, Statement } from 'typescript';
import { Translations } from '@orderofchaos/ling-core';

interface ScanResult {
    [namespace: string]: {
        [key: string]: string;
    };
}
interface ScanOptions {
    /**
     * File extensions to scan
     * @default ['ts', 'tsx']
     */
    extensions?: string[];
    /**
     * Name of the translator function
     * @default 't'
     */
    translatorFunction?: string;
    /**
     * Name of the module initializer function
     * @default 'initI18nModule'
     */
    moduleInitFunction?: string;
}

declare function scanDirectory(dirPath: string, options?: ScanOptions): ScanResult;

declare function scanFile(path: string, options?: ScanOptions): ScanResult;

interface NodeScanResult {
    [key: string]: string;
}
declare function scanNodes(nodes: NodeArray<Statement>, path: string, content: string, options?: ScanOptions): NodeScanResult;

interface LintResult {
    missing: Array<{
        language: string;
        namespace: string;
        key: string;
    }>;
    total: number;
}
declare function findMissingTranslations(translations: Record<string, Translations>, defaultLanguage: string): LintResult;

export { type ScanOptions, type ScanResult, findMissingTranslations, scanDirectory, scanFile, scanNodes };
