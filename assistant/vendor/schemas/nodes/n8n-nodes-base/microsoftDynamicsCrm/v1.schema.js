var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("create").default("create"),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ accountcategorycode: stringOrExpression.optional(), accountratingcode: stringOrExpression.optional(), addresses: z.unknown().optional(), businesstypecode: stringOrExpression.optional(), customersizecode: stringOrExpression.optional(), customertypecode: stringOrExpression.optional(), description: stringOrExpression.optional(), emailaddress1: stringOrExpression.optional(), emailaddress2: stringOrExpression.optional(), emailaddress3: stringOrExpression.optional(), fax: stringOrExpression.optional(), ftpsiteurl: stringOrExpression.optional(), industrycode: stringOrExpression.optional(), name: stringOrExpression.optional(), creditlimit: numberOrExpression.optional(), numberofemployees: numberOrExpression.optional(), paymenttermscode: stringOrExpression.optional(), preferredappointmentdaycode: stringOrExpression.optional(), preferredappointmenttimecode: stringOrExpression.optional(), preferredcontactmethodcode: stringOrExpression.optional(), primarysatoriid: stringOrExpression.optional(), primarytwitterid: stringOrExpression.optional(), revenue: numberOrExpression.optional(), sharesoutstanding: numberOrExpression.optional(), shippingmethodcode: stringOrExpression.optional(), sic: stringOrExpression.optional(), stageid: stringOrExpression.optional(), stockexchange: stringOrExpression.optional(), telephone1: stringOrExpression.optional(), telephone2: stringOrExpression.optional(), telephone3: stringOrExpression.optional(), territorycode: stringOrExpression.optional(), tickersymbol: stringOrExpression.optional(), websiteurl: stringOrExpression.optional(), yominame: stringOrExpression.optional() }).optional(),
          options: z.object({ returnFields: z.array(z.string()).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("delete"),
          accountId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("get"),
          accountId: stringOrExpression.optional(),
          options: z.object({ returnFields: z.array(z.string()).optional(), expandFields: z.array(z.string()).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ returnFields: z.array(z.string()).optional(), expandFields: z.array(z.string()).optional() }).optional(),
          filters: z.object({ query: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("update"),
          accountId: stringOrExpression.optional(),
          updateFields: z.object({ accountcategorycode: stringOrExpression.optional(), accountratingcode: stringOrExpression.optional(), addresses: z.unknown().optional(), businesstypecode: stringOrExpression.optional(), customersizecode: stringOrExpression.optional(), customertypecode: stringOrExpression.optional(), description: stringOrExpression.optional(), emailaddress1: stringOrExpression.optional(), emailaddress2: stringOrExpression.optional(), emailaddress3: stringOrExpression.optional(), fax: stringOrExpression.optional(), ftpsiteurl: stringOrExpression.optional(), industrycode: stringOrExpression.optional(), name: stringOrExpression.optional(), creditlimit: numberOrExpression.optional(), numberofemployees: numberOrExpression.optional(), paymenttermscode: stringOrExpression.optional(), preferredappointmentdaycode: stringOrExpression.optional(), preferredappointmenttimecode: stringOrExpression.optional(), preferredcontactmethodcode: stringOrExpression.optional(), primarysatoriid: stringOrExpression.optional(), primarytwitterid: stringOrExpression.optional(), revenue: numberOrExpression.optional(), sharesoutstanding: numberOrExpression.optional(), shippingmethodcode: stringOrExpression.optional(), sic: stringOrExpression.optional(), stageid: stringOrExpression.optional(), stockexchange: stringOrExpression.optional(), telephone1: stringOrExpression.optional(), telephone2: stringOrExpression.optional(), telephone3: stringOrExpression.optional(), territorycode: stringOrExpression.optional(), tickersymbol: stringOrExpression.optional(), websiteurl: stringOrExpression.optional(), yominame: stringOrExpression.optional() }).optional(),
          options: z.object({ returnFields: z.array(z.string()).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/resource_account/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftDynamicsCrm/v1/index.schema.js
var getAccountSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "account" } : parameters;
  return getAccountSchema({ ...helpers, parameters: effectiveParams });
};
