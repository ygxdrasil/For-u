var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/ollama/v1/resource_image/operation_analyze.schema.js
var require_operation_analyze_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/ollama/v1/resource_image/operation_analyze.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("image"),
          operation: z.literal("analyze").default("analyze"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          text: stringOrExpression.optional(),
          inputType: z.union([z.literal("binary"), z.literal("url"), expressionSchema]).optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "binary" } }),
          imageUrls: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "binary" } }),
          simplify: booleanOrExpression.optional(),
          options: z.object({ system: stringOrExpression.optional(), temperature: numberOrExpression.optional(), think: booleanOrExpression.optional(), top_p: numberOrExpression.optional(), top_k: numberOrExpression.optional(), num_predict: numberOrExpression.optional(), frequency_penalty: numberOrExpression.optional(), presence_penalty: numberOrExpression.optional(), repeat_penalty: numberOrExpression.optional(), num_ctx: numberOrExpression.optional(), repeat_last_n: numberOrExpression.optional(), min_p: numberOrExpression.optional(), seed: numberOrExpression.optional(), stop: stringOrExpression.optional(), keep_alive: stringOrExpression.optional(), low_vram: booleanOrExpression.optional(), main_gpu: numberOrExpression.optional(), num_batch: numberOrExpression.optional(), num_gpu: numberOrExpression.optional(), num_thread: numberOrExpression.optional(), penalize_newline: booleanOrExpression.optional(), use_mlock: booleanOrExpression.optional(), use_mmap: booleanOrExpression.optional(), vocab_only: booleanOrExpression.optional(), format: z.union([z.literal(""), z.literal("json"), expressionSchema]).optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/ollama/v1/resource_image/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/ollama/v1/resource_image/index.schema.js"(exports2, module2) {
    var getAnalyzeSchema = require_operation_analyze_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "analyze" } : parameters;
      return getAnalyzeSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/ollama/v1/resource_text/operation_message.schema.js
var require_operation_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/ollama/v1/resource_text/operation_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("text").default("text"),
          operation: z.literal("message"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          messages: z.object({ values: z.array(z.object({ content: stringOrExpression.optional(), role: z.union([z.literal("user"), z.literal("assistant"), expressionSchema]).optional() })).optional() }).optional(),
          simplify: booleanOrExpression.optional(),
          options: z.object({ system: stringOrExpression.optional(), temperature: numberOrExpression.optional(), think: booleanOrExpression.optional(), top_p: numberOrExpression.optional(), top_k: numberOrExpression.optional(), num_predict: numberOrExpression.optional(), frequency_penalty: numberOrExpression.optional(), presence_penalty: numberOrExpression.optional(), repeat_penalty: numberOrExpression.optional(), num_ctx: numberOrExpression.optional(), repeat_last_n: numberOrExpression.optional(), min_p: numberOrExpression.optional(), seed: numberOrExpression.optional(), stop: stringOrExpression.optional(), keep_alive: stringOrExpression.optional(), low_vram: booleanOrExpression.optional(), main_gpu: numberOrExpression.optional(), num_batch: numberOrExpression.optional(), num_gpu: numberOrExpression.optional(), num_thread: numberOrExpression.optional(), penalize_newline: booleanOrExpression.optional(), use_mlock: booleanOrExpression.optional(), use_mmap: booleanOrExpression.optional(), vocab_only: booleanOrExpression.optional(), format: z.union([z.literal(""), z.literal("json"), expressionSchema]).optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/ollama/v1/resource_text/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/ollama/v1/resource_text/index.schema.js"(exports2, module2) {
    var getMessageSchema = require_operation_message_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "analyze" } : parameters;
      return getMessageSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/ollama/v1/index.schema.js
var getImageSchema = require_index_schema();
var getTextSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "text" } : parameters;
  return z.union([
    getImageSchema({ ...helpers, parameters: effectiveParams }),
    getTextSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
