var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("bucket").default("bucket"),
          operation: z.literal("create"),
          projectId: stringOrExpression.optional(),
          bucketName: stringOrExpression.optional(),
          projection: z.union([z.literal("full"), z.literal("noAcl")]).optional(),
          createAcl: z.object({ predefinedAcl: z.union([z.literal("authenticatedRead"), z.literal("private"), z.literal("projectPrivate"), z.literal("publicRead"), z.literal("publicReadWrite")]).optional(), predefinedDefaultObjectAcl: z.union([z.literal("authenticatedRead"), z.literal("bucketOwnerFullControl"), z.literal("bucketOwnerRead"), z.literal("private"), z.literal("projectPrivate"), z.literal("publicRead")]).optional() }).optional(),
          createBody: z.object({ acl: z.union([iDataObjectSchema, z.string()]).optional(), billing: z.union([iDataObjectSchema, z.string()]).optional(), cors: z.union([iDataObjectSchema, z.string()]).optional(), customPlacementConfig: z.union([iDataObjectSchema, z.string()]).optional(), dataLocations: z.union([iDataObjectSchema, z.string()]).optional(), defaultEventBasedHold: booleanOrExpression.optional(), defaultObjectAcl: z.union([iDataObjectSchema, z.string()]).optional(), encryption: z.union([iDataObjectSchema, z.string()]).optional(), iamConfiguration: z.union([iDataObjectSchema, z.string()]).optional(), labels: z.union([iDataObjectSchema, z.string()]).optional(), lifecycle: z.union([iDataObjectSchema, z.string()]).optional(), location: stringOrExpression.optional(), logging: z.union([iDataObjectSchema, z.string()]).optional(), retentionPolicy: z.union([iDataObjectSchema, z.string()]).optional(), rpo: stringOrExpression.optional(), storageClass: stringOrExpression.optional(), versioning: z.union([iDataObjectSchema, z.string()]).optional(), website: z.union([iDataObjectSchema, z.string()]).optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("bucket").default("bucket"),
          operation: z.literal("delete"),
          bucketName: stringOrExpression.optional(),
          getFilters: z.object({ ifMetagenerationMatch: numberOrExpression.optional(), ifMetagenerationNotMatch: numberOrExpression.optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("bucket").default("bucket"),
          operation: z.literal("get"),
          bucketName: stringOrExpression.optional(),
          projection: z.union([z.literal("full"), z.literal("noAcl")]).optional(),
          getFilters: z.object({ ifMetagenerationMatch: numberOrExpression.optional(), ifMetagenerationNotMatch: numberOrExpression.optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("bucket").default("bucket"),
          operation: z.literal("getAll").default("getAll"),
          projectId: stringOrExpression.optional(),
          prefix: stringOrExpression.optional(),
          projection: z.union([z.literal("full"), z.literal("noAcl")]).optional(),
          returnAll: booleanOrExpression.optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("bucket").default("bucket"),
          operation: z.literal("update"),
          bucketName: stringOrExpression.optional(),
          projection: z.union([z.literal("full"), z.literal("noAcl")]).optional(),
          getFilters: z.object({ ifMetagenerationMatch: numberOrExpression.optional(), ifMetagenerationNotMatch: numberOrExpression.optional() }).optional(),
          createAcl: z.object({ predefinedAcl: z.union([z.literal("authenticatedRead"), z.literal("private"), z.literal("projectPrivate"), z.literal("publicRead"), z.literal("publicReadWrite")]).optional(), predefinedDefaultObjectAcl: z.union([z.literal("authenticatedRead"), z.literal("bucketOwnerFullControl"), z.literal("bucketOwnerRead"), z.literal("private"), z.literal("projectPrivate"), z.literal("publicRead")]).optional() }).optional(),
          createBody: z.object({ acl: z.union([iDataObjectSchema, z.string()]).optional(), billing: z.union([iDataObjectSchema, z.string()]).optional(), cors: z.union([iDataObjectSchema, z.string()]).optional(), customPlacementConfig: z.union([iDataObjectSchema, z.string()]).optional(), dataLocations: z.union([iDataObjectSchema, z.string()]).optional(), defaultEventBasedHold: booleanOrExpression.optional(), defaultObjectAcl: z.union([iDataObjectSchema, z.string()]).optional(), encryption: z.union([iDataObjectSchema, z.string()]).optional(), iamConfiguration: z.union([iDataObjectSchema, z.string()]).optional(), labels: z.union([iDataObjectSchema, z.string()]).optional(), lifecycle: z.union([iDataObjectSchema, z.string()]).optional(), location: stringOrExpression.optional(), logging: z.union([iDataObjectSchema, z.string()]).optional(), retentionPolicy: z.union([iDataObjectSchema, z.string()]).optional(), rpo: stringOrExpression.optional(), storageClass: stringOrExpression.optional(), versioning: z.union([iDataObjectSchema, z.string()]).optional(), website: z.union([iDataObjectSchema, z.string()]).optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_bucket/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getAll" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("object"),
          operation: z.literal("create"),
          bucketName: stringOrExpression.optional(),
          objectName: stringOrExpression.optional(),
          updateProjection: z.union([z.literal("full"), z.literal("noAcl")]).optional(),
          createFromBinary: z.boolean().optional(),
          createBinaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "createFromBinary": [true] } }, defaults: { "createFromBinary": true } }),
          createContent: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "createFromBinary": [false] } }, defaults: { "createFromBinary": true } }),
          createData: z.object({ acl: z.union([iDataObjectSchema, z.string()]).optional(), cacheControl: stringOrExpression.optional(), contentDisposition: stringOrExpression.optional(), contentEncoding: stringOrExpression.optional(), contentLanguage: stringOrExpression.optional(), contentType: stringOrExpression.optional(), crc32c: stringOrExpression.optional(), customTime: stringOrExpression.optional(), eventBasedHold: booleanOrExpression.optional(), md5Hash: stringOrExpression.optional(), metadata: z.union([iDataObjectSchema, z.string()]).optional(), storageClass: stringOrExpression.optional(), temporaryHold: booleanOrExpression.optional() }).optional(),
          createQuery: z.object({ contentEncoding: stringOrExpression.optional(), generation: numberOrExpression.optional(), ifGenerationMatch: numberOrExpression.optional(), ifGenerationNotMatch: numberOrExpression.optional(), ifMetagenerationMatch: numberOrExpression.optional(), ifMetagenerationNotMatch: numberOrExpression.optional(), kmsKeyName: stringOrExpression.optional(), predefinedAcl: z.union([z.literal("authenticatedRead"), z.literal("bucketOwnerFullControl"), z.literal("bucketOwnerRead"), z.literal("private"), z.literal("projectPrivate"), z.literal("publicRead"), expressionSchema]).optional() }).optional(),
          encryptionHeaders: z.object({ "X-Goog-Encryption-Algorithm": z.union([z.literal("AES256"), expressionSchema]).optional(), "X-Goog-Encryption-Key": stringOrExpression.optional(), "X-Goog-Encryption-Key-Sha256": stringOrExpression.optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("object"),
          operation: z.literal("delete"),
          bucketName: stringOrExpression.optional(),
          objectName: stringOrExpression.optional(),
          getParameters: z.object({ generation: numberOrExpression.optional(), ifGenerationMatch: numberOrExpression.optional(), ifGenerationNotMatch: numberOrExpression.optional(), ifMetagenerationMatch: numberOrExpression.optional(), ifMetagenerationNotMatch: numberOrExpression.optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("object"),
          operation: z.literal("get"),
          bucketName: stringOrExpression.optional(),
          objectName: stringOrExpression.optional(),
          projection: z.union([z.literal("full"), z.literal("noAcl")]).optional(),
          alt: z.union([z.literal("json"), z.literal("media"), expressionSchema]).optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "alt": ["media"] } }, defaults: { "alt": "json" } }),
          getParameters: z.object({ generation: numberOrExpression.optional(), ifGenerationMatch: numberOrExpression.optional(), ifGenerationNotMatch: numberOrExpression.optional(), ifMetagenerationMatch: numberOrExpression.optional(), ifMetagenerationNotMatch: numberOrExpression.optional() }).optional(),
          encryptionHeaders: z.object({ "X-Goog-Encryption-Algorithm": z.union([z.literal("AES256"), expressionSchema]).optional(), "X-Goog-Encryption-Key": stringOrExpression.optional(), "X-Goog-Encryption-Key-Sha256": stringOrExpression.optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("object"),
          operation: z.literal("getAll").default("getAll"),
          bucketName: stringOrExpression.optional(),
          projection: z.union([z.literal("full"), z.literal("noAcl")]).optional(),
          returnAll: booleanOrExpression.optional(),
          maxResults: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          listFilters: z.object({ delimiter: stringOrExpression.optional(), endOffset: stringOrExpression.optional(), includeTrailingDelimiter: booleanOrExpression.optional(), prefix: stringOrExpression.optional(), startOffset: stringOrExpression.optional(), versions: booleanOrExpression.optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("object"),
          operation: z.literal("update"),
          bucketName: stringOrExpression.optional(),
          objectName: stringOrExpression.optional(),
          updateProjection: z.union([z.literal("full"), z.literal("noAcl")]).optional(),
          updateData: z.object({ acl: z.union([iDataObjectSchema, z.string()]).optional(), cacheControl: stringOrExpression.optional(), contentDisposition: stringOrExpression.optional(), contentEncoding: stringOrExpression.optional(), contentLanguage: stringOrExpression.optional(), contentType: stringOrExpression.optional(), customTime: stringOrExpression.optional(), eventBasedHold: booleanOrExpression.optional(), metadata: z.union([iDataObjectSchema, z.string()]).optional(), temporaryHold: booleanOrExpression.optional() }).optional(),
          metagenAndAclQuery: z.object({ generation: numberOrExpression.optional(), ifGenerationMatch: numberOrExpression.optional(), ifGenerationNotMatch: numberOrExpression.optional(), ifMetagenerationMatch: numberOrExpression.optional(), ifMetagenerationNotMatch: numberOrExpression.optional(), predefinedAcl: z.union([z.literal("authenticatedRead"), z.literal("bucketOwnerFullControl"), z.literal("bucketOwnerRead"), z.literal("private"), z.literal("projectPrivate"), z.literal("publicRead"), expressionSchema]).optional() }).optional(),
          encryptionHeaders: z.object({ "X-Goog-Encryption-Algorithm": z.union([z.literal("AES256"), expressionSchema]).optional(), "X-Goog-Encryption-Key": stringOrExpression.optional(), "X-Goog-Encryption-Key-Sha256": stringOrExpression.optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/resource_object/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getAll" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCloudStorage/v1/index.schema.js
var getBucketSchema = require_index_schema();
var getObjectSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "bucket" } : parameters;
  return z.union([
    getBucketSchema({ ...helpers, parameters: effectiveParams }),
    getObjectSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
