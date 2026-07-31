var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/storyblok/v1/resource_story/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/storyblok/v1/resource_story/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("story").default("story"),
          operation: z.literal("get").default("get"),
          source: z.union([z.literal("contentApi"), z.literal("managementApi"), expressionSchema]).optional(),
          identifier: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["contentApi"] } }, defaults: { "source": "contentApi" } }),
          space: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["managementApi"] } }, defaults: { "source": "contentApi" } }),
          storyId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["managementApi"] } }, defaults: { "source": "contentApi" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/storyblok/v1/resource_story/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/storyblok/v1/resource_story/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("story").default("story"),
          operation: z.literal("getAll"),
          source: z.union([z.literal("contentApi"), z.literal("managementApi"), expressionSchema]).optional(),
          returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "source": ["contentApi", "managementApi"] } }, defaults: { "source": "contentApi" } }),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "source": ["contentApi", "managementApi"], "returnAll": [false] } }, defaults: { "source": "contentApi", "returnAll": false } }),
          filters: resolveSchema({ parameters, schema: z.object({ starts_with: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "source": ["contentApi", "managementApi"] } }, defaults: { "source": "contentApi" } }),
          space: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["managementApi"] } }, defaults: { "source": "contentApi" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/storyblok/v1/resource_story/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/storyblok/v1/resource_story/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/storyblok/v1/index.schema.js
var getStorySchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "story" } : parameters;
  return getStorySchema({ ...helpers, parameters: effectiveParams });
};
