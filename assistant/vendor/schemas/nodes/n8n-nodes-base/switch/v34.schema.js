var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/switch/v34/mode_expression.schema.js
var require_mode_expression_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/switch/v34/mode_expression.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("expression"),
          numberOutputs: z.number().optional(),
          output: numberOrExpression.optional(),
          looseTypeValidation: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/switch/v34/mode_rules.schema.js
var require_mode_rules_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/switch/v34/mode_rules.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("rules").default("rules"),
          rules: z.object({ values: z.array(z.object({ conditions: filterValueSchema.optional(), renameOutput: booleanOrExpression.optional(), outputKey: stringOrExpression.optional() })).optional() }).optional(),
          looseTypeValidation: booleanOrExpression.optional(),
          options: z.object({ fallbackOutput: stringOrExpression.optional(), ignoreCase: booleanOrExpression.optional(), looseTypeValidation: booleanOrExpression.optional(), renameFallbackOutput: stringOrExpression.optional(), allMatchingOutputs: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/switch/v34/index.schema.js
var getExpressionSchema = require_mode_expression_schema();
var getRulesSchema = require_mode_rules_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.mode === void 0 ? { ...parameters, mode: "rules" } : parameters;
  return z.union([
    getExpressionSchema({ ...helpers, parameters: effectiveParams }),
    getRulesSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
