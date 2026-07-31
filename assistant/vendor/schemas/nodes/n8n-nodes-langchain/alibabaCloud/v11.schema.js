var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_text/operation_message.schema.js
var require_operation_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_text/operation_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("text").default("text"),
          operation: z.literal("message").default("message"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          messages: z.object({ messageValues: z.array(z.object({ content: stringOrExpression.optional(), role: z.union([z.literal("user"), z.literal("assistant"), expressionSchema]).optional() })).optional() }).optional(),
          simplify: booleanOrExpression.optional(),
          options: z.object({ enableSearch: booleanOrExpression.optional(), maxTokens: numberOrExpression.optional(), maxToolsIterations: numberOrExpression.optional(), repetitionPenalty: numberOrExpression.optional(), seed: numberOrExpression.optional(), stop: stringOrExpression.optional(), system: stringOrExpression.optional(), temperature: numberOrExpression.optional(), topK: numberOrExpression.optional(), topP: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_text/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_text/index.schema.js"(exports2, module2) {
    var getMessageSchema = require_operation_message_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "message" } : parameters;
      return getMessageSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_image/operation_analyze.schema.js
var require_operation_analyze_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_image/operation_analyze.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("image"),
          operation: z.literal("analyze"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          inputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          imageUrl: resolveSchema({ parameters, schema: stringOrExpression, required: true, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } }),
          question: stringOrExpression,
          simplify: booleanOrExpression.optional(),
          visionOptions: z.object({ temperature: numberOrExpression.optional(), maxTokens: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_image/operation_generate.schema.js
var require_operation_generate_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_image/operation_generate.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("image"),
          operation: z.literal("generate"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          prompt: stringOrExpression,
          downloadImage: booleanOrExpression.optional(),
          imageOptions: z.object({ size: z.union([z.union([z.literal("1024*1024"), z.literal("720*1280"), z.literal("1280*720"), expressionSchema]), z.union([z.literal("1104*1472"), z.literal("1328*1328"), z.literal("1472*1104"), z.literal("1664*928"), z.literal("928*1664"), expressionSchema])]).optional(), promptExtend: booleanOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_image/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_image/index.schema.js"(exports2, module2) {
    var getAnalyzeSchema = require_operation_analyze_schema();
    var getGenerateSchema = require_operation_generate_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "message" } : parameters;
      return z.union([
        getAnalyzeSchema({ ...helpers, parameters: effectiveParams }),
        getGenerateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_video/operation_image_to_video.schema.js
var require_operation_image_to_video_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_video/operation_image_to_video.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("video"),
          operation: z.literal("imageToVideo"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          inputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          imgUrl: resolveSchema({ parameters, schema: stringOrExpression, required: true, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } }),
          prompt: stringOrExpression.optional(),
          resolution: z.union([z.literal("720P"), z.literal("1080P"), expressionSchema]).optional(),
          duration: numberOrExpression.optional(),
          shotType: z.union([z.literal("single"), z.literal("multi"), expressionSchema]).optional(),
          downloadVideo: booleanOrExpression.optional(),
          simplify: booleanOrExpression.optional(),
          imageToVideoOptions: z.object({ promptExtend: booleanOrExpression.optional(), audio: booleanOrExpression.optional(), audioInputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(), audioUrl: stringOrExpression.optional(), audioBinaryPropertyName: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_video/operation_text_to_video.schema.js
var require_operation_text_to_video_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_video/operation_text_to_video.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("video"),
          operation: z.literal("textToVideo"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          prompt: stringOrExpression,
          resolution: z.union([z.literal("720P"), z.literal("1080P"), expressionSchema]).optional(),
          duration: numberOrExpression.optional(),
          shotType: z.union([z.literal("single"), z.literal("multi"), expressionSchema]).optional(),
          downloadVideo: booleanOrExpression.optional(),
          simplify: booleanOrExpression.optional(),
          videoOptions: z.object({ promptExtend: booleanOrExpression.optional(), audio: booleanOrExpression.optional(), audioInputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(), audioUrl: stringOrExpression.optional(), audioBinaryPropertyName: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_video/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/resource_video/index.schema.js"(exports2, module2) {
    var getImageToVideoSchema = require_operation_image_to_video_schema();
    var getTextToVideoSchema = require_operation_text_to_video_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "message" } : parameters;
      return z.union([
        getImageToVideoSchema({ ...helpers, parameters: effectiveParams }),
        getTextToVideoSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/alibabaCloud/v11/index.schema.js
var getTextSchema = require_index_schema();
var getImageSchema = require_index_schema2();
var getVideoSchema = require_index_schema3();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "text" } : parameters;
  return z.union([
    getTextSchema({ ...helpers, parameters: effectiveParams }),
    getImageSchema({ ...helpers, parameters: effectiveParams }),
    getVideoSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
