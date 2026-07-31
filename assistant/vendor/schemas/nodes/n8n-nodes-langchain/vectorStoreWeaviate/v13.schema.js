var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreWeaviate/v13/mode_insert.schema.js
var require_mode_insert_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreWeaviate/v13/mode_insert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, embeddingInstanceSchema, documentLoaderInstanceSchema }) {
      const subnodesSchema = z.object({
        embedding: z.union([embeddingInstanceSchema, z.array(embeddingInstanceSchema)]),
        documentLoader: z.union([documentLoaderInstanceSchema, z.array(documentLoaderInstanceSchema)])
      }).strict();
      return z.object({
        parameters: z.object({
          mode: z.literal("insert"),
          weaviateCollection: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          embeddingBatchSize: numberOrExpression.optional(),
          options: z.object({ tenant: stringOrExpression.optional(), textKey: stringOrExpression.optional(), skip_init_checks: booleanOrExpression.optional(), timeout_init: numberOrExpression.optional(), timeout_insert: numberOrExpression.optional(), timeout_query: numberOrExpression.optional(), proxy_grpc: stringOrExpression.optional(), clearStore: booleanOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreWeaviate/v13/mode_load.schema.js
var require_mode_load_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreWeaviate/v13/mode_load.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, embeddingInstanceSchema, rerankerInstanceSchema }) {
      function getSubnodesSchema() {
        return z.object({
          embedding: z.union([embeddingInstanceSchema, z.array(embeddingInstanceSchema)]),
          reranker: resolveSchema({ parameters, schema: rerankerInstanceSchema, required: true, displayOptions: { "show": { "useReranker": [true] } }, defaults: { "useReranker": false } })
        }).strict();
      }
      return z.object({
        parameters: z.object({
          mode: z.literal("load"),
          weaviateCollection: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          prompt: stringOrExpression,
          topK: numberOrExpression.optional(),
          includeDocumentMetadata: booleanOrExpression.optional(),
          useReranker: booleanOrExpression.optional(),
          options: z.object({ searchFilterJson: z.union([iDataObjectSchema, z.string()]).optional(), metadataKeys: stringOrExpression.optional(), hybridQuery: stringOrExpression.optional(), hybridExplainScore: booleanOrExpression.optional(), fusionType: z.union([z.literal("RelativeScore"), z.literal("Ranked"), expressionSchema]).optional(), autoCutLimit: numberOrExpression.optional(), alpha: numberOrExpression.optional(), queryProperties: stringOrExpression.optional(), maxVectorDistance: numberOrExpression.optional(), tenant: stringOrExpression.optional(), textKey: stringOrExpression.optional(), skip_init_checks: booleanOrExpression.optional(), timeout_init: numberOrExpression.optional(), timeout_insert: numberOrExpression.optional(), timeout_query: numberOrExpression.optional(), proxy_grpc: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: getSubnodesSchema()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreWeaviate/v13/mode_retrieve.schema.js
var require_mode_retrieve_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreWeaviate/v13/mode_retrieve.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, embeddingInstanceSchema, rerankerInstanceSchema }) {
      function getSubnodesSchema() {
        return z.object({
          embedding: z.union([embeddingInstanceSchema, z.array(embeddingInstanceSchema)]),
          reranker: resolveSchema({ parameters, schema: rerankerInstanceSchema, required: true, displayOptions: { "show": { "useReranker": [true] } }, defaults: { "useReranker": false } })
        }).strict();
      }
      return z.object({
        parameters: z.object({
          mode: z.literal("retrieve").default("retrieve"),
          weaviateCollection: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          useReranker: booleanOrExpression.optional(),
          options: z.object({ searchFilterJson: z.union([iDataObjectSchema, z.string()]).optional(), metadataKeys: stringOrExpression.optional(), hybridQuery: stringOrExpression.optional(), hybridExplainScore: booleanOrExpression.optional(), fusionType: z.union([z.literal("RelativeScore"), z.literal("Ranked"), expressionSchema]).optional(), autoCutLimit: numberOrExpression.optional(), alpha: numberOrExpression.optional(), queryProperties: stringOrExpression.optional(), maxVectorDistance: numberOrExpression.optional(), tenant: stringOrExpression.optional(), textKey: stringOrExpression.optional(), skip_init_checks: booleanOrExpression.optional(), timeout_init: numberOrExpression.optional(), timeout_insert: numberOrExpression.optional(), timeout_query: numberOrExpression.optional(), proxy_grpc: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: getSubnodesSchema()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreWeaviate/v13/mode_retrieve_as_tool.schema.js
var require_mode_retrieve_as_tool_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreWeaviate/v13/mode_retrieve_as_tool.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, embeddingInstanceSchema, rerankerInstanceSchema }) {
      function getSubnodesSchema() {
        return z.object({
          embedding: z.union([embeddingInstanceSchema, z.array(embeddingInstanceSchema)]),
          reranker: resolveSchema({ parameters, schema: rerankerInstanceSchema, required: true, displayOptions: { "show": { "useReranker": [true] } }, defaults: { "useReranker": false } })
        }).strict();
      }
      return z.object({
        parameters: z.object({
          mode: z.literal("retrieve-as-tool"),
          toolDescription: stringOrExpression,
          weaviateCollection: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          topK: numberOrExpression.optional(),
          includeDocumentMetadata: booleanOrExpression.optional(),
          useReranker: booleanOrExpression.optional(),
          options: z.object({ searchFilterJson: z.union([iDataObjectSchema, z.string()]).optional(), metadataKeys: stringOrExpression.optional(), hybridQuery: stringOrExpression.optional(), hybridExplainScore: booleanOrExpression.optional(), fusionType: z.union([z.literal("RelativeScore"), z.literal("Ranked"), expressionSchema]).optional(), autoCutLimit: numberOrExpression.optional(), alpha: numberOrExpression.optional(), queryProperties: stringOrExpression.optional(), maxVectorDistance: numberOrExpression.optional(), tenant: stringOrExpression.optional(), textKey: stringOrExpression.optional(), skip_init_checks: booleanOrExpression.optional(), timeout_init: numberOrExpression.optional(), timeout_insert: numberOrExpression.optional(), timeout_query: numberOrExpression.optional(), proxy_grpc: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: getSubnodesSchema()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreWeaviate/v13/index.schema.js
var getInsertSchema = require_mode_insert_schema();
var getLoadSchema = require_mode_load_schema();
var getRetrieveSchema = require_mode_retrieve_schema();
var getRetrieveAsToolSchema = require_mode_retrieve_as_tool_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.mode === void 0 ? { ...parameters, mode: "retrieve" } : parameters;
  return z.union([
    getInsertSchema({ ...helpers, parameters: effectiveParams }),
    getLoadSchema({ ...helpers, parameters: effectiveParams }),
    getRetrieveSchema({ ...helpers, parameters: effectiveParams }),
    getRetrieveAsToolSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
