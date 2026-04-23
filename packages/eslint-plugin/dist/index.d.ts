declare const plugin: {
    meta: {
        name: string;
        version: string;
    };
    rules: {
        'require-literal-keys': import("eslint").Rule.RuleModule;
    };
    configs: {
        recommended: {
            plugins: string[];
            rules: {
                '@orderofchaos/ling/require-literal-keys': string;
            };
        };
    };
};
export = plugin;
