var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_audio/operation_analyze.schema.js
var require_operation_analyze_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_audio/operation_analyze.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("audio"),
          operation: z.literal("analyze"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          text: stringOrExpression.optional(),
          inputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          audioUrls: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } }),
          simplify: booleanOrExpression.optional(),
          options: z.object({ maxOutputTokens: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_audio/operation_transcribe.schema.js
var require_operation_transcribe_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_audio/operation_transcribe.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("audio"),
          operation: z.literal("transcribe").default("transcribe"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          inputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          audioUrls: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } }),
          simplify: booleanOrExpression.optional(),
          options: z.object({ startTime: stringOrExpression.optional(), endTime: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_audio/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_audio/index.schema.js"(exports2, module2) {
    var getAnalyzeSchema = require_operation_analyze_schema();
    var getTranscribeSchema = require_operation_transcribe_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "transcribe" } : parameters;
      return z.union([
        getAnalyzeSchema({ ...helpers, parameters: effectiveParams }),
        getTranscribeSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_document/operation_analyze.schema.js
var require_operation_analyze_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_document/operation_analyze.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("document"),
          operation: z.literal("analyze"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          text: stringOrExpression.optional(),
          inputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          documentUrls: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } }),
          simplify: booleanOrExpression.optional(),
          options: z.object({ maxOutputTokens: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_document/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_document/index.schema.js"(exports2, module2) {
    var getAnalyzeSchema = require_operation_analyze_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "transcribe" } : parameters;
      return getAnalyzeSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file_search/operation_create_store.schema.js
var require_operation_create_store_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file_search/operation_create_store.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("fileSearch"),
          operation: z.literal("createStore"),
          displayName: stringOrExpression
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file_search/operation_delete_store.schema.js
var require_operation_delete_store_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file_search/operation_delete_store.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("fileSearch"),
          operation: z.literal("deleteStore"),
          fileSearchStoreName: stringOrExpression,
          force: booleanOrExpression.optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file_search/operation_list_stores.schema.js
var require_operation_list_stores_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file_search/operation_list_stores.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("fileSearch"),
          operation: z.literal("listStores"),
          pageSize: numberOrExpression.optional(),
          pageToken: stringOrExpression.optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file_search/operation_upload_to_store.schema.js
var require_operation_upload_to_store_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file_search/operation_upload_to_store.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("fileSearch"),
          operation: z.literal("uploadToStore"),
          fileSearchStoreName: stringOrExpression,
          displayName: stringOrExpression,
          inputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          fileUrl: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } })
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file_search/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file_search/index.schema.js"(exports2, module2) {
    var getCreateStoreSchema = require_operation_create_store_schema();
    var getDeleteStoreSchema = require_operation_delete_store_schema();
    var getListStoresSchema = require_operation_list_stores_schema();
    var getUploadToStoreSchema = require_operation_upload_to_store_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "transcribe" } : parameters;
      return z.union([
        getCreateStoreSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteStoreSchema({ ...helpers, parameters: effectiveParams }),
        getListStoresSchema({ ...helpers, parameters: effectiveParams }),
        getUploadToStoreSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_image/operation_analyze.schema.js
var require_operation_analyze_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_image/operation_analyze.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("image"),
          operation: z.literal("analyze"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          text: stringOrExpression.optional(),
          inputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          imageUrls: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } }),
          simplify: booleanOrExpression.optional(),
          options: z.object({ maxOutputTokens: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_image/operation_edit.schema.js
var require_operation_edit_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_image/operation_edit.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("image"),
          operation: z.literal("edit"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          prompt: stringOrExpression.optional(),
          images: z.object({ values: z.array(z.object({ binaryPropertyName: stringOrExpression.optional() })).optional() }).optional(),
          options: z.object({ binaryPropertyOutput: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_image/operation_generate.schema.js
var require_operation_generate_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_image/operation_generate.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("image"),
          operation: z.literal("generate"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          prompt: stringOrExpression.optional(),
          options: z.object({ sampleCount: numberOrExpression.optional(), binaryPropertyOutput: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_image/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_image/index.schema.js"(exports2, module2) {
    var getAnalyzeSchema = require_operation_analyze_schema3();
    var getEditSchema = require_operation_edit_schema();
    var getGenerateSchema = require_operation_generate_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "transcribe" } : parameters;
      return z.union([
        getAnalyzeSchema({ ...helpers, parameters: effectiveParams }),
        getEditSchema({ ...helpers, parameters: effectiveParams }),
        getGenerateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file/operation_upload.schema.js
var require_operation_upload_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file/operation_upload.schema.js"(exports2, module2) {
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
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } })
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_file/index.schema.js"(exports2, module2) {
    var getUploadSchema = require_operation_upload_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "transcribe" } : parameters;
      return getUploadSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_text/operation_message.schema.js
var require_operation_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_text/operation_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("text").default("text"),
          operation: z.literal("message"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          messages: z.object({ values: z.array(z.object({ content: stringOrExpression.optional(), role: z.union([z.literal("user"), z.literal("model"), expressionSchema]).optional() })).optional() }).optional(),
          simplify: booleanOrExpression.optional(),
          jsonOutput: booleanOrExpression.optional(),
          builtInTools: z.object({ googleSearch: booleanOrExpression.optional(), googleMaps: z.object({ latitude: numberOrExpression.optional(), longitude: numberOrExpression.optional() }).optional(), urlContext: booleanOrExpression.optional(), fileSearch: z.object({ fileSearchStoreNames: z.union([iDataObjectSchema, z.string()]).optional(), metadataFilter: stringOrExpression.optional() }).optional(), codeExecution: booleanOrExpression.optional() }).optional(),
          options: z.object({ includeMergedResponse: booleanOrExpression.optional(), systemMessage: stringOrExpression.optional(), codeExecution: booleanOrExpression.optional(), frequencyPenalty: numberOrExpression.optional(), maxOutputTokens: numberOrExpression.optional(), candidateCount: numberOrExpression.optional(), presencePenalty: numberOrExpression.optional(), temperature: numberOrExpression.optional(), topP: numberOrExpression.optional(), topK: numberOrExpression.optional(), thinkingBudget: numberOrExpression.optional(), maxToolsIterations: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_text/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_text/index.schema.js"(exports2, module2) {
    var getMessageSchema = require_operation_message_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "transcribe" } : parameters;
      return getMessageSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_video/operation_analyze.schema.js
var require_operation_analyze_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_video/operation_analyze.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("video"),
          operation: z.literal("analyze"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          text: stringOrExpression.optional(),
          inputType: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          videoUrls: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["url"] } }, defaults: { "inputType": "url" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "inputType": ["binary"] } }, defaults: { "inputType": "url" } }),
          simplify: booleanOrExpression.optional(),
          options: z.object({ maxOutputTokens: numberOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_video/operation_download.schema.js
var require_operation_download_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_video/operation_download.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("video"),
          operation: z.literal("download"),
          url: stringOrExpression.optional(),
          options: z.object({ binaryPropertyOutput: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_video/operation_generate.schema.js
var require_operation_generate_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_video/operation_generate.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {
      const subnodesSchema = z.object({
        tools: z.array(toolInstanceSchema).optional()
      }).strict();
      return z.object({
        parameters: z.object({
          resource: z.literal("video"),
          operation: z.literal("generate"),
          modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          prompt: stringOrExpression.optional(),
          returnAs: z.union([z.literal("video"), z.literal("url"), expressionSchema]).optional(),
          options: z.object({ sampleCount: numberOrExpression.optional(), durationSeconds: numberOrExpression.optional(), aspectRatio: z.union([z.literal("16:9"), z.literal("9:16"), expressionSchema]).optional(), personGeneration: z.union([z.literal("dont_allow"), z.literal("allow_adult"), z.literal("allow_all"), expressionSchema]).optional(), binaryPropertyOutput: stringOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_video/index.schema.js
var require_index_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/resource_video/index.schema.js"(exports2, module2) {
    var getAnalyzeSchema = require_operation_analyze_schema4();
    var getDownloadSchema = require_operation_download_schema();
    var getGenerateSchema = require_operation_generate_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "transcribe" } : parameters;
      return z.union([
        getAnalyzeSchema({ ...helpers, parameters: effectiveParams }),
        getDownloadSchema({ ...helpers, parameters: effectiveParams }),
        getGenerateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/googleGemini/v12/index.schema.js
var getAudioSchema = require_index_schema();
var getDocumentSchema = require_index_schema2();
var getFileSearchSchema = require_index_schema3();
var getImageSchema = require_index_schema4();
var getFileSchema = require_index_schema5();
var getTextSchema = require_index_schema6();
var getVideoSchema = require_index_schema7();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "text" } : parameters;
  return z.union([
    getAudioSchema({ ...helpers, parameters: effectiveParams }),
    getDocumentSchema({ ...helpers, parameters: effectiveParams }),
    getFileSearchSchema({ ...helpers, parameters: effectiveParams }),
    getImageSchema({ ...helpers, parameters: effectiveParams }),
    getFileSchema({ ...helpers, parameters: effectiveParams }),
    getTextSchema({ ...helpers, parameters: effectiveParams }),
    getVideoSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
