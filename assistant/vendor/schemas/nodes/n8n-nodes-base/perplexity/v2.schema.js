var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_agent/operation_create_response.schema.js
var require_operation_create_response_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_agent/operation_create_response.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("agent"),
          operation: z.literal("createResponse").default("createResponse"),
          input: stringOrExpression.optional(),
          model: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          preset: stringOrExpression.optional(),
          simplify: booleanOrExpression.optional(),
          options: z.object({ instructions: stringOrExpression.optional(), languagePreference: stringOrExpression.optional(), maxOutputTokens: numberOrExpression.optional(), maxSteps: numberOrExpression.optional(), modelsFallback: stringOrExpression.optional(), reasoning: z.union([iDataObjectSchema, z.string()]).optional(), responseFormat: z.union([iDataObjectSchema, z.string()]).optional(), tools: z.union([iDataObjectSchema, z.string()]).optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_agent/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_agent/index.schema.js"(exports2, module2) {
    var getCreateResponseSchema = require_operation_create_response_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "createResponse" } : parameters;
      return getCreateResponseSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_chat/operation_complete.schema.js
var require_operation_complete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_chat/operation_complete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("chat").default("chat"),
          operation: z.literal("complete"),
          model: z.union([z.literal("sonar"), z.literal("sonar-deep-research"), z.literal("sonar-pro"), z.literal("sonar-reasoning-pro"), expressionSchema]).optional(),
          messages: z.object({ message: z.array(z.object({ content: stringOrExpression.optional(), role: z.union([z.literal("assistant"), z.literal("system"), z.literal("user"), expressionSchema]).optional() })).optional() }).optional(),
          simplify: booleanOrExpression.optional(),
          options: z.object({ disableSearch: booleanOrExpression.optional(), enableSearchClassifier: booleanOrExpression.optional(), frequencyPenalty: numberOrExpression.optional(), imageDomainFilter: stringOrExpression.optional(), imageFormatFilter: stringOrExpression.optional(), languagePreference: stringOrExpression.optional(), lastUpdatedAfter: stringOrExpression.optional(), lastUpdatedBefore: stringOrExpression.optional(), maxTokens: numberOrExpression.optional(), temperature: numberOrExpression.optional(), presencePenalty: numberOrExpression.optional(), reasoningEffort: z.union([z.literal("minimal"), z.literal("low"), z.literal("medium"), z.literal("high"), expressionSchema]).optional(), responseFormat: z.union([iDataObjectSchema, z.string()]).optional(), returnImages: booleanOrExpression.optional(), returnRelatedQuestions: booleanOrExpression.optional(), searchAfterDate: stringOrExpression.optional(), searchBeforeDate: stringOrExpression.optional(), searchDomainFilter: stringOrExpression.optional(), searchLanguageFilter: stringOrExpression.optional(), searchMode: z.union([z.literal("web"), z.literal("academic"), z.literal("sec"), expressionSchema]).optional(), searchRecency: z.union([z.literal("day"), z.literal("hour"), z.literal("month"), z.literal("week"), z.literal("year"), expressionSchema]).optional(), stop: stringOrExpression.optional(), topK: numberOrExpression.optional(), topP: numberOrExpression.optional(), webSearchOptions: z.union([iDataObjectSchema, z.string()]).optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_chat/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_chat/index.schema.js"(exports2, module2) {
    var getCompleteSchema = require_operation_complete_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "createResponse" } : parameters;
      return getCompleteSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_embedding/operation_create_contextualized.schema.js
var require_operation_create_contextualized_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_embedding/operation_create_contextualized.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("embedding"),
          operation: z.literal("createContextualized"),
          model: z.union([z.literal("pplx-embed-context-v1-4b"), expressionSchema]).optional(),
          input: z.union([iDataObjectSchema, z.string()]).optional(),
          options: z.object({ dimensions: numberOrExpression.optional(), encoding_format: z.union([z.literal("base64_int8"), z.literal("base64_binary"), expressionSchema]).optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_embedding/operation_create_embedding.schema.js
var require_operation_create_embedding_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_embedding/operation_create_embedding.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("embedding"),
          operation: z.literal("createEmbedding"),
          model: z.union([z.literal("pplx-embed-v1-0.6b"), z.literal("pplx-embed-v1-4b"), expressionSchema]).optional(),
          input: stringOrExpression.optional(),
          options: z.object({ dimensions: numberOrExpression.optional(), encoding_format: z.union([z.literal("base64_int8"), z.literal("base64_binary"), expressionSchema]).optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_embedding/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_embedding/index.schema.js"(exports2, module2) {
    var getCreateContextualizedSchema = require_operation_create_contextualized_schema();
    var getCreateEmbeddingSchema = require_operation_create_embedding_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "createResponse" } : parameters;
      return z.union([
        getCreateContextualizedSchema({ ...helpers, parameters: effectiveParams }),
        getCreateEmbeddingSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_search/operation_search.schema.js
var require_operation_search_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_search/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("search"),
          operation: z.literal("search"),
          query: stringOrExpression.optional(),
          simplify: booleanOrExpression.optional(),
          options: z.object({ country: stringOrExpression.optional(), lastUpdatedAfter: stringOrExpression.optional(), lastUpdatedBefore: stringOrExpression.optional(), maxResults: numberOrExpression.optional(), maxTokens: numberOrExpression.optional(), maxTokensPerPage: numberOrExpression.optional(), searchAfterDate: stringOrExpression.optional(), searchBeforeDate: stringOrExpression.optional(), searchDomainFilter: stringOrExpression.optional(), searchLanguageFilter: stringOrExpression.optional(), searchRecencyFilter: z.union([z.literal("day"), z.literal("hour"), z.literal("month"), z.literal("week"), z.literal("year"), expressionSchema]).optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_search/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/resource_search/index.schema.js"(exports2, module2) {
    var getSearchSchema2 = require_operation_search_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "createResponse" } : parameters;
      return getSearchSchema2({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/perplexity/v2/index.schema.js
var getAgentSchema = require_index_schema();
var getChatSchema = require_index_schema2();
var getEmbeddingSchema = require_index_schema3();
var getSearchSchema = require_index_schema4();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "chat" } : parameters;
  return z.union([
    getAgentSchema({ ...helpers, parameters: effectiveParams }),
    getChatSchema({ ...helpers, parameters: effectiveParams }),
    getEmbeddingSchema({ ...helpers, parameters: effectiveParams }),
    getSearchSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
