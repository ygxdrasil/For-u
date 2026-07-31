var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate").default("certificate"),
          operation: z.literal("create").default("create"),
          PolicyDN: stringOrExpression.optional(),
          Subject: stringOrExpression.optional(),
          additionalFields: z.object({ Approvers: stringOrExpression.optional(), CADN: stringOrExpression.optional(), CertificateType: z.union([z.literal("Code Signing"), z.literal("Device"), z.literal("Server"), z.literal("User"), expressionSchema]).optional(), City: stringOrExpression.optional(), Contacts: stringOrExpression.optional(), Country: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), CreatedBy: stringOrExpression.optional(), Devices: z.unknown().optional(), DisableAutomaticRenewal: booleanOrExpression.optional(), EllipticCurve: z.union([z.literal("P256"), z.literal("P384"), z.literal("P521"), expressionSchema]).optional(), KeyAlgorithm: z.union([z.literal("RSA"), z.literal("ECC"), expressionSchema]).optional(), KeyBitSize: numberOrExpression.optional(), ManagementType: z.union([z.literal("Enrollment"), z.literal("Monitoring"), z.literal("Provisioning"), z.literal("Unassigned"), expressionSchema]).optional(), origin: stringOrExpression.optional(), Organization: stringOrExpression.optional(), OrganizationalUnit: stringOrExpression.optional(), PKCS10: stringOrExpression.optional(), Reenable: booleanOrExpression.optional(), SetWorkToDo: booleanOrExpression.optional(), State: stringOrExpression.optional(), SubjectAltNamesUi: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate").default("certificate"),
          operation: z.literal("delete"),
          certificateId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_download.schema.js
var require_operation_download_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_download.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate").default("certificate"),
          operation: z.literal("download"),
          certificateDn: stringOrExpression.optional(),
          includePrivateKey: booleanOrExpression.optional(),
          password: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "includePrivateKey": [true] } }, defaults: { "includePrivateKey": false } }),
          binaryProperty: stringOrExpression.optional(),
          additionalFields: z.object({ IncludeChain: booleanOrExpression.optional(), RootFirstOrder: stringOrExpression.optional(), KeystorePassword: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate").default("certificate"),
          operation: z.literal("get"),
          certificateId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_get_many.schema.js
var require_operation_get_many_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_get_many.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate").default("certificate"),
          operation: z.literal("getMany"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ fields: z.array(z.union([z.literal("Issuer"), z.literal("KeyAlgorithm"), z.literal("KeySize"), z.literal("Subject")])).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_renew.schema.js
var require_operation_renew_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/operation_renew.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("certificate").default("certificate"),
          operation: z.literal("renew"),
          certificateDN: stringOrExpression.optional(),
          additionalFields: z.object({ PKCS10: stringOrExpression.optional(), Reenable: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_certificate/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getDownloadSchema = require_operation_download_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetManySchema = require_operation_get_many_schema();
    var getRenewSchema = require_operation_renew_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getDownloadSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetManySchema({ ...helpers, parameters: effectiveParams }),
        getRenewSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_policy/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_policy/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("policy"),
          operation: z.literal("get"),
          policyDn: stringOrExpression.optional(),
          additionalFields: z.object({ PKCS10: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_policy/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/resource_policy/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getGetSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/venafiTlsProtectDatacenter/v1/index.schema.js
var getCertificateSchema = require_index_schema();
var getPolicySchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "certificate" } : parameters;
  return z.union([
    getCertificateSchema({ ...helpers, parameters: effectiveParams }),
    getPolicySchema({ ...helpers, parameters: effectiveParams })
  ]);
};
