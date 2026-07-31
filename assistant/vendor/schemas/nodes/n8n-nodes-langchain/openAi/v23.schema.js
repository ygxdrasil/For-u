var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_text/operation_classify.schema.js
var require_operation_classify_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_text/operation_classify.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("text").default("text"),
          operation: z.literal("classify"),
          input: stringOrExpression.optional(),
          simplify: booleanOrExpression.optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_text/operation_response.schema.js
var require_operation_response_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_text/operation_response.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("text").default("text"),
          operation: z.literal("response"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          responses: z.object({ values: z.array(z.object({ type: z.union([z.literal("text"), z.literal("image"), z.literal("file"), expressionSchema]).optional(), role: z.union([z.literal("user"), z.literal("assistant"), z.literal("system"), expressionSchema]).optional(), content: stringOrExpression.optional(), imageType: z.union([z.literal("url"), z.literal("fileId"), z.literal("base64"), expressionSchema]).optional(), imageUrl: stringOrExpression.optional(), binaryPropertyName: stringOrExpression.optional(), fileId: stringOrExpression.optional(), imageDetail: z.union([z.literal("auto"), z.literal("low"), z.literal("high"), expressionSchema]).optional(), fileType: z.union([z.literal("url"), z.literal("fileId"), z.literal("base64"), expressionSchema]).optional(), fileUrl: stringOrExpression.optional(), fileName: stringOrExpression.optional() })).optional() }).optional(),
          simplify: booleanOrExpression.optional(),
          hideTools: resolveSchema({ parameters, schema: z.unknown(), required: false, displayOptions: { "show": { "modelId": ["gpt-3.5-turbo-16k-0613", "dall-e-3", "text-embedding-3-large", "dall-e-2", "whisper-1", "tts-1-hd-1106", "tts-1-hd", "gpt-4-0314", "text-embedding-3-small", "gpt-4-32k-0314", "gpt-3.5-turbo-0301", "gpt-4-vision-preview", "gpt-3.5-turbo-16k", "gpt-3.5-turbo-instruct-0914", "tts-1", "davinci-002", "gpt-3.5-turbo-instruct", "babbage-002", "tts-1-1106", "text-embedding-ada-002"] } }, defaults: { "modelId": { "mode": "list", "value": "" } } }),
          builtInTools: z.object({ webSearch: z.object({ searchContextSize: z.union([z.literal("low"), z.literal("medium"), z.literal("high"), expressionSchema]).optional(), allowedDomains: stringOrExpression.optional(), country: stringOrExpression.optional(), city: stringOrExpression.optional(), region: stringOrExpression.optional() }).optional(), fileSearch: z.object({ vectorStoreIds: z.union([iDataObjectSchema, z.string()]).optional(), filters: z.union([iDataObjectSchema, z.string()]).optional(), maxResults: numberOrExpression.optional() }).optional(), codeInterpreter: booleanOrExpression.optional() }).optional(),
          options: z.object({ conversationId: stringOrExpression.optional(), include: z.array(z.union([z.literal("code_interpreter_call.outputs"), z.literal("computer_call_output.output.image_url"), z.literal("file_search_call.results"), z.literal("message.input_image.image_url"), z.literal("message.output_text.logprobs"), z.literal("reasoning.encrypted_content"), z.literal("web_search_call.action.sources")])).optional(), instructions: stringOrExpression.optional(), maxTokens: numberOrExpression.optional(), maxToolsIterations: numberOrExpression.optional(), maxToolCalls: numberOrExpression.optional(), metadata: z.union([iDataObjectSchema, z.string()]).optional(), parallelToolCalls: booleanOrExpression.optional(), previousResponseId: stringOrExpression.optional(), promptConfig: z.object({ promptOptions: z.object({ promptId: stringOrExpression.optional(), version: stringOrExpression.optional(), variables: z.union([iDataObjectSchema, z.string()]).optional() }).optional() }).optional(), promptCacheKey: stringOrExpression.optional(), reasoning: z.object({ reasoningOptions: z.object({ effort: z.union([z.literal("low"), z.literal("medium"), z.literal("high"), expressionSchema]).optional(), summary: z.union([z.literal("none"), z.literal("auto"), z.literal("concise"), z.literal("detailed"), expressionSchema]).optional() }).optional() }).optional(), safetyIdentifier: stringOrExpression.optional(), serviceTier: z.union([z.literal("auto"), z.literal("flex"), z.literal("default"), z.literal("priority"), expressionSchema]).optional(), store: booleanOrExpression.optional(), textFormat: z.object({ textOptions: z.object({ type: z.union([z.literal("text"), z.literal("json_schema"), z.literal("json_object"), expressionSchema]).optional(), verbosity: z.union([z.literal("low"), z.literal("medium"), z.literal("high"), expressionSchema]).optional(), name: stringOrExpression.optional(), schema: z.union([iDataObjectSchema, z.string()]).optional(), description: stringOrExpression.optional(), strict: booleanOrExpression.optional() }).optional() }).optional(), topLogprobs: numberOrExpression.optional(), temperature: numberOrExpression.optional(), topP: numberOrExpression.optional(), truncation: booleanOrExpression.optional(), backgroundMode: z.object({ values: z.object({ enabled: booleanOrExpression.optional(), timeout: numberOrExpression.optional() }).optional() }).optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_text/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_text/index.schema.js"(exports2, module2) {
    var getClassifySchema = require_operation_classify_schema();
    var getResponseSchema = require_operation_response_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "generate" } : parameters;
      return z.union([
        getClassifySchema({ ...helpers, parameters: effectiveParams }),
        getResponseSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_image/operation_analyze.schema.js
var require_operation_analyze_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_image/operation_analyze.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("image"),
          operation: z.literal("analyze"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          text: stringOrExpression.optional(),
          inputType: z.union([z.literal("url"), z.literal("base64"), expressionSchema]).optional(),
          imageUrls: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["base64"] } }, defaults: { "inputType": "url" } }),
          simplify: booleanOrExpression.optional(),
          options: z.object({ detail: z.union([z.literal("auto"), z.literal("low"), z.literal("high"), expressionSchema]).optional(), maxTokens: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_image/operation_edit.schema.js
var require_operation_edit_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_image/operation_edit.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("image"),
          operation: z.literal("edit"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          prompt: stringOrExpression,
          images: resolveOneOfSchemas({ parameters, variants: [{ schema: z.object({ values: z.array(z.object({ binaryPropertyName: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "/model": ["gpt-image-1"] } } }, { schema: z.object({ values: z.array(z.object({ binaryPropertyName: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "/modelId": [{ "_cnd": { "includes": "gpt-image" } }] } } }] }),
          binaryPropertyName: resolveOneOfSchemas({ parameters, variants: [{ schema: stringOrExpression, required: false, displayOptions: { "show": { "/model": ["dall-e-2"] } } }, { schema: stringOrExpression, required: false, displayOptions: { "show": { "/modelId": [{ "_cnd": { "includes": "dall-e" } }] } } }] }),
          n: numberOrExpression.optional(),
          size: z.union([z.literal("256x256"), z.literal("512x512"), z.literal("1024x1024"), z.literal("1024x1536"), z.literal("1536x1024"), z.literal("auto"), expressionSchema]).optional(),
          quality: resolveOneOfSchemas({ parameters, variants: [{ schema: z.union([z.literal("auto"), z.literal("high"), z.literal("medium"), z.literal("low"), z.literal("standard"), expressionSchema]), required: false, displayOptions: { "show": { "/model": ["gpt-image-1"] } } }, { schema: z.union([z.literal("auto"), z.literal("high"), z.literal("medium"), z.literal("low"), z.literal("standard"), expressionSchema]), required: false, displayOptions: { "show": { "/modelId": [{ "_cnd": { "includes": "gpt-image" } }] } } }] }),
          responseFormat: resolveOneOfSchemas({ parameters, variants: [{ schema: z.union([z.literal("url"), z.literal("b64_json"), expressionSchema]), required: false, displayOptions: { "show": { "/model": ["dall-e-2"] } } }, { schema: z.union([z.literal("url"), z.literal("b64_json"), expressionSchema]), required: false, displayOptions: { "show": { "/modelId": [{ "_cnd": { "includes": "dall-e" } }] } } }] }),
          outputFormat: resolveOneOfSchemas({ parameters, variants: [{ schema: z.union([z.literal("png"), z.literal("jpeg"), z.literal("webp"), expressionSchema]), required: false, displayOptions: { "show": { "/model": ["gpt-image-1"] } } }, { schema: z.union([z.literal("png"), z.literal("jpeg"), z.literal("webp"), expressionSchema]), required: false, displayOptions: { "show": { "/modelId": [{ "_cnd": { "includes": "gpt-image" } }] } } }] }),
          outputCompression: resolveOneOfSchemas({ parameters, variants: [{ schema: numberOrExpression, required: false, displayOptions: { "show": { "/model": ["gpt-image-1"], "outputFormat": ["webp", "jpeg"] } }, defaults: { "outputFormat": "png" } }, { schema: numberOrExpression, required: false, displayOptions: { "show": { "/modelId": [{ "_cnd": { "includes": "gpt-image" } }], "outputFormat": ["webp", "jpeg"] } }, defaults: { "outputFormat": "png" } }] }),
          options: z.object({ user: stringOrExpression.optional(), background: z.union([z.literal("auto"), z.literal("transparent"), z.literal("opaque"), expressionSchema]).optional(), inputFidelity: z.union([z.literal("low"), z.literal("high"), expressionSchema]).optional(), imageMask: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_image/operation_generate.schema.js
var require_operation_generate_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_image/operation_generate.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("image"),
          operation: z.literal("generate").default("generate"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          prompt: stringOrExpression.optional(),
          options: z.object({ n: numberOrExpression.optional(), dalleQuality: z.union([z.literal("hd"), z.literal("standard"), expressionSchema]).optional(), quality: z.union([z.literal("high"), z.literal("medium"), z.literal("low"), expressionSchema]).optional(), size: z.union([z.union([z.literal("256x256"), z.literal("512x512"), z.literal("1024x1024"), expressionSchema]), z.union([z.literal("1024x1024"), z.literal("1792x1024"), z.literal("1024x1792"), expressionSchema]), z.union([z.literal("1024x1024"), z.literal("1024x1536"), z.literal("1536x1024"), expressionSchema])]).optional(), style: z.union([z.literal("natural"), z.literal("vivid"), expressionSchema]).optional(), returnImageUrls: booleanOrExpression.optional(), binaryPropertyOutput: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_image/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_image/index.schema.js"(exports2, module2) {
    var getAnalyzeSchema = require_operation_analyze_schema();
    var getEditSchema = require_operation_edit_schema();
    var getGenerateSchema = require_operation_generate_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "generate" } : parameters;
      return z.union([
        getAnalyzeSchema({ ...helpers, parameters: effectiveParams }),
        getEditSchema({ ...helpers, parameters: effectiveParams }),
        getGenerateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_audio/operation_generate.schema.js
var require_operation_generate_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_audio/operation_generate.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("audio"),
          operation: z.literal("generate").default("generate"),
          model: z.union([z.literal("tts-1"), z.literal("tts-1-hd"), expressionSchema]).optional(),
          input: stringOrExpression.optional(),
          voice: z.union([z.literal("alloy"), z.literal("echo"), z.literal("fable"), z.literal("nova"), z.literal("onyx"), z.literal("shimmer"), expressionSchema]).optional(),
          options: z.object({ response_format: z.union([z.literal("mp3"), z.literal("opus"), z.literal("aac"), z.literal("flac"), expressionSchema]).optional(), speed: numberOrExpression.optional(), binaryPropertyOutput: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_audio/operation_transcribe.schema.js
var require_operation_transcribe_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_audio/operation_transcribe.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("audio"),
          operation: z.literal("transcribe"),
          binaryPropertyName: stringOrExpression.optional(),
          options: z.object({ language: stringOrExpression.optional(), temperature: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_audio/operation_translate.schema.js
var require_operation_translate_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_audio/operation_translate.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("audio"),
          operation: z.literal("translate"),
          binaryPropertyName: stringOrExpression.optional(),
          options: z.object({ temperature: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_audio/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_audio/index.schema.js"(exports2, module2) {
    var getGenerateSchema = require_operation_generate_schema2();
    var getTranscribeSchema = require_operation_transcribe_schema();
    var getTranslateSchema = require_operation_translate_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "generate" } : parameters;
      return z.union([
        getGenerateSchema({ ...helpers, parameters: effectiveParams }),
        getTranscribeSchema({ ...helpers, parameters: effectiveParams }),
        getTranslateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_file/operation_delete_file.schema.js
var require_operation_delete_file_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_file/operation_delete_file.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("deleteFile"),
          fileId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_file/operation_list.schema.js
var require_operation_list_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_file/operation_list.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("list"),
          options: z.object({ purpose: z.union([z.literal("any"), z.literal("assistants"), z.literal("fine-tune"), z.literal("vision"), z.literal("user_data"), expressionSchema]).optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_file/operation_upload.schema.js
var require_operation_upload_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_file/operation_upload.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("upload"),
          binaryPropertyName: stringOrExpression.optional(),
          options: z.object({ purpose: z.union([z.literal("assistants"), z.literal("fine-tune"), z.literal("vision"), z.literal("user_data"), expressionSchema]).optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_file/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_file/index.schema.js"(exports2, module2) {
    var getDeleteFileSchema = require_operation_delete_file_schema();
    var getListSchema = require_operation_list_schema();
    var getUploadSchema = require_operation_upload_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "generate" } : parameters;
      return z.union([
        getDeleteFileSchema({ ...helpers, parameters: effectiveParams }),
        getListSchema({ ...helpers, parameters: effectiveParams }),
        getUploadSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_conversation/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_conversation/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("conversation"),
          operation: z.literal("create"),
          messages: z.object({ values: z.array(z.object({ role: z.union([z.literal("user"), z.literal("assistant"), z.literal("system"), expressionSchema]).optional(), content: stringOrExpression.optional() })).optional() }).optional(),
          options: z.object({ metadata: z.union([iDataObjectSchema, z.string()]).optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_conversation/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_conversation/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("conversation"),
          operation: z.literal("get"),
          conversationId: stringOrExpression
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_conversation/operation_remove.schema.js
var require_operation_remove_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_conversation/operation_remove.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("conversation"),
          operation: z.literal("remove"),
          conversationId: stringOrExpression
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_conversation/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_conversation/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("conversation"),
          operation: z.literal("update"),
          conversationId: stringOrExpression,
          metadata: z.union([iDataObjectSchema, z.string()]).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_conversation/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_conversation/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getGetSchema = require_operation_get_schema();
    var getRemoveSchema = require_operation_remove_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "generate" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getRemoveSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_video/operation_generate.schema.js
var require_operation_generate_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_video/operation_generate.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional(),
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("video"),
          operation: z.literal("generate").default("generate"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          prompt: stringOrExpression.optional(),
          seconds: numberOrExpression.optional(),
          size: z.union([z.literal("720x1280"), z.literal("1280x720"), z.literal("1024x1792"), z.literal("1792x1024"), expressionSchema]).optional(),
          options: z.object({ binaryPropertyNameReference: stringOrExpression.optional(), waitTime: numberOrExpression.optional(), fileName: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_video/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/resource_video/index.schema.js"(exports2, module2) {
    var getGenerateSchema = require_operation_generate_schema3();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "generate" } : parameters;
      return getGenerateSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/openAi/v23/index.schema.js
var getTextSchema = require_index_schema();
var getImageSchema = require_index_schema2();
var getAudioSchema = require_index_schema3();
var getFileSchema = require_index_schema4();
var getConversationSchema = require_index_schema5();
var getVideoSchema = require_index_schema6();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "text" } : parameters;
  return z.union([
    getTextSchema({ ...helpers, parameters: effectiveParams }),
    getImageSchema({ ...helpers, parameters: effectiveParams }),
    getAudioSchema({ ...helpers, parameters: effectiveParams }),
    getFileSchema({ ...helpers, parameters: effectiveParams }),
    getConversationSchema({ ...helpers, parameters: effectiveParams }),
    getVideoSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
