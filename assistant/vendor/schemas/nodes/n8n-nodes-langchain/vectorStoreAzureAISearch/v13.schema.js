var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreAzureAISearch/v13/mode_insert.schema.js
var require_mode_insert_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreAzureAISearch/v13/mode_insert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, embeddingInstanceSchema, documentLoaderInstanceSchema }) {
      const subnodesSchema = z.object({
        embedding: z.union([embeddingInstanceSchema, z.array(embeddingInstanceSchema)]),
        documentLoader: z.union([documentLoaderInstanceSchema, z.array(documentLoaderInstanceSchema)])
      }).strict();
      return z.object({
        parameters: z.object({
          mode: z.literal("insert"),
          indexName: stringOrExpression.optional(),
          embeddingBatchSize: numberOrExpression.optional(),
          options: z.object({ clearIndex: booleanOrExpression.optional(), metadataKeysToInsert: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreAzureAISearch/v13/mode_load.schema.js
var require_mode_load_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreAzureAISearch/v13/mode_load.schema.js"(exports2, module2) {
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
          indexName: stringOrExpression.optional(),
          prompt: stringOrExpression,
          topK: numberOrExpression.optional(),
          includeDocumentMetadata: booleanOrExpression.optional(),
          useReranker: booleanOrExpression.optional(),
          options: z.object({ queryType: z.union([z.literal("vector"), z.literal("hybrid"), z.literal("semanticHybrid"), expressionSchema]).optional(), filter: stringOrExpression.optional(), semanticConfiguration: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: getSubnodesSchema()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreAzureAISearch/v13/mode_retrieve.schema.js
var require_mode_retrieve_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreAzureAISearch/v13/mode_retrieve.schema.js"(exports2, module2) {
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
          indexName: stringOrExpression.optional(),
          useReranker: booleanOrExpression.optional(),
          options: z.object({ queryType: z.union([z.literal("vector"), z.literal("hybrid"), z.literal("semanticHybrid"), expressionSchema]).optional(), filter: stringOrExpression.optional(), semanticConfiguration: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: getSubnodesSchema()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreAzureAISearch/v13/mode_retrieve_as_tool.schema.js
var require_mode_retrieve_as_tool_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreAzureAISearch/v13/mode_retrieve_as_tool.schema.js"(exports2, module2) {
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
          indexName: stringOrExpression.optional(),
          topK: numberOrExpression.optional(),
          includeDocumentMetadata: booleanOrExpression.optional(),
          useReranker: booleanOrExpression.optional(),
          options: z.object({ queryType: z.union([z.literal("vector"), z.literal("hybrid"), z.literal("semanticHybrid"), expressionSchema]).optional(), filter: stringOrExpression.optional(), semanticConfiguration: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: getSubnodesSchema()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreAzureAISearch/v13/mode_update.schema.js
var require_mode_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreAzureAISearch/v13/mode_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, embeddingInstanceSchema }) {
      const subnodesSchema = z.object({
        embedding: z.union([embeddingInstanceSchema, z.array(embeddingInstanceSchema)])
      }).strict();
      return z.object({
        parameters: z.object({
          mode: z.literal("update"),
          indexName: stringOrExpression.optional(),
          id: stringOrExpression
        }).optional(),
        subnodes: subnodesSchema
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/vectorStoreAzureAISearch/v13/index.schema.js
var getInsertSchema = require_mode_insert_schema();
var getLoadSchema = require_mode_load_schema();
var getRetrieveSchema = require_mode_retrieve_schema();
var getRetrieveAsToolSchema = require_mode_retrieve_as_tool_schema();
var getUpdateSchema = require_mode_update_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.mode === void 0 ? { ...parameters, mode: "retrieve" } : parameters;
  return z.union([
    getInsertSchema({ ...helpers, parameters: effectiveParams }),
    getLoadSchema({ ...helpers, parameters: effectiveParams }),
    getRetrieveSchema({ ...helpers, parameters: effectiveParams }),
    getRetrieveAsToolSchema({ ...helpers, parameters: effectiveParams }),
    getUpdateSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
