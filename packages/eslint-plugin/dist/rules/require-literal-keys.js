"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_TRANSLATOR_FUNCTIONS = ["t"];
const rule = {
    meta: {
        type: "problem",
        docs: {
            description: "Require translation function to be called with a string literal as the first argument",
            recommended: true,
        },
        messages: {
            requireLiteralKey: "Translation key must be a string literal for static analysis. Found: {{type}}",
            requireLiteralKeyTemplateLiteral: "Translation key must be a plain string literal, not a template literal with expressions",
        },
        schema: [
            {
                type: "object",
                properties: {
                    translatorFunctions: {
                        type: "array",
                        items: { type: "string" },
                        default: DEFAULT_TRANSLATOR_FUNCTIONS,
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = context.options[0] || {};
        const translatorFunctions = options.translatorFunctions || DEFAULT_TRANSLATOR_FUNCTIONS;
        return {
            CallExpression(node) {
                const callee = node.callee;
                let functionName = null;
                if (callee.type === "Identifier") {
                    functionName = callee.name;
                }
                else if (callee.type === "MemberExpression" &&
                    callee.property.type === "Identifier") {
                    functionName = callee.property.name;
                }
                if (!functionName || !translatorFunctions.includes(functionName)) {
                    return;
                }
                const firstArg = node.arguments[0];
                if (!firstArg) {
                    return;
                }
                if (firstArg.type === "Literal" && typeof firstArg.value === "string") {
                    return;
                }
                if (firstArg.type === "TemplateLiteral") {
                    if (firstArg.expressions.length === 0) {
                        return;
                    }
                    context.report({
                        node: firstArg,
                        messageId: "requireLiteralKeyTemplateLiteral",
                    });
                    return;
                }
                const typeDescription = getTypeDescription(firstArg);
                context.report({
                    node: firstArg,
                    messageId: "requireLiteralKey",
                    data: {
                        type: typeDescription,
                    },
                });
            },
        };
    },
};
function getTypeDescription(node) {
    switch (node.type) {
        case "Identifier":
            return `variable "${node.name}"`;
        case "MemberExpression":
            return "property access";
        case "CallExpression":
            return "function call";
        case "ConditionalExpression":
            return "conditional expression";
        case "BinaryExpression":
            return "binary expression";
        case "LogicalExpression":
            return "logical expression";
        default:
            return node.type;
    }
}
exports.default = rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1saXRlcmFsLWtleXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcnVsZXMvcmVxdWlyZS1saXRlcmFsLWtleXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxNQUFNLDRCQUE0QixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFM0MsTUFBTSxJQUFJLEdBQW9CO0lBQzVCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxTQUFTO1FBQ2YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUNULHVGQUF1RjtZQUN6RixXQUFXLEVBQUUsSUFBSTtTQUNsQjtRQUNELFFBQVEsRUFBRTtZQUNSLGlCQUFpQixFQUNmLCtFQUErRTtZQUNqRixnQ0FBZ0MsRUFDOUIseUZBQXlGO1NBQzVGO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsVUFBVSxFQUFFO29CQUNWLG1CQUFtQixFQUFFO3dCQUNuQixJQUFJLEVBQUUsT0FBTzt3QkFDYixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO3dCQUN6QixPQUFPLEVBQUUsNEJBQTRCO3FCQUN0QztpQkFDRjtnQkFDRCxvQkFBb0IsRUFBRSxLQUFLO2FBQzVCO1NBQ0Y7S0FDRjtJQUVELE1BQU0sQ0FBQyxPQUFPO1FBQ1osTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekMsTUFBTSxtQkFBbUIsR0FDdkIsT0FBTyxDQUFDLG1CQUFtQixJQUFJLDRCQUE0QixDQUFDO1FBRTlELE9BQU87WUFDTCxjQUFjLENBQUMsSUFBb0I7Z0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBRTNCLElBQUksWUFBWSxHQUFrQixJQUFJLENBQUM7Z0JBRXZDLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxZQUFZLEVBQUUsQ0FBQztvQkFDakMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQzdCLENBQUM7cUJBQU0sSUFDTCxNQUFNLENBQUMsSUFBSSxLQUFLLGtCQUFrQjtvQkFDbEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUNyQyxDQUFDO29CQUNELFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDdEMsQ0FBQztnQkFFRCxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7b0JBQ2pFLE9BQU87Z0JBQ1QsQ0FBQztnQkFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVuQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ2QsT0FBTztnQkFDVCxDQUFDO2dCQUVELElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksT0FBTyxRQUFRLENBQUMsS0FBSyxLQUFLLFFBQVEsRUFBRSxDQUFDO29CQUN0RSxPQUFPO2dCQUNULENBQUM7Z0JBRUQsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLGlCQUFpQixFQUFFLENBQUM7b0JBQ3hDLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7d0JBQ3RDLE9BQU87b0JBQ1QsQ0FBQztvQkFFRCxPQUFPLENBQUMsTUFBTSxDQUFDO3dCQUNiLElBQUksRUFBRSxRQUFRO3dCQUNkLFNBQVMsRUFBRSxrQ0FBa0M7cUJBQzlDLENBQUMsQ0FBQztvQkFDSCxPQUFPO2dCQUNULENBQUM7Z0JBRUQsTUFBTSxlQUFlLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXJELE9BQU8sQ0FBQyxNQUFNLENBQUM7b0JBQ2IsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsU0FBUyxFQUFFLG1CQUFtQjtvQkFDOUIsSUFBSSxFQUFFO3dCQUNKLElBQUksRUFBRSxlQUFlO3FCQUN0QjtpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDO0FBRUYsU0FBUyxrQkFBa0IsQ0FBQyxJQUFxQztJQUMvRCxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNsQixLQUFLLFlBQVk7WUFDZixPQUFPLGFBQWEsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO1FBQ25DLEtBQUssa0JBQWtCO1lBQ3JCLE9BQU8saUJBQWlCLENBQUM7UUFDM0IsS0FBSyxnQkFBZ0I7WUFDbkIsT0FBTyxlQUFlLENBQUM7UUFDekIsS0FBSyx1QkFBdUI7WUFDMUIsT0FBTyx3QkFBd0IsQ0FBQztRQUNsQyxLQUFLLGtCQUFrQjtZQUNyQixPQUFPLG1CQUFtQixDQUFDO1FBQzdCLEtBQUssbUJBQW1CO1lBQ3RCLE9BQU8sb0JBQW9CLENBQUM7UUFDOUI7WUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztBQUNILENBQUM7QUFFRCxrQkFBZSxJQUFJLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJ1bGUgfSBmcm9tIFwiZXNsaW50XCI7XG5pbXBvcnQgdHlwZSB7IENhbGxFeHByZXNzaW9uIH0gZnJvbSBcImVzdHJlZVwiO1xuXG5jb25zdCBERUZBVUxUX1RSQU5TTEFUT1JfRlVOQ1RJT05TID0gW1widFwiXTtcblxuY29uc3QgcnVsZTogUnVsZS5SdWxlTW9kdWxlID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogXCJwcm9ibGVtXCIsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiUmVxdWlyZSB0cmFuc2xhdGlvbiBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aCBhIHN0cmluZyBsaXRlcmFsIGFzIHRoZSBmaXJzdCBhcmd1bWVudFwiLFxuICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgcmVxdWlyZUxpdGVyYWxLZXk6XG4gICAgICAgIFwiVHJhbnNsYXRpb24ga2V5IG11c3QgYmUgYSBzdHJpbmcgbGl0ZXJhbCBmb3Igc3RhdGljIGFuYWx5c2lzLiBGb3VuZDoge3t0eXBlfX1cIixcbiAgICAgIHJlcXVpcmVMaXRlcmFsS2V5VGVtcGxhdGVMaXRlcmFsOlxuICAgICAgICBcIlRyYW5zbGF0aW9uIGtleSBtdXN0IGJlIGEgcGxhaW4gc3RyaW5nIGxpdGVyYWwsIG5vdCBhIHRlbXBsYXRlIGxpdGVyYWwgd2l0aCBleHByZXNzaW9uc1wiLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB0cmFuc2xhdG9yRnVuY3Rpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAgICAgICBpdGVtczogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICBkZWZhdWx0OiBERUZBVUxUX1RSQU5TTEFUT1JfRlVOQ1RJT05TLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG4gICAgY29uc3QgdHJhbnNsYXRvckZ1bmN0aW9uczogc3RyaW5nW10gPVxuICAgICAgb3B0aW9ucy50cmFuc2xhdG9yRnVuY3Rpb25zIHx8IERFRkFVTFRfVFJBTlNMQVRPUl9GVU5DVElPTlM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgQ2FsbEV4cHJlc3Npb24obm9kZTogQ2FsbEV4cHJlc3Npb24pIHtcbiAgICAgICAgY29uc3QgY2FsbGVlID0gbm9kZS5jYWxsZWU7XG5cbiAgICAgICAgbGV0IGZ1bmN0aW9uTmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgICAgICAgaWYgKGNhbGxlZS50eXBlID09PSBcIklkZW50aWZpZXJcIikge1xuICAgICAgICAgIGZ1bmN0aW9uTmFtZSA9IGNhbGxlZS5uYW1lO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGNhbGxlZS50eXBlID09PSBcIk1lbWJlckV4cHJlc3Npb25cIiAmJlxuICAgICAgICAgIGNhbGxlZS5wcm9wZXJ0eS50eXBlID09PSBcIklkZW50aWZpZXJcIlxuICAgICAgICApIHtcbiAgICAgICAgICBmdW5jdGlvbk5hbWUgPSBjYWxsZWUucHJvcGVydHkubmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZnVuY3Rpb25OYW1lIHx8ICF0cmFuc2xhdG9yRnVuY3Rpb25zLmluY2x1ZGVzKGZ1bmN0aW9uTmFtZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaXJzdEFyZyA9IG5vZGUuYXJndW1lbnRzWzBdO1xuXG4gICAgICAgIGlmICghZmlyc3RBcmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlyc3RBcmcudHlwZSA9PT0gXCJMaXRlcmFsXCIgJiYgdHlwZW9mIGZpcnN0QXJnLnZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpcnN0QXJnLnR5cGUgPT09IFwiVGVtcGxhdGVMaXRlcmFsXCIpIHtcbiAgICAgICAgICBpZiAoZmlyc3RBcmcuZXhwcmVzc2lvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZTogZmlyc3RBcmcsXG4gICAgICAgICAgICBtZXNzYWdlSWQ6IFwicmVxdWlyZUxpdGVyYWxLZXlUZW1wbGF0ZUxpdGVyYWxcIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0eXBlRGVzY3JpcHRpb24gPSBnZXRUeXBlRGVzY3JpcHRpb24oZmlyc3RBcmcpO1xuXG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlOiBmaXJzdEFyZyxcbiAgICAgICAgICBtZXNzYWdlSWQ6IFwicmVxdWlyZUxpdGVyYWxLZXlcIixcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0eXBlOiB0eXBlRGVzY3JpcHRpb24sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBnZXRUeXBlRGVzY3JpcHRpb24obm9kZTogeyB0eXBlOiBzdHJpbmc7IG5hbWU/OiBzdHJpbmcgfSk6IHN0cmluZyB7XG4gIHN3aXRjaCAobm9kZS50eXBlKSB7XG4gICAgY2FzZSBcIklkZW50aWZpZXJcIjpcbiAgICAgIHJldHVybiBgdmFyaWFibGUgXCIke25vZGUubmFtZX1cImA7XG4gICAgY2FzZSBcIk1lbWJlckV4cHJlc3Npb25cIjpcbiAgICAgIHJldHVybiBcInByb3BlcnR5IGFjY2Vzc1wiO1xuICAgIGNhc2UgXCJDYWxsRXhwcmVzc2lvblwiOlxuICAgICAgcmV0dXJuIFwiZnVuY3Rpb24gY2FsbFwiO1xuICAgIGNhc2UgXCJDb25kaXRpb25hbEV4cHJlc3Npb25cIjpcbiAgICAgIHJldHVybiBcImNvbmRpdGlvbmFsIGV4cHJlc3Npb25cIjtcbiAgICBjYXNlIFwiQmluYXJ5RXhwcmVzc2lvblwiOlxuICAgICAgcmV0dXJuIFwiYmluYXJ5IGV4cHJlc3Npb25cIjtcbiAgICBjYXNlIFwiTG9naWNhbEV4cHJlc3Npb25cIjpcbiAgICAgIHJldHVybiBcImxvZ2ljYWwgZXhwcmVzc2lvblwiO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbm9kZS50eXBlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJ1bGU7XG4iXX0=