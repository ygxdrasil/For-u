var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/code/v2/mode_run_once_for_all_items.schema.js
var require_mode_run_once_for_all_items_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/code/v2/mode_run_once_for_all_items.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("runOnceForAllItems").default("runOnceForAllItems"),
          language: z.union([z.literal("javaScript"), z.literal("pythonNative")]).optional(),
          jsCode: resolveSchema({ parameters, schema: z.string(), required: false, displayOptions: { "show": { "language": ["javaScript"] } }, defaults: { "language": "javaScript" } }),
          pythonCode: resolveSchema({ parameters, schema: z.string(), required: false, displayOptions: { "show": { "language": ["python", "pythonNative"] } }, defaults: { "language": "javaScript" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/code/v2/mode_run_once_for_each_item.schema.js
var require_mode_run_once_for_each_item_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/code/v2/mode_run_once_for_each_item.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("runOnceForEachItem"),
          language: z.union([z.literal("javaScript"), z.literal("pythonNative")]).optional(),
          jsCode: resolveSchema({ parameters, schema: z.string(), required: false, displayOptions: { "show": { "language": ["javaScript"] } }, defaults: { "language": "javaScript" } }),
          pythonCode: resolveSchema({ parameters, schema: z.string(), required: false, displayOptions: { "show": { "language": ["python", "pythonNative"] } }, defaults: { "language": "javaScript" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/code/v2/index.schema.js
var getRunOnceForAllItemsSchema = require_mode_run_once_for_all_items_schema();
var getRunOnceForEachItemSchema = require_mode_run_once_for_each_item_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.mode === void 0 ? { ...parameters, mode: "runOnceForAllItems" } : parameters;
  return z.union([
    getRunOnceForAllItemsSchema({ ...helpers, parameters: effectiveParams }),
    getRunOnceForEachItemSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
