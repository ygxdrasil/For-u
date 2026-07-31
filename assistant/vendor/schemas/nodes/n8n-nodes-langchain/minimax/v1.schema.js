var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_audio/operation_text_to_speech.schema.js
var require_operation_text_to_speech_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_audio/operation_text_to_speech.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("audio"),
          operation: z.literal("textToSpeech").default("textToSpeech"),
          modelId: z.union([z.literal("speech-02-hd"), z.literal("speech-02-turbo"), z.literal("speech-2.6-hd"), z.literal("speech-2.6-turbo"), z.literal("speech-2.8-hd"), z.literal("speech-2.8-turbo"), expressionSchema]).optional(),
          text: stringOrExpression,
          voiceId: stringOrExpression.optional(),
          downloadAudio: booleanOrExpression.optional(),
          options: z.object({ audioFormat: z.union([z.literal("mp3"), z.literal("pcm"), z.literal("flac"), z.literal("wav"), expressionSchema]).optional(), emotion: z.union([z.literal("angry"), z.literal("calm"), z.literal("disgusted"), z.literal("fearful"), z.literal("happy"), z.literal("sad"), z.literal("surprised"), expressionSchema]).optional(), languageBoost: z.union([z.literal("Arabic"), z.literal("auto"), z.literal("Chinese"), z.literal("English"), z.literal("French"), z.literal("German"), z.literal("Indonesian"), z.literal("Italian"), z.literal("Japanese"), z.literal("Korean"), z.literal("Portuguese"), z.literal("Russian"), z.literal("Spanish"), z.literal("Thai"), z.literal("Turkish"), z.literal("Vietnamese"), expressionSchema]).optional(), pitch: numberOrExpression.optional(), speed: numberOrExpression.optional(), volume: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_audio/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_audio/index.schema.js"(exports2, module2) {
    var getTextToSpeechSchema = require_operation_text_to_speech_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "textToSpeech" } : parameters;
      return getTextToSpeechSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_image/operation_generate.schema.js
var require_operation_generate_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_image/operation_generate.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("image"),
          operation: z.literal("generate"),
          modelId: z.union([z.literal("image-01"), expressionSchema]).optional(),
          prompt: stringOrExpression,
          aspectRatio: z.union([z.literal("1:1"), z.literal("16:9"), z.literal("2:3"), z.literal("21:9"), z.literal("3:2"), z.literal("3:4"), z.literal("4:3"), z.literal("9:16"), expressionSchema]).optional(),
          numberOfImages: numberOrExpression.optional(),
          downloadImage: booleanOrExpression.optional(),
          options: z.object({ promptOptimizer: booleanOrExpression.optional(), seed: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_image/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_image/index.schema.js"(exports2, module2) {
    var getGenerateSchema = require_operation_generate_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "textToSpeech" } : parameters;
      return getGenerateSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_text/operation_message.schema.js
var require_operation_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_text/operation_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("text").default("text"),
          operation: z.literal("message"),
          modelId: z.union([z.literal("MiniMax-M2"), z.literal("MiniMax-M2.1"), z.literal("MiniMax-M2.1-highspeed"), z.literal("MiniMax-M2.5"), z.literal("MiniMax-M2.5-highspeed"), z.literal("MiniMax-M2.7"), z.literal("MiniMax-M2.7-highspeed"), expressionSchema]).optional(),
          messages: z.object({ values: z.array(z.object({ content: stringOrExpression.optional(), role: z.union([z.literal("user"), z.literal("assistant"), expressionSchema]).optional() })).optional() }).optional(),
          simplify: booleanOrExpression.optional(),
          options: z.object({ hideThinking: booleanOrExpression.optional(), maxTokens: numberOrExpression.optional(), maxToolsIterations: numberOrExpression.optional(), temperature: numberOrExpression.optional(), topP: numberOrExpression.optional(), system: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_text/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_text/index.schema.js"(exports2, module2) {
    var getMessageSchema = require_operation_message_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "textToSpeech" } : parameters;
      return getMessageSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_video/operation_image_to_video.schema.js
var require_operation_image_to_video_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_video/operation_image_to_video.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("video"),
          operation: z.literal("imageToVideo"),
          modelId: z.union([z.literal("I2V-01"), z.literal("I2V-01-Director"), z.literal("I2V-01-live"), z.literal("MiniMax-Hailuo-02"), z.literal("MiniMax-Hailuo-2.3"), z.literal("MiniMax-Hailuo-2.3-Fast"), expressionSchema]).optional(),
          imageInputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          imageUrl: resolveSchema({ parameters, schema: stringOrExpression, required: true, displayOptions: { "show": { "imageInputType": ["url"] } }, defaults: { "imageInputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "imageInputType": ["binary"] } }, defaults: { "imageInputType": "url" } }),
          prompt: stringOrExpression.optional(),
          duration: z.union([z.literal(6), z.literal(10), expressionSchema]).optional(),
          resolution: z.union([z.literal("512P"), z.literal("720P"), z.literal("768P"), z.literal("1080P"), expressionSchema]).optional(),
          downloadVideo: booleanOrExpression.optional(),
          options: z.object({ promptOptimizer: booleanOrExpression.optional(), lastFrameInputType: z.union([z.literal("none"), z.literal("url"), z.literal("binary"), expressionSchema]).optional(), lastFrameImageUrl: stringOrExpression.optional(), lastFrameBinaryPropertyName: stringOrExpression.optional(), subjectReferenceInputType: z.union([z.literal("none"), z.literal("url"), z.literal("binary"), expressionSchema]).optional(), subjectReferenceImageUrl: stringOrExpression.optional(), subjectReferenceBinaryPropertyName: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_video/operation_text_to_video.schema.js
var require_operation_text_to_video_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_video/operation_text_to_video.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("video"),
          operation: z.literal("textToVideo"),
          modelId: z.union([z.literal("MiniMax-Hailuo-2.3"), z.literal("MiniMax-Hailuo-02"), z.literal("T2V-01-Director"), z.literal("T2V-01"), expressionSchema]).optional(),
          prompt: stringOrExpression,
          duration: z.union([z.literal(6), z.literal(10), expressionSchema]).optional(),
          resolution: z.union([z.literal("720P"), z.literal("768P"), z.literal("1080P"), expressionSchema]).optional(),
          downloadVideo: booleanOrExpression.optional(),
          options: z.object({ promptOptimizer: booleanOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_video/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/resource_video/index.schema.js"(exports2, module2) {
    var getImageToVideoSchema = require_operation_image_to_video_schema();
    var getTextToVideoSchema = require_operation_text_to_video_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "textToSpeech" } : parameters;
      return z.union([
        getImageToVideoSchema({ ...helpers, parameters: effectiveParams }),
        getTextToVideoSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/minimax/v1/index.schema.js
var getAudioSchema = require_index_schema();
var getImageSchema = require_index_schema2();
var getTextSchema = require_index_schema3();
var getVideoSchema = require_index_schema4();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "text" } : parameters;
  return z.union([
    getAudioSchema({ ...helpers, parameters: effectiveParams }),
    getImageSchema({ ...helpers, parameters: effectiveParams }),
    getTextSchema({ ...helpers, parameters: effectiveParams }),
    getVideoSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
