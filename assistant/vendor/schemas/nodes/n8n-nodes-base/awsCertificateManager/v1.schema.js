var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate").default("certificate"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
          certificateArn: stringOrExpression.optional(),
          bucketName: stringOrExpression.optional(),
          certificateKey: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate").default("certificate"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
          certificateArn: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/operation_get_many.schema.js
var require_operation_get_many_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/operation_get_many.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate").default("certificate"),
          operation: z.literal("getMany"),
          authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ certificateStatuses: z.array(z.union([z.literal("EXPIRED"), z.literal("FAILED"), z.literal("INACTIVE"), z.literal("ISSUED"), z.literal("PENDING_VALIDATION"), z.literal("REVOKED"), z.literal("VALIDATION_TIMED_OUT")])).optional(), extendedKeyUsage: z.array(z.union([z.literal("ANY"), z.literal("CODE_SIGNING"), z.literal("CUSTOM"), z.literal("EMAIL_PROTECTION"), z.literal("IPSEC_END_SYSTEM"), z.literal("IPSEC_TUNNEL"), z.literal("IPSEC_USER"), z.literal("NONE"), z.literal("OCSP_SIGNING"), z.literal("TIME_STAMPING"), z.literal("TLS_WEB_CLIENT_AUTHENTICATION"), z.literal("TLS_WEB_SERVER_AUTHENTICATION")])).optional(), keyTypes: z.array(z.union([z.literal("EC_prime256v1"), z.literal("EC_secp384r1"), z.literal("EC_secp521r1"), z.literal("RSA_1024"), z.literal("RSA_2048"), z.literal("RSA_4096")])).optional(), keyUsage: z.array(z.union([z.literal("ANY"), z.literal("CERTIFICATE_SIGNING"), z.literal("CRL_SIGNING"), z.literal("CUSTOM"), z.literal("DATA_ENCIPHERMENT"), z.literal("DECIPHER_ONLY"), z.literal("DIGITAL_SIGNATURE"), z.literal("ENCIPHER_ONLY"), z.literal("KEY_AGREEMENT"), z.literal("KEY_ENCIPHERMENT"), z.literal("NON_REPUDIATION")])).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/operation_get_metadata.schema.js
var require_operation_get_metadata_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/operation_get_metadata.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate").default("certificate"),
          operation: z.literal("getMetadata"),
          authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
          certificateArn: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/operation_renew.schema.js
var require_operation_renew_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/operation_renew.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate").default("certificate"),
          operation: z.literal("renew").default("renew"),
          authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
          certificateArn: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/resource_certificate/index.schema.js"(exports2, module2) {
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetManySchema = require_operation_get_many_schema();
    var getGetMetadataSchema = require_operation_get_metadata_schema();
    var getRenewSchema = require_operation_renew_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "renew" } : parameters;
      return z.union([
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetManySchema({ ...helpers, parameters: effectiveParams }),
        getGetMetadataSchema({ ...helpers, parameters: effectiveParams }),
        getRenewSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsCertificateManager/v1/index.schema.js
var getCertificateSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "certificate" } : parameters;
  return getCertificateSchema({ ...helpers, parameters: effectiveParams });
};
