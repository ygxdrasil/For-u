var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_certificate/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_certificate/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate"),
          operation: z.literal("create").default("create"),
          certificateFileName: stringOrExpression.optional(),
          certificateFormat: z.union([z.literal("PEM"), z.literal("DER"), expressionSchema]).optional(),
          certificateType: z.union([z.literal("ROOT_CERT"), z.literal("INTM_CERT"), z.literal("SRVR_CERT"), z.literal("CLNT_CERT"), expressionSchema]).optional(),
          certificateRequestFileName: stringOrExpression.optional(),
          caCertificateFileName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "certificateType": ["INTM_CERT", "SRVR_CERT", "CLNT_CERT"] } }, defaults: { "certificateType": "ROOT_CERT" } }),
          caCertificateFileFormat: resolveSchema({ parameters, schema: z.union([z.literal("PEM"), z.literal("DER"), expressionSchema]), required: false, displayOptions: { "show": { "certificateType": ["INTM_CERT", "SRVR_CERT", "CLNT_CERT"] } }, defaults: { "certificateType": "ROOT_CERT" } }),
          caPrivateKeyFileName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "certificateType": ["INTM_CERT", "SRVR_CERT", "CLNT_CERT"] } }, defaults: { "certificateType": "ROOT_CERT" } }),
          caPrivateKeyFileFormat: resolveSchema({ parameters, schema: z.union([z.literal("PEM"), z.literal("DER"), expressionSchema]), required: false, displayOptions: { "show": { "certificateType": ["INTM_CERT", "SRVR_CERT", "CLNT_CERT"] } }, defaults: { "certificateType": "ROOT_CERT" } }),
          privateKeyFileName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "certificateType": ["ROOT_CERT"] } }, defaults: { "certificateType": "ROOT_CERT" } }),
          caSerialFileNumber: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "certificateType": ["INTM_CERT", "SRVR_CERT", "CLNT_CERT"] } }, defaults: { "certificateType": "ROOT_CERT" } }),
          privateKeyFormat: resolveSchema({ parameters, schema: z.union([z.literal("PEM"), z.literal("DER"), expressionSchema]), required: false, displayOptions: { "show": { "certificateType": ["ROOT_CERT"] } }, defaults: { "certificateType": "ROOT_CERT" } }),
          additionalFields: z.object({ pempassphrase: stringOrExpression.optional(), pempassphrase: stringOrExpression.optional(), subjectaltname: stringOrExpression.optional(), days: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_certificate/operation_install.schema.js
var require_operation_install_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_certificate/operation_install.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate"),
          operation: z.literal("install"),
          certificateKeyPairName: stringOrExpression.optional(),
          certificateFileName: stringOrExpression.optional(),
          privateKeyFileName: stringOrExpression.optional(),
          certificateFormat: z.union([z.literal("PEM"), z.literal("DER"), expressionSchema]).optional(),
          password: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "certificateFormat": ["PEM"] } }, defaults: { "certificateFormat": "PEM" } }),
          notifyExpiration: booleanOrExpression.optional(),
          notificationPeriod: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "notifyExpiration": [true] } }, defaults: { "notifyExpiration": false } }),
          certificateBundle: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "certificateFormat": ["PEM"] } }, defaults: { "certificateFormat": "PEM" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_certificate/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_certificate/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getInstallSchema = require_operation_install_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getInstallSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_file/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_file/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file").default("file"),
          operation: z.literal("delete"),
          fileLocation: stringOrExpression.optional(),
          fileName: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_file/operation_download.schema.js
var require_operation_download_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_file/operation_download.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file").default("file"),
          operation: z.literal("download"),
          fileLocation: stringOrExpression.optional(),
          fileName: stringOrExpression.optional(),
          binaryProperty: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_file/operation_upload.schema.js
var require_operation_upload_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_file/operation_upload.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file").default("file"),
          operation: z.literal("upload"),
          fileLocation: stringOrExpression.optional(),
          binaryProperty: stringOrExpression.optional(),
          options: z.object({ fileName: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_file/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/resource_file/index.schema.js"(exports2, module2) {
    var getDeleteSchema = require_operation_delete_schema();
    var getDownloadSchema = require_operation_download_schema();
    var getUploadSchema = require_operation_upload_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getDownloadSchema({ ...helpers, parameters: effectiveParams }),
        getUploadSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/citrixAdc/v1/index.schema.js
var getCertificateSchema = require_index_schema();
var getFileSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "file" } : parameters;
  return z.union([
    getCertificateSchema({ ...helpers, parameters: effectiveParams }),
    getFileSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
