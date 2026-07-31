var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ghost/v1/resource_post/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ghost/v1/resource_post/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("post").default("post"),
          operation: z.literal("get").default("get"),
          source: z.union([z.literal("adminApi"), z.literal("contentApi"), expressionSchema]).optional(),
          by: resolveSchema({ parameters, schema: z.union([z.literal("id"), z.literal("slug"), expressionSchema]), required: false, displayOptions: { "show": { "source": ["contentApi", "adminApi"] } }, defaults: { "source": "contentApi" } }),
          identifier: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["contentApi", "adminApi"] } }, defaults: { "source": "contentApi" } }),
          options: resolveSchema({ parameters, schema: z.object({ fields: stringOrExpression.optional(), formats: z.array(z.union([z.literal("html"), z.literal("mobiledoc"), z.literal("lexical")])).optional() }), required: false, displayOptions: { "show": { "source": ["adminApi", "contentApi"] } }, defaults: { "source": "contentApi" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ghost/v1/resource_post/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ghost/v1/resource_post/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("post").default("post"),
          operation: z.literal("getAll"),
          source: z.union([z.literal("adminApi"), z.literal("contentApi"), expressionSchema]).optional(),
          returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "source": ["contentApi", "adminApi"] } }, defaults: { "source": "contentApi" } }),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "source": ["adminApi", "contentApi"], "returnAll": [false] } }, defaults: { "source": "contentApi", "returnAll": false } }),
          options: resolveSchema({ parameters, schema: z.object({ include: z.array(z.union([z.literal("authors"), z.literal("tags")])).optional(), fields: stringOrExpression.optional(), formats: z.array(z.union([z.literal("html"), z.literal("plaintext"), z.literal("lexical")])).optional() }), required: false, displayOptions: { "show": { "source": ["contentApi", "adminApi"] } }, defaults: { "source": "contentApi" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ghost/v1/resource_post/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ghost/v1/resource_post/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ghost/v1/index.schema.js
var getPostSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "post" } : parameters;
  return getPostSchema({ ...helpers, parameters: effectiveParams });
};
