var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_databricks_sql/operation_execute_query.schema.js
var require_operation_execute_query_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_databricks_sql/operation_execute_query.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("databricksSql").default("databricksSql"),
          operation: z.literal("executeQuery"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          warehouseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id"), z.literal("url")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          query: stringOrExpression.optional(),
          queryParameters: z.object({ parameters: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional(), type: z.union([z.literal(""), z.literal("BOOLEAN"), z.literal("DATE"), z.literal("DOUBLE"), z.literal("FLOAT"), z.literal("INT"), z.literal("LONG"), z.literal("STRING"), z.literal("TIMESTAMP"), expressionSchema]).optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_databricks_sql/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_databricks_sql/index.schema.js"(exports2, module2) {
    var getExecuteQuerySchema = require_operation_execute_query_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "listDirectory" } : parameters;
      return getExecuteQuerySchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_create_directory.schema.js
var require_operation_create_directory_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_create_directory.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("files"),
          operation: z.literal("createDirectory"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          volumePath: stringOrExpression.optional(),
          directoryPath: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_delete_directory.schema.js
var require_operation_delete_directory_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_delete_directory.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("files"),
          operation: z.literal("deleteDirectory"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          volumePath: stringOrExpression.optional(),
          directoryPath: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_delete_file.schema.js
var require_operation_delete_file_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_delete_file.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("files"),
          operation: z.literal("deleteFile"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          volumePath: stringOrExpression.optional(),
          filePath: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_download_file.schema.js
var require_operation_download_file_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_download_file.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("files"),
          operation: z.literal("downloadFile"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          volumePath: stringOrExpression.optional(),
          filePath: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_get_file_info.schema.js
var require_operation_get_file_info_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_get_file_info.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("files"),
          operation: z.literal("getFileInfo"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          volumePath: stringOrExpression.optional(),
          filePath: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_list_directory.schema.js
var require_operation_list_directory_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_list_directory.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("files"),
          operation: z.literal("listDirectory").default("listDirectory"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          volumePath: stringOrExpression.optional(),
          directoryPath: stringOrExpression.optional(),
          additionalFields: z.object({ pageSize: numberOrExpression.optional(), pageToken: stringOrExpression.optional(), overwrite: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_upload_file.schema.js
var require_operation_upload_file_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/operation_upload_file.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("files"),
          operation: z.literal("uploadFile"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          volumePath: stringOrExpression.optional(),
          filePath: stringOrExpression.optional(),
          dataFieldName: stringOrExpression.optional(),
          additionalFields: z.object({ pageSize: numberOrExpression.optional(), pageToken: stringOrExpression.optional(), overwrite: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_files/index.schema.js"(exports2, module2) {
    var getCreateDirectorySchema = require_operation_create_directory_schema();
    var getDeleteDirectorySchema = require_operation_delete_directory_schema();
    var getDeleteFileSchema = require_operation_delete_file_schema();
    var getDownloadFileSchema = require_operation_download_file_schema();
    var getGetFileInfoSchema = require_operation_get_file_info_schema();
    var getListDirectorySchema = require_operation_list_directory_schema();
    var getUploadFileSchema = require_operation_upload_file_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "listDirectory" } : parameters;
      return z.union([
        getCreateDirectorySchema({ ...helpers, parameters: effectiveParams }),
        getDeleteDirectorySchema({ ...helpers, parameters: effectiveParams }),
        getDeleteFileSchema({ ...helpers, parameters: effectiveParams }),
        getDownloadFileSchema({ ...helpers, parameters: effectiveParams }),
        getGetFileInfoSchema({ ...helpers, parameters: effectiveParams }),
        getListDirectorySchema({ ...helpers, parameters: effectiveParams }),
        getUploadFileSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_create_message.schema.js
var require_operation_create_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_create_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("genie"),
          operation: z.literal("createMessage"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          spaceId: stringOrExpression.optional(),
          conversationId: stringOrExpression.optional(),
          message: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_execute_message_query.schema.js
var require_operation_execute_message_query_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_execute_message_query.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("genie"),
          operation: z.literal("executeMessageQuery"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          spaceId: stringOrExpression.optional(),
          conversationId: stringOrExpression.optional(),
          messageId: stringOrExpression.optional(),
          attachmentId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_get_message.schema.js
var require_operation_get_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_get_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("genie"),
          operation: z.literal("getMessage"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          spaceId: stringOrExpression.optional(),
          conversationId: stringOrExpression.optional(),
          messageId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_get_query_results.schema.js
var require_operation_get_query_results_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_get_query_results.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("genie"),
          operation: z.literal("getQueryResults"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          spaceId: stringOrExpression.optional(),
          conversationId: stringOrExpression.optional(),
          messageId: stringOrExpression.optional(),
          attachmentId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_get_space.schema.js
var require_operation_get_space_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_get_space.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("genie"),
          operation: z.literal("getSpace"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          spaceId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_start_conversation.schema.js
var require_operation_start_conversation_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/operation_start_conversation.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("genie"),
          operation: z.literal("startConversation"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          spaceId: stringOrExpression.optional(),
          initialMessage: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_genie/index.schema.js"(exports2, module2) {
    var getCreateMessageSchema = require_operation_create_message_schema();
    var getExecuteMessageQuerySchema = require_operation_execute_message_query_schema();
    var getGetMessageSchema = require_operation_get_message_schema();
    var getGetQueryResultsSchema = require_operation_get_query_results_schema();
    var getGetSpaceSchema = require_operation_get_space_schema();
    var getStartConversationSchema = require_operation_start_conversation_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "listDirectory" } : parameters;
      return z.union([
        getCreateMessageSchema({ ...helpers, parameters: effectiveParams }),
        getExecuteMessageQuerySchema({ ...helpers, parameters: effectiveParams }),
        getGetMessageSchema({ ...helpers, parameters: effectiveParams }),
        getGetQueryResultsSchema({ ...helpers, parameters: effectiveParams }),
        getGetSpaceSchema({ ...helpers, parameters: effectiveParams }),
        getStartConversationSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_model_serving/operation_query_endpoint.schema.js
var require_operation_query_endpoint_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_model_serving/operation_query_endpoint.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("modelServing"),
          operation: z.literal("queryEndpoint"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          endpointName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("name"), z.literal("url")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          requestBody: z.union([iDataObjectSchema, z.string()]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_model_serving/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_model_serving/index.schema.js"(exports2, module2) {
    var getQueryEndpointSchema = require_operation_query_endpoint_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "listDirectory" } : parameters;
      return getQueryEndpointSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_create_catalog.schema.js
var require_operation_create_catalog_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_create_catalog.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("createCatalog"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          comment: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_create_function.schema.js
var require_operation_create_function_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_create_function.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("createFunction"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          functionName: stringOrExpression.optional(),
          inputParams: z.union([iDataObjectSchema, z.string()]).optional(),
          returnType: stringOrExpression.optional(),
          routineBody: stringOrExpression.optional(),
          routineDefinition: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_create_table.schema.js
var require_operation_create_table_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_create_table.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("createTable"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          tableName: stringOrExpression.optional(),
          storageLocation: stringOrExpression.optional(),
          tableAdditionalFields: z.object({ columns: z.union([iDataObjectSchema, z.string()]).optional(), comment: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_create_volume.schema.js
var require_operation_create_volume_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_create_volume.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("createVolume"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          volumeName: stringOrExpression.optional(),
          volumeType: z.union([z.literal("MANAGED"), z.literal("EXTERNAL"), expressionSchema]).optional(),
          additionalFields: z.object({ comment: stringOrExpression.optional(), storage_location: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_delete_catalog.schema.js
var require_operation_delete_catalog_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_delete_catalog.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("deleteCatalog"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_delete_function.schema.js
var require_operation_delete_function_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_delete_function.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("deleteFunction"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          fullName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_delete_table.schema.js
var require_operation_delete_table_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_delete_table.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("deleteTable"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          fullName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_delete_volume.schema.js
var require_operation_delete_volume_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_delete_volume.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("deleteVolume"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          volumeName: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_get_catalog.schema.js
var require_operation_get_catalog_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_get_catalog.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("getCatalog"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_get_function.schema.js
var require_operation_get_function_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_get_function.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("getFunction"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          fullName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_get_table.schema.js
var require_operation_get_table_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_get_table.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("getTable"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          fullName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_get_volume.schema.js
var require_operation_get_volume_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_get_volume.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("getVolume"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          volumeName: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_list_catalogs.schema.js
var require_operation_list_catalogs_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_list_catalogs.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("listCatalogs"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_list_functions.schema.js
var require_operation_list_functions_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_list_functions.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("listFunctions"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_list_tables.schema.js
var require_operation_list_tables_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_list_tables.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("listTables"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_list_volumes.schema.js
var require_operation_list_volumes_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_list_volumes.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("listVolumes"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          schemaName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_update_catalog.schema.js
var require_operation_update_catalog_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/operation_update_catalog.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("unityCatalog"),
          operation: z.literal("updateCatalog"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          catalogName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("string")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          comment: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_unity_catalog/index.schema.js"(exports2, module2) {
    var getCreateCatalogSchema = require_operation_create_catalog_schema();
    var getCreateFunctionSchema = require_operation_create_function_schema();
    var getCreateTableSchema = require_operation_create_table_schema();
    var getCreateVolumeSchema = require_operation_create_volume_schema();
    var getDeleteCatalogSchema = require_operation_delete_catalog_schema();
    var getDeleteFunctionSchema = require_operation_delete_function_schema();
    var getDeleteTableSchema = require_operation_delete_table_schema();
    var getDeleteVolumeSchema = require_operation_delete_volume_schema();
    var getGetCatalogSchema = require_operation_get_catalog_schema();
    var getGetFunctionSchema = require_operation_get_function_schema();
    var getGetTableSchema = require_operation_get_table_schema();
    var getGetVolumeSchema = require_operation_get_volume_schema();
    var getListCatalogsSchema = require_operation_list_catalogs_schema();
    var getListFunctionsSchema = require_operation_list_functions_schema();
    var getListTablesSchema = require_operation_list_tables_schema();
    var getListVolumesSchema = require_operation_list_volumes_schema();
    var getUpdateCatalogSchema = require_operation_update_catalog_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "listDirectory" } : parameters;
      return z.union([
        getCreateCatalogSchema({ ...helpers, parameters: effectiveParams }),
        getCreateFunctionSchema({ ...helpers, parameters: effectiveParams }),
        getCreateTableSchema({ ...helpers, parameters: effectiveParams }),
        getCreateVolumeSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteCatalogSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteFunctionSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteTableSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteVolumeSchema({ ...helpers, parameters: effectiveParams }),
        getGetCatalogSchema({ ...helpers, parameters: effectiveParams }),
        getGetFunctionSchema({ ...helpers, parameters: effectiveParams }),
        getGetTableSchema({ ...helpers, parameters: effectiveParams }),
        getGetVolumeSchema({ ...helpers, parameters: effectiveParams }),
        getListCatalogsSchema({ ...helpers, parameters: effectiveParams }),
        getListFunctionsSchema({ ...helpers, parameters: effectiveParams }),
        getListTablesSchema({ ...helpers, parameters: effectiveParams }),
        getListVolumesSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateCatalogSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_vector_search/operation_create_index.schema.js
var require_operation_create_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_vector_search/operation_create_index.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("vectorSearch"),
          operation: z.literal("createIndex"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          indexName: stringOrExpression.optional(),
          endpointName: stringOrExpression.optional(),
          primaryKey: stringOrExpression.optional(),
          indexType: z.union([z.literal("DELTA_SYNC"), z.literal("DIRECT_ACCESS"), expressionSchema]).optional(),
          deltaSyncIndexSpec: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "indexType": ["DELTA_SYNC"] } }, defaults: { "indexType": "DELTA_SYNC" } }),
          directAccessIndexSpec: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "indexType": ["DIRECT_ACCESS"] } }, defaults: { "indexType": "DELTA_SYNC" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_vector_search/operation_get_index.schema.js
var require_operation_get_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_vector_search/operation_get_index.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("vectorSearch"),
          operation: z.literal("getIndex"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          indexName: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_vector_search/operation_list_indexes.schema.js
var require_operation_list_indexes_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_vector_search/operation_list_indexes.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("vectorSearch"),
          operation: z.literal("listIndexes"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          endpointName: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_vector_search/operation_query_index.schema.js
var require_operation_query_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_vector_search/operation_query_index.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("vectorSearch"),
          operation: z.literal("queryIndex"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          indexName: stringOrExpression.optional(),
          queryType: z.union([z.literal("text"), z.literal("vector"), expressionSchema]).optional(),
          queryText: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "queryType": ["text"] } }, defaults: { "queryType": "text" } }),
          queryVector: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "queryType": ["vector"] } }, defaults: { "queryType": "text" } }),
          searchMode: z.union([z.literal("HYBRID"), z.literal("ANN"), expressionSchema]).optional(),
          columns: stringOrExpression.optional(),
          numResults: numberOrExpression.optional(),
          enableReranking: booleanOrExpression.optional(),
          rerankerModel: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "enableReranking": [true] } }, defaults: { "enableReranking": false } }),
          columnsToRerank: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "enableReranking": [true] } }, defaults: { "enableReranking": false } }),
          options: z.object({ filterExpression: stringOrExpression.optional(), scoreThreshold: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_vector_search/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/resource_vector_search/index.schema.js"(exports2, module2) {
    var getCreateIndexSchema = require_operation_create_index_schema();
    var getGetIndexSchema = require_operation_get_index_schema();
    var getListIndexesSchema = require_operation_list_indexes_schema();
    var getQueryIndexSchema = require_operation_query_index_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "listDirectory" } : parameters;
      return z.union([
        getCreateIndexSchema({ ...helpers, parameters: effectiveParams }),
        getGetIndexSchema({ ...helpers, parameters: effectiveParams }),
        getListIndexesSchema({ ...helpers, parameters: effectiveParams }),
        getQueryIndexSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/databricks/v1/index.schema.js
var getDatabricksSqlSchema = require_index_schema();
var getFilesSchema = require_index_schema2();
var getGenieSchema = require_index_schema3();
var getModelServingSchema = require_index_schema4();
var getUnityCatalogSchema = require_index_schema5();
var getVectorSearchSchema = require_index_schema6();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "databricksSql" } : parameters;
  return z.union([
    getDatabricksSqlSchema({ ...helpers, parameters: effectiveParams }),
    getFilesSchema({ ...helpers, parameters: effectiveParams }),
    getGenieSchema({ ...helpers, parameters: effectiveParams }),
    getModelServingSchema({ ...helpers, parameters: effectiveParams }),
    getUnityCatalogSchema({ ...helpers, parameters: effectiveParams }),
    getVectorSearchSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
