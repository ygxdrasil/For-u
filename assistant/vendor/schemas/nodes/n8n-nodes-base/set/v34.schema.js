var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/set/v34/mode_manual.schema.js
var require_mode_manual_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/set/v34/mode_manual.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("manual").default("manual"),
          duplicateItem: booleanOrExpression.optional(),
          duplicateCount: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "duplicateItem": [true] } }, defaults: { "duplicateItem": false } }),
          assignments: assignmentCollectionValueSchema.optional(),
          includeOtherFields: booleanOrExpression.optional(),
          include: resolveSchema({ parameters, schema: z.union([z.literal("all"), z.literal("selected"), z.literal("except"), expressionSchema]), required: false, displayOptions: { "hide": { "/includeOtherFields": [false] } } }),
          includeFields: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "include": ["selected"], "/includeOtherFields": [true] } }, defaults: { "include": "all" } }),
          excludeFields: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "include": ["except"], "/includeOtherFields": [true] } }, defaults: { "include": "all" } }),
          options: z.object({ includeBinary: booleanOrExpression.optional(), stripBinary: booleanOrExpression.optional(), ignoreConversionErrors: booleanOrExpression.optional(), dotNotation: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/set/v34/mode_raw.schema.js
var require_mode_raw_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/set/v34/mode_raw.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("raw"),
          duplicateItem: booleanOrExpression.optional(),
          duplicateCount: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "duplicateItem": [true] } }, defaults: { "duplicateItem": false } }),
          jsonOutput: z.union([iDataObjectSchema, z.string()]).optional(),
          includeOtherFields: booleanOrExpression.optional(),
          include: resolveSchema({ parameters, schema: z.union([z.literal("all"), z.literal("selected"), z.literal("except"), expressionSchema]), required: false, displayOptions: { "hide": { "/includeOtherFields": [false] } } }),
          includeFields: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "include": ["selected"], "/includeOtherFields": [true] } }, defaults: { "include": "all" } }),
          excludeFields: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "include": ["except"], "/includeOtherFields": [true] } }, defaults: { "include": "all" } }),
          options: z.object({ includeBinary: booleanOrExpression.optional(), stripBinary: booleanOrExpression.optional(), ignoreConversionErrors: booleanOrExpression.optional(), dotNotation: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/set/v34/index.schema.js
var getManualSchema = require_mode_manual_schema();
var getRawSchema = require_mode_raw_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.mode === void 0 ? { ...parameters, mode: "manual" } : parameters;
  return z.union([
    getManualSchema({ ...helpers, parameters: effectiveParams }),
    getRawSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
