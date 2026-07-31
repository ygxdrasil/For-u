var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_contact/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_contact/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("create").default("create"),
          organizationId: stringOrExpression.optional(),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ accountNumber: stringOrExpression.optional(), addressesUi: z.unknown().optional(), bankAccountDetails: stringOrExpression.optional(), contactNumber: stringOrExpression.optional(), contactStatus: z.union([z.literal("ACTIVE"), z.literal("ARCHIVED"), z.literal("GDPRREQUEST"), expressionSchema]).optional(), defaultCurrency: stringOrExpression.optional(), emailAddress: stringOrExpression.optional(), firstName: stringOrExpression.optional(), lastName: stringOrExpression.optional(), phonesUi: z.unknown().optional(), purchasesDefaultAccountCode: stringOrExpression.optional(), salesDefaultAccountCode: stringOrExpression.optional(), skypeUserName: stringOrExpression.optional(), taxNumber: stringOrExpression.optional(), xeroNetworkKey: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_contact/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_contact/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("get"),
          organizationId: stringOrExpression.optional(),
          contactId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_contact/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_contact/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("getAll"),
          organizationId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ includeArchived: booleanOrExpression.optional(), orderBy: stringOrExpression.optional(), sortOrder: z.union([z.literal("ASC"), z.literal("DESC"), expressionSchema]).optional(), where: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_contact/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_contact/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("update"),
          organizationId: stringOrExpression.optional(),
          contactId: stringOrExpression.optional(),
          updateFields: z.object({ accountNumber: stringOrExpression.optional(), addressesUi: z.unknown().optional(), bankAccountDetails: stringOrExpression.optional(), contactNumber: stringOrExpression.optional(), contactStatus: z.union([z.literal("ACTIVE"), z.literal("ARCHIVED"), z.literal("GDPRREQUEST"), expressionSchema]).optional(), defaultCurrency: stringOrExpression.optional(), emailAddress: stringOrExpression.optional(), firstName: stringOrExpression.optional(), lastName: stringOrExpression.optional(), name: stringOrExpression.optional(), phonesUi: z.unknown().optional(), purchasesDefaultAccountCode: stringOrExpression.optional(), salesDefaultAccountCode: stringOrExpression.optional(), skypeUserName: stringOrExpression.optional(), taxNumber: stringOrExpression.optional(), xeroNetworkKey: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_contact/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_contact/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_invoice/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_invoice/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("invoice").default("invoice"),
          operation: z.literal("create").default("create"),
          organizationId: stringOrExpression.optional(),
          type: z.union([z.literal("ACCPAY"), z.literal("ACCREC"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          lineItemsUi: z.object({ lineItemsValues: z.array(z.object({ description: stringOrExpression.optional(), quantity: numberOrExpression.optional(), unitAmount: stringOrExpression.optional(), itemCode: stringOrExpression.optional(), accountCode: stringOrExpression.optional(), taxType: z.union([z.literal("INPUT"), z.literal("NONE"), z.literal("OUTPUT"), z.literal("GSTONIMPORTS"), expressionSchema]).optional(), taxAmount: stringOrExpression.optional(), lineAmount: stringOrExpression.optional(), discountRate: stringOrExpression.optional() })).optional() }).optional(),
          additionalFields: z.object({ brandingThemeId: stringOrExpression.optional(), currency: stringOrExpression.optional(), currencyRate: stringOrExpression.optional(), date: stringOrExpression.optional(), dueDate: stringOrExpression.optional(), expectedPaymentDate: stringOrExpression.optional(), invoiceNumber: stringOrExpression.optional(), lineAmountType: z.union([z.literal("Exclusive"), z.literal("Inclusive"), z.literal("NoTax"), expressionSchema]).optional(), plannedPaymentDate: stringOrExpression.optional(), reference: stringOrExpression.optional(), sendToContact: booleanOrExpression.optional(), status: z.union([z.literal("DRAFT"), z.literal("SUBMITTED"), z.literal("AUTHORISED"), expressionSchema]).optional(), url: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_invoice/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_invoice/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("invoice").default("invoice"),
          operation: z.literal("get"),
          organizationId: stringOrExpression.optional(),
          invoiceId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_invoice/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_invoice/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("invoice").default("invoice"),
          operation: z.literal("getAll"),
          organizationId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ createdByMyApp: booleanOrExpression.optional(), orderBy: stringOrExpression.optional(), sortOrder: z.union([z.literal("ASC"), z.literal("DESC"), expressionSchema]).optional(), statuses: z.array(z.union([z.literal("DRAFT"), z.literal("SUBMITTED"), z.literal("AUTHORISED")])).optional(), where: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_invoice/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_invoice/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("invoice").default("invoice"),
          operation: z.literal("update"),
          organizationId: stringOrExpression.optional(),
          invoiceId: stringOrExpression.optional(),
          updateFields: z.object({ brandingThemeId: stringOrExpression.optional(), contactId: stringOrExpression.optional(), currency: stringOrExpression.optional(), currencyRate: stringOrExpression.optional(), date: stringOrExpression.optional(), dueDate: stringOrExpression.optional(), expectedPaymentDate: stringOrExpression.optional(), invoiceNumber: stringOrExpression.optional(), lineAmountType: z.union([z.literal("Exclusive"), z.literal("Inclusive"), z.literal("NoTax"), expressionSchema]).optional(), lineItemsUi: z.unknown().optional(), plannedPaymentDate: stringOrExpression.optional(), reference: stringOrExpression.optional(), sendToContact: booleanOrExpression.optional(), status: z.union([z.literal("DRAFT"), z.literal("SUBMITTED"), z.literal("AUTHORISED"), expressionSchema]).optional(), url: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_invoice/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/resource_invoice/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xero/v1/index.schema.js
var getContactSchema = require_index_schema();
var getInvoiceSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "invoice" } : parameters;
  return z.union([
    getContactSchema({ ...helpers, parameters: effectiveParams }),
    getInvoiceSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
