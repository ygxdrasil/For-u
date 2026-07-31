var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate"),
          operation: z.literal("delete").default("delete"),
          certificateId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/operation_download.schema.js
var require_operation_download_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/operation_download.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate"),
          operation: z.literal("download"),
          certificateId: stringOrExpression.optional(),
          downloadItem: z.union([z.literal("certificate"), z.literal("keystore"), expressionSchema]).optional(),
          keystoreType: resolveSchema({ parameters, schema: z.union([z.literal("JKS"), z.literal("PKCS12"), z.literal("PEM"), expressionSchema]), required: false, displayOptions: { "show": { "downloadItem": ["keystore"] } }, defaults: { "downloadItem": "certificate" } }),
          certificateLabel: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "downloadItem": ["keystore"] } }, defaults: { "downloadItem": "certificate" } }),
          privateKeyPassphrase: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "downloadItem": ["keystore"] } }, defaults: { "downloadItem": "certificate" } }),
          keystorePassphrase: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "downloadItem": ["keystore"], "keystoreType": ["JKS"] } }, defaults: { "downloadItem": "certificate", "keystoreType": "PEM" } }),
          binaryProperty: stringOrExpression.optional(),
          options: z.object({ chainOrder: z.union([z.literal("EE_FIRST"), z.literal("EE_ONLY"), z.literal("ROOT_FIRST"), expressionSchema]).optional(), format: z.union([z.literal("PEM"), z.literal("DER"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate"),
          operation: z.literal("get"),
          certificateId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/operation_get_many.schema.js
var require_operation_get_many_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/operation_get_many.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate"),
          operation: z.literal("getMany"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ subject: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/operation_renew.schema.js
var require_operation_renew_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/operation_renew.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate"),
          operation: z.literal("renew"),
          applicationId: stringOrExpression.optional(),
          existingCertificateId: stringOrExpression.optional(),
          certificateIssuingTemplateId: stringOrExpression.optional(),
          certificateSigningRequest: stringOrExpression.optional(),
          options: z.object({ validityPeriod: z.union([z.literal("P1Y"), z.literal("P10D"), z.literal("PT12H"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate/index.schema.js"(exports2, module2) {
    var getDeleteSchema = require_operation_delete_schema();
    var getDownloadSchema = require_operation_download_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetManySchema = require_operation_get_many_schema();
    var getRenewSchema = require_operation_renew_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "delete" } : parameters;
      return z.union([
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getDownloadSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetManySchema({ ...helpers, parameters: effectiveParams }),
        getRenewSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate_request/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate_request/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificateRequest").default("certificateRequest"),
          operation: z.literal("create"),
          applicationId: stringOrExpression.optional(),
          certificateIssuingTemplateId: stringOrExpression.optional(),
          generateCsr: booleanOrExpression.optional(),
          commonName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "generateCsr": [true] } }, defaults: { "generateCsr": false } }),
          additionalFields: resolveSchema({ parameters, schema: z.object({ keyType: z.union([z.literal("EC"), z.literal("RSA"), expressionSchema]).optional(), keyCurve: z.union([z.literal("ED25519"), z.literal("P256"), z.literal("P384"), z.literal("P521"), z.literal("UNKNOWN"), expressionSchema]).optional(), keyLength: numberOrExpression.optional(), organization: stringOrExpression.optional(), organizationalUnits: stringOrExpression.optional(), locality: stringOrExpression.optional(), state: stringOrExpression.optional(), country: stringOrExpression.optional(), SubjectAltNamesUi: z.unknown().optional() }), required: false, displayOptions: { "show": { "generateCsr": [true] } }, defaults: { "generateCsr": false } }),
          certificateSigningRequest: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "generateCsr": [false] } }, defaults: { "generateCsr": false } }),
          options: z.object({ validityPeriod: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate_request/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate_request/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificateRequest").default("certificateRequest"),
          operation: z.literal("get"),
          certificateRequestId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate_request/operation_get_many.schema.js
var require_operation_get_many_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate_request/operation_get_many.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificateRequest").default("certificateRequest"),
          operation: z.literal("getMany"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate_request/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/resource_certificate_request/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getGetSchema = require_operation_get_schema2();
    var getGetManySchema = require_operation_get_many_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "delete" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetManySchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectCloud/v1/index.schema.js
var getCertificateSchema = require_index_schema();
var getCertificateRequestSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "certificateRequest" } : parameters;
  return z.union([
    getCertificateSchema({ ...helpers, parameters: effectiveParams }),
    getCertificateRequestSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
