var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudNaturalLanguage/v1/resource_document/operation_analyze_sentiment.schema.js
var require_operation_analyze_sentiment_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudNaturalLanguage/v1/resource_document/operation_analyze_sentiment.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("document").default("document"),
          operation: z.literal("analyzeSentiment").default("analyzeSentiment"),
          source: z.union([z.literal("content"), z.literal("gcsContentUri"), expressionSchema]).optional(),
          content: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["content"] } }, defaults: { "source": "content" } }),
          gcsContentUri: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["gcsContentUri"] } }, defaults: { "source": "content" } }),
          options: z.object({ documentType: z.union([z.literal("HTML"), z.literal("PLAIN_TEXT"), expressionSchema]).optional(), encodingType: z.union([z.literal("NONE"), z.literal("UTF8"), z.literal("UTF16"), z.literal("UTF32"), expressionSchema]).optional(), language: z.union([z.literal("ar"), z.literal("zh"), z.literal("zh-Hant"), z.literal("nl"), z.literal("en"), z.literal("fr"), z.literal("de"), z.literal("id"), z.literal("it"), z.literal("ja"), z.literal("ko"), z.literal("pt"), z.literal("es"), z.literal("th"), z.literal("tr"), z.literal("vi"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudNaturalLanguage/v1/resource_document/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudNaturalLanguage/v1/resource_document/index.schema.js"(exports2, module2) {
    var getAnalyzeSentimentSchema = require_operation_analyze_sentiment_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "analyzeSentiment" } : parameters;
      return getAnalyzeSentimentSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudNaturalLanguage/v1/index.schema.js
var getDocumentSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "document" } : parameters;
  return getDocumentSchema({ ...helpers, parameters: effectiveParams });
};
