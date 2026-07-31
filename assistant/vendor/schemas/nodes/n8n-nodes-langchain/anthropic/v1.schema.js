var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_document/operation_analyze.schema.js
var require_operation_analyze_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_document/operation_analyze.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("document"),
          operation: z.literal("analyze").default("analyze"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          text: stringOrExpression.optional(),
          inputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          documentUrls: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } }),
          simplify: booleanOrExpression.optional(),
          options: z.object({ maxTokens: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_document/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_document/index.schema.js"(exports2, module2) {
    var getAnalyzeSchema = require_operation_analyze_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "analyze" } : parameters;
      return getAnalyzeSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_file/operation_delete_file.schema.js
var require_operation_delete_file_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_file/operation_delete_file.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("deleteFile"),
          fileId: stringOrExpression.optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_file/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_file/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("get"),
          fileId: stringOrExpression.optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_file/operation_list.schema.js
var require_operation_list_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_file/operation_list.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("list"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_file/operation_upload.schema.js
var require_operation_upload_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_file/operation_upload.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("upload"),
          inputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          fileUrl: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } }),
          options: z.object({ fileName: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_file/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_file/index.schema.js"(exports2, module2) {
    var getDeleteFileSchema = require_operation_delete_file_schema();
    var getGetSchema = require_operation_get_schema();
    var getListSchema = require_operation_list_schema();
    var getUploadSchema = require_operation_upload_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "analyze" } : parameters;
      return z.union([
        getDeleteFileSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getListSchema({ ...helpers, parameters: effectiveParams }),
        getUploadSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_image/operation_analyze.schema.js
var require_operation_analyze_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_image/operation_analyze.schema.js"(exports2, module2) {
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
          inputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          imageUrls: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } }),
          simplify: booleanOrExpression.optional(),
          options: z.object({ maxTokens: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_image/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_image/index.schema.js"(exports2, module2) {
    var getAnalyzeSchema = require_operation_analyze_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "analyze" } : parameters;
      return getAnalyzeSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_prompt/operation_generate.schema.js
var require_operation_generate_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_prompt/operation_generate.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("prompt"),
          operation: z.literal("generate"),
          task: stringOrExpression.optional(),
          simplify: booleanOrExpression.optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_prompt/operation_improve.schema.js
var require_operation_improve_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_prompt/operation_improve.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("prompt"),
          operation: z.literal("improve"),
          messages: z.object({ values: z.array(z.object({ content: stringOrExpression.optional(), role: z.union([z.literal("user"), z.literal("assistant"), expressionSchema]).optional() })).optional() }).optional(),
          simplify: booleanOrExpression.optional(),
          options: z.object({ system: stringOrExpression.optional(), feedback: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_prompt/operation_templatize.schema.js
var require_operation_templatize_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_prompt/operation_templatize.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("prompt"),
          operation: z.literal("templatize"),
          messages: z.object({ values: z.array(z.object({ content: stringOrExpression.optional(), role: z.union([z.literal("user"), z.literal("assistant"), expressionSchema]).optional() })).optional() }).optional(),
          simplify: booleanOrExpression.optional(),
          options: z.object({ system: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_prompt/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_prompt/index.schema.js"(exports2, module2) {
    var getGenerateSchema = require_operation_generate_schema();
    var getImproveSchema = require_operation_improve_schema();
    var getTemplatizeSchema = require_operation_templatize_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "analyze" } : parameters;
      return z.union([
        getGenerateSchema({ ...helpers, parameters: effectiveParams }),
        getImproveSchema({ ...helpers, parameters: effectiveParams }),
        getTemplatizeSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_text/operation_message.schema.js
var require_operation_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_text/operation_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("text").default("text"),
          operation: z.literal("message"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          messages: z.object({ values: z.array(z.object({ content: stringOrExpression.optional(), role: z.union([z.literal("user"), z.literal("assistant"), expressionSchema]).optional() })).optional() }).optional(),
          addAttachments: booleanOrExpression.optional(),
          attachmentsInputType: resolveSchema({ parameters, schema: z.union([z.literal("url"), z.literal("binary"), expressionSchema]), required: false, displayOptions: { "show": { "addAttachments": [true] } }, defaults: { "addAttachments": false } }),
          attachmentsUrls: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "addAttachments": [true], "attachmentsInputType": ["url"] } }, defaults: { "addAttachments": false, "attachmentsInputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "addAttachments": [true], "attachmentsInputType": ["binary"] } }, defaults: { "addAttachments": false, "attachmentsInputType": "url" } }),
          simplify: booleanOrExpression.optional(),
          options: z.object({ includeMergedResponse: booleanOrExpression.optional(), system: stringOrExpression.optional(), codeExecution: booleanOrExpression.optional(), webSearch: booleanOrExpression.optional(), maxUses: numberOrExpression.optional(), allowedDomains: stringOrExpression.optional(), blockedDomains: stringOrExpression.optional(), maxTokens: numberOrExpression.optional(), temperature: numberOrExpression.optional(), topP: numberOrExpression.optional(), topK: numberOrExpression.optional(), maxToolsIterations: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_text/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/resource_text/index.schema.js"(exports2, module2) {
    var getMessageSchema = require_operation_message_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "analyze" } : parameters;
      return getMessageSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/anthropic/v1/index.schema.js
var getDocumentSchema = require_index_schema();
var getFileSchema = require_index_schema2();
var getImageSchema = require_index_schema3();
var getPromptSchema = require_index_schema4();
var getTextSchema = require_index_schema5();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "text" } : parameters;
  return z.union([
    getDocumentSchema({ ...helpers, parameters: effectiveParams }),
    getFileSchema({ ...helpers, parameters: effectiveParams }),
    getImageSchema({ ...helpers, parameters: effectiveParams }),
    getPromptSchema({ ...helpers, parameters: effectiveParams }),
    getTextSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
