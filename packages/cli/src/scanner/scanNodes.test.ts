import { describe, it, expect } from 'vitest';
import * as ts from 'typescript';
import { scanNodes } from './scanNodes';

function parseCode(code: string) {
  const sourceFile = ts.createSourceFile(
    'test.tsx',
    code,
    ts.ScriptTarget.ES2020,
    false,
    ts.ScriptKind.TSX
  );
  return sourceFile.statements;
}

describe('scanNodes', () => {
  it('should extract translation keys from t() calls', () => {
    const code = `
      function Component() {
        return <div>{t('Hello World')}</div>;
      }
    `;

    const result = scanNodes(parseCode(code), 'test.tsx', code);

    expect(result).toEqual({ 'Hello World': 'Hello World' });
  });

  it('should extract multiple translation keys', () => {
    const code = `
      function Component() {
        return (
          <div>
            <h1>{t('Title')}</h1>
            <p>{t('Description')}</p>
          </div>
        );
      }
    `;

    const result = scanNodes(parseCode(code), 'test.tsx', code);

    expect(result).toEqual({
      'Title': 'Title',
      'Description': 'Description',
    });
  });

  it('should handle template literals', () => {
    const code = `
      function Component() {
        return <div>{t(\`Hello\`)}</div>;
      }
    `;

    const result = scanNodes(parseCode(code), 'test.tsx', code);

    expect(result).toEqual({ 'Hello': 'Hello' });
  });

  it('should use custom translator function name', () => {
    const code = `
      function Component() {
        return <div>{translate('Custom')}</div>;
      }
    `;

    const result = scanNodes(parseCode(code), 'test.tsx', code, {
      translatorFunction: 'translate',
    });

    expect(result).toEqual({ 'Custom': 'Custom' });
  });

  it('should handle keys with placeholders', () => {
    const code = `
      function Component() {
        return <div>{t('Hello, {{name}}!')}</div>;
      }
    `;

    const result = scanNodes(parseCode(code), 'test.tsx', code);

    expect(result).toEqual({ 'Hello, {{name}}!': 'Hello, {{name}}!' });
  });

  it('should handle arrow functions', () => {
    const code = `
      const Component = () => {
        const text = t('Arrow function');
        return <div>{text}</div>;
      };
    `;

    const result = scanNodes(parseCode(code), 'test.tsx', code);

    expect(result).toEqual({ 'Arrow function': 'Arrow function' });
  });

  it('should handle conditional expressions', () => {
    const code = `
      function Component({ isActive }) {
        return <div>{isActive ? t('Active') : t('Inactive')}</div>;
      }
    `;

    const result = scanNodes(parseCode(code), 'test.tsx', code);

    expect(result).toEqual({
      'Active': 'Active',
      'Inactive': 'Inactive',
    });
  });

  it('should handle JSX attributes', () => {
    const code = `
      function Component() {
        return <button title={t('Button tooltip')}>Click</button>;
      }
    `;

    const result = scanNodes(parseCode(code), 'test.tsx', code);

    expect(result).toEqual({ 'Button tooltip': 'Button tooltip' });
  });

  it('should return empty object when no t() calls', () => {
    const code = `
      function Component() {
        return <div>No translations</div>;
      }
    `;

    const result = scanNodes(parseCode(code), 'test.tsx', code);

    expect(result).toEqual({});
  });

  it('should handle nested functions', () => {
    const code = `
      function Component() {
        const items = ['a', 'b'].map(() => t('Item'));
        return <div>{items}</div>;
      }
    `;

    const result = scanNodes(parseCode(code), 'test.tsx', code);

    expect(result).toEqual({ 'Item': 'Item' });
  });
});
