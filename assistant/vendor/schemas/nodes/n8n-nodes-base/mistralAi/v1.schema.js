var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mistralAi/v1/resource_document/operation_extract_text.schema.js
var require_operation_extract_text_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mistralAi/v1/resource_document/operation_extract_text.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("document").default("document"),
          operation: z.literal("extractText").default("extractText"),
          model: z.union([z.literal("mistral-ocr-latest"), expressionSchema]).optional(),
          documentType: z.union([z.literal("document_url"), z.literal("image_url"), expressionSchema]).optional(),
          inputType: z.union([z.literal("binary"), z.literal("url"), expressionSchema]).optional(),
          binaryProperty: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "binary" } }),
          url: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "binary" } }),
          options: z.object({ batch: booleanOrExpression.optional(), batchSize: numberOrExpression.optional(), deleteFiles: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mistralAi/v1/resource_document/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mistralAi/v1/resource_document/index.schema.js"(exports2, module2) {
    var getExtractTextSchema = require_operation_extract_text_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "extractText" } : parameters;
      return getExtractTextSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mistralAi/v1/index.schema.js
var getDocumentSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "document" } : parameters;
  return getDocumentSchema({ ...helpers, parameters: effectiveParams });
};
