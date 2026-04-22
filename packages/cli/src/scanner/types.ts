export interface ScanResult {
  [namespace: string]: {
    [key: string]: string;
  };
}

export interface ScanOptions {
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

export const defaultOptions: Required<ScanOptions> = {
  extensions: ['ts', 'tsx'],
  translatorFunction: 't',
  moduleInitFunction: 'initI18nModule',
};
