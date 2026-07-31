var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/linkedIn/v1/resource_post/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/linkedIn/v1/resource_post/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("post").default("post"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("standard"), z.literal("communityManagement"), expressionSchema]).optional(),
          postAs: z.union([z.literal("person"), z.literal("organization"), expressionSchema]).optional(),
          person: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "postAs": ["person"] } }, defaults: { "postAs": "person" } }),
          organization: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "postAs": ["organization"] } }, defaults: { "postAs": "person" } }),
          text: stringOrExpression.optional(),
          shareMediaCategory: z.union([z.literal("NONE"), z.literal("ARTICLE"), z.literal("IMAGE"), expressionSchema]).optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "shareMediaCategory": ["IMAGE"] } }, defaults: { "shareMediaCategory": "NONE" } }),
          additionalFields: z.object({ description: stringOrExpression.optional(), originalUrl: stringOrExpression.optional(), thumbnailBinaryPropertyName: stringOrExpression.optional(), title: stringOrExpression.optional(), visibility: z.union([z.literal("CONNECTIONS"), z.literal("PUBLIC"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/linkedIn/v1/resource_post/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/linkedIn/v1/resource_post/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getCreateSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/linkedIn/v1/index.schema.js
var getPostSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "post" } : parameters;
  return getPostSchema({ ...helpers, parameters: effectiveParams });
};
