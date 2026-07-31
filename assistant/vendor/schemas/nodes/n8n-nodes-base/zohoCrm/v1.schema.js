var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("create").default("create"),
          accountName: stringOrExpression.optional(),
          additionalFields: z.object({ Account_Number: stringOrExpression.optional(), Account_Site: stringOrExpression.optional(), Account_Type: stringOrExpression.optional(), Annual_Revenue: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Contact_Details: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Employees: numberOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Fax: stringOrExpression.optional(), Industry: stringOrExpression.optional(), Phone: stringOrExpression.optional(), Shipping_Address: z.unknown().optional(), Ticker_Symbol: stringOrExpression.optional(), Website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_delete.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("get"),
          accountId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ approved: booleanOrExpression.optional(), converted: booleanOrExpression.optional(), fields: z.array(z.string()).optional(), include_child: booleanOrExpression.optional(), sort_by: stringOrExpression.optional(), sort_order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("update"),
          accountId: stringOrExpression.optional(),
          updateFields: z.object({ Account_Name: stringOrExpression.optional(), Account_Number: stringOrExpression.optional(), Account_Site: stringOrExpression.optional(), Account_Type: stringOrExpression.optional(), Annual_Revenue: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Contact_Details: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Employees: numberOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Fax: stringOrExpression.optional(), Industry: stringOrExpression.optional(), Phone: stringOrExpression.optional(), Shipping_Address: z.unknown().optional(), Ticker_Symbol: stringOrExpression.optional(), Website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_upsert.schema.js
var require_operation_upsert_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("upsert"),
          accountName: stringOrExpression.optional(),
          additionalFields: z.object({ Account_Number: stringOrExpression.optional(), Account_Site: stringOrExpression.optional(), Account_Type: stringOrExpression.optional(), Annual_Revenue: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Contact_Details: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Employees: numberOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Fax: stringOrExpression.optional(), Industry: stringOrExpression.optional(), Phone: stringOrExpression.optional(), Shipping_Address: z.unknown().optional(), Ticker_Symbol: stringOrExpression.optional(), Website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_account/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    var getUpsertSchema = require_operation_upsert_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("create").default("create"),
          lastName: stringOrExpression.optional(),
          additionalFields: z.object({ Assistant: stringOrExpression.optional(), customFields: z.unknown().optional(), Date_of_Birth: stringOrExpression.optional(), Department: stringOrExpression.optional(), Description: stringOrExpression.optional(), Email: stringOrExpression.optional(), Secondary_Email: stringOrExpression.optional(), Fax: stringOrExpression.optional(), First_Name: stringOrExpression.optional(), Full_Name: stringOrExpression.optional(), Mailing_Address: z.unknown().optional(), Mobile: stringOrExpression.optional(), Other_Address: z.unknown().optional(), Phone: stringOrExpression.optional(), Asst_Phone: stringOrExpression.optional(), Home_Phone: stringOrExpression.optional(), Other_Phone: stringOrExpression.optional(), Salutation: stringOrExpression.optional(), Skype_ID: stringOrExpression.optional(), Title: stringOrExpression.optional(), Twitter: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("delete"),
          contactId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("get"),
          contactId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ approved: booleanOrExpression.optional(), converted: booleanOrExpression.optional(), fields: z.array(z.string()).optional(), include_child: booleanOrExpression.optional(), sort_by: stringOrExpression.optional(), sort_order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("update"),
          contactId: stringOrExpression.optional(),
          updateFields: z.object({ Assistant: stringOrExpression.optional(), Asst_Phone: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Date_of_Birth: stringOrExpression.optional(), Department: stringOrExpression.optional(), Description: stringOrExpression.optional(), Email: stringOrExpression.optional(), Secondary_Email: stringOrExpression.optional(), Fax: stringOrExpression.optional(), First_Name: stringOrExpression.optional(), Full_Name: stringOrExpression.optional(), Home_Phone: stringOrExpression.optional(), Last_Name: stringOrExpression.optional(), Mailing_Address: z.unknown().optional(), Mobile: stringOrExpression.optional(), Other_Address: z.unknown().optional(), Other_Phone: stringOrExpression.optional(), Phone: stringOrExpression.optional(), Salutation: stringOrExpression.optional(), Skype_ID: stringOrExpression.optional(), Title: stringOrExpression.optional(), Twitter: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_upsert.schema.js
var require_operation_upsert_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("upsert"),
          lastName: stringOrExpression.optional(),
          additionalFields: z.object({ Assistant: stringOrExpression.optional(), customFields: z.unknown().optional(), Date_of_Birth: stringOrExpression.optional(), Department: stringOrExpression.optional(), Description: stringOrExpression.optional(), Email: stringOrExpression.optional(), Secondary_Email: stringOrExpression.optional(), Fax: stringOrExpression.optional(), First_Name: stringOrExpression.optional(), Full_Name: stringOrExpression.optional(), Mailing_Address: z.unknown().optional(), Mobile: stringOrExpression.optional(), Other_Address: z.unknown().optional(), Phone: stringOrExpression.optional(), Asst_Phone: stringOrExpression.optional(), Home_Phone: stringOrExpression.optional(), Other_Phone: stringOrExpression.optional(), Salutation: stringOrExpression.optional(), Skype_ID: stringOrExpression.optional(), Title: stringOrExpression.optional(), Twitter: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_contact/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getUpdateSchema = require_operation_update_schema2();
    var getUpsertSchema = require_operation_upsert_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_create.schema.js
var require_operation_create_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("create").default("create"),
          dealName: stringOrExpression.optional(),
          stage: stringOrExpression.optional(),
          additionalFields: z.object({ Amount: numberOrExpression.optional(), Closing_Date: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Lead_Conversion_Time: numberOrExpression.optional(), Next_Step: stringOrExpression.optional(), Overall_Sales_Duration: numberOrExpression.optional(), Probability: numberOrExpression.optional(), Sales_Cycle_Duration: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_delete.schema.js
var require_operation_delete_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("delete"),
          dealId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("get"),
          dealId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ approved: booleanOrExpression.optional(), converted: booleanOrExpression.optional(), fields: z.array(z.string()).optional(), include_child: booleanOrExpression.optional(), sort_by: stringOrExpression.optional(), sort_order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_update.schema.js
var require_operation_update_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("update"),
          dealId: stringOrExpression.optional(),
          updateFields: z.object({ Amount: numberOrExpression.optional(), Closing_Date: stringOrExpression.optional(), Currency: stringOrExpression.optional(), customFields: z.unknown().optional(), Deal_Name: stringOrExpression.optional(), Description: stringOrExpression.optional(), Lead_Conversion_Time: numberOrExpression.optional(), Next_Step: stringOrExpression.optional(), Overall_Sales_Duration: numberOrExpression.optional(), Probability: numberOrExpression.optional(), Sales_Cycle_Duration: numberOrExpression.optional(), Stage: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_upsert.schema.js
var require_operation_upsert_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("upsert"),
          dealName: stringOrExpression.optional(),
          stage: stringOrExpression.optional(),
          additionalFields: z.object({ Amount: numberOrExpression.optional(), Closing_Date: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Lead_Conversion_Time: numberOrExpression.optional(), Next_Step: stringOrExpression.optional(), Overall_Sales_Duration: numberOrExpression.optional(), Probability: numberOrExpression.optional(), Sales_Cycle_Duration: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_deal/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema3();
    var getDeleteSchema = require_operation_delete_schema3();
    var getGetSchema = require_operation_get_schema3();
    var getGetAllSchema = require_operation_get_all_schema3();
    var getUpdateSchema = require_operation_update_schema3();
    var getUpsertSchema = require_operation_upsert_schema3();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_create.schema.js
var require_operation_create_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("invoice"),
          operation: z.literal("create").default("create"),
          subject: stringOrExpression.optional(),
          Product_Details: z.object({ list_price: numberOrExpression.optional(), id: stringOrExpression.optional(), product_description: stringOrExpression.optional(), quantity: numberOrExpression.optional(), quantity_in_stock: numberOrExpression.optional(), Tax: numberOrExpression.optional(), total: numberOrExpression.optional(), total_after_discount: numberOrExpression.optional(), net_total: numberOrExpression.optional(), unit_price: numberOrExpression.optional() }).optional(),
          additionalFields: z.object({ accountId: stringOrExpression.optional(), Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Due_Date: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), Invoice_Date: stringOrExpression.optional(), Invoice_Number: stringOrExpression.optional(), Sales_Commission: numberOrExpression.optional(), Shipping_Address: z.unknown().optional(), Status: stringOrExpression.optional(), Sub_Total: numberOrExpression.optional(), Tax: numberOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_delete.schema.js
var require_operation_delete_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("invoice"),
          operation: z.literal("delete"),
          invoiceId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("invoice"),
          operation: z.literal("get"),
          invoiceId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_get_all.schema.js
var require_operation_get_all_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("invoice"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ approved: booleanOrExpression.optional(), converted: booleanOrExpression.optional(), fields: z.array(z.string()).optional(), include_child: booleanOrExpression.optional(), sort_by: stringOrExpression.optional(), sort_order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_update.schema.js
var require_operation_update_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("invoice"),
          operation: z.literal("update"),
          invoiceId: stringOrExpression.optional(),
          updateFields: z.object({ accountId: stringOrExpression.optional(), Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Due_Date: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), Invoice_Date: stringOrExpression.optional(), Invoice_Number: stringOrExpression.optional(), Product_Details: z.unknown().optional(), Sales_Commission: numberOrExpression.optional(), Shipping_Address: z.unknown().optional(), Status: stringOrExpression.optional(), Sub_Total: numberOrExpression.optional(), Subject: stringOrExpression.optional(), Tax: numberOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_upsert.schema.js
var require_operation_upsert_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("invoice"),
          operation: z.literal("upsert"),
          subject: stringOrExpression.optional(),
          Product_Details: z.object({ list_price: numberOrExpression.optional(), id: stringOrExpression.optional(), product_description: stringOrExpression.optional(), quantity: numberOrExpression.optional(), quantity_in_stock: numberOrExpression.optional(), Tax: numberOrExpression.optional(), total: numberOrExpression.optional(), total_after_discount: numberOrExpression.optional(), net_total: numberOrExpression.optional(), unit_price: numberOrExpression.optional() }).optional(),
          additionalFields: z.object({ accountId: stringOrExpression.optional(), Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Due_Date: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), Invoice_Date: stringOrExpression.optional(), Invoice_Number: stringOrExpression.optional(), Sales_Commission: numberOrExpression.optional(), Shipping_Address: z.unknown().optional(), Status: stringOrExpression.optional(), Sub_Total: numberOrExpression.optional(), Tax: numberOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_invoice/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema4();
    var getDeleteSchema = require_operation_delete_schema4();
    var getGetSchema = require_operation_get_schema4();
    var getGetAllSchema = require_operation_get_all_schema4();
    var getUpdateSchema = require_operation_update_schema4();
    var getUpsertSchema = require_operation_upsert_schema4();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_create.schema.js
var require_operation_create_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead"),
          operation: z.literal("create").default("create"),
          Company: stringOrExpression.optional(),
          lastName: stringOrExpression.optional(),
          additionalFields: z.object({ Address: z.unknown().optional(), Annual_Revenue: numberOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Designation: stringOrExpression.optional(), Email: stringOrExpression.optional(), Email_Opt_Out: booleanOrExpression.optional(), Fax: stringOrExpression.optional(), First_Name: stringOrExpression.optional(), Full_Name: stringOrExpression.optional(), Industry: stringOrExpression.optional(), Industry_Type: stringOrExpression.optional(), Lead_Source: stringOrExpression.optional(), Lead_Status: stringOrExpression.optional(), Mobile: stringOrExpression.optional(), No_of_Employees: numberOrExpression.optional(), Phone: stringOrExpression.optional(), Salutation: stringOrExpression.optional(), Secondary_Email: stringOrExpression.optional(), Skype_ID: stringOrExpression.optional(), Twitter: stringOrExpression.optional(), Website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_delete.schema.js
var require_operation_delete_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead"),
          operation: z.literal("delete"),
          leadId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_get.schema.js
var require_operation_get_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead"),
          operation: z.literal("get"),
          leadId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_get_all.schema.js
var require_operation_get_all_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ approved: booleanOrExpression.optional(), converted: booleanOrExpression.optional(), fields: z.array(z.string()).optional(), include_child: booleanOrExpression.optional(), sort_by: stringOrExpression.optional(), sort_order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_get_fields.schema.js
var require_operation_get_fields_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_get_fields.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead"),
          operation: z.literal("getFields")
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_update.schema.js
var require_operation_update_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead"),
          operation: z.literal("update"),
          leadId: stringOrExpression.optional(),
          updateFields: z.object({ Address: z.unknown().optional(), Annual_Revenue: numberOrExpression.optional(), Company: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Designation: stringOrExpression.optional(), Email: stringOrExpression.optional(), Email_Opt_Out: booleanOrExpression.optional(), Fax: stringOrExpression.optional(), First_Name: stringOrExpression.optional(), Full_Name: stringOrExpression.optional(), Industry: stringOrExpression.optional(), Industry_Type: stringOrExpression.optional(), Last_Name: stringOrExpression.optional(), Lead_Source: stringOrExpression.optional(), Lead_Status: stringOrExpression.optional(), Mobile: stringOrExpression.optional(), No_of_Employees: numberOrExpression.optional(), Phone: stringOrExpression.optional(), Salutation: stringOrExpression.optional(), Secondary_Email: stringOrExpression.optional(), Skype_ID: stringOrExpression.optional(), Twitter: stringOrExpression.optional(), Website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_upsert.schema.js
var require_operation_upsert_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead"),
          operation: z.literal("upsert"),
          Company: stringOrExpression.optional(),
          lastName: stringOrExpression.optional(),
          additionalFields: z.object({ Address: z.unknown().optional(), Annual_Revenue: numberOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Designation: stringOrExpression.optional(), Email: stringOrExpression.optional(), Email_Opt_Out: booleanOrExpression.optional(), Fax: stringOrExpression.optional(), First_Name: stringOrExpression.optional(), Full_Name: stringOrExpression.optional(), Industry: stringOrExpression.optional(), Industry_Type: stringOrExpression.optional(), Lead_Source: stringOrExpression.optional(), Lead_Status: stringOrExpression.optional(), Mobile: stringOrExpression.optional(), No_of_Employees: numberOrExpression.optional(), Phone: stringOrExpression.optional(), Salutation: stringOrExpression.optional(), Secondary_Email: stringOrExpression.optional(), Skype_ID: stringOrExpression.optional(), Twitter: stringOrExpression.optional(), Website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_lead/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema5();
    var getDeleteSchema = require_operation_delete_schema5();
    var getGetSchema = require_operation_get_schema5();
    var getGetAllSchema = require_operation_get_all_schema5();
    var getGetFieldsSchema = require_operation_get_fields_schema();
    var getUpdateSchema = require_operation_update_schema5();
    var getUpsertSchema = require_operation_upsert_schema5();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetFieldsSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_create.schema.js
var require_operation_create_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product"),
          operation: z.literal("create").default("create"),
          productName: stringOrExpression.optional(),
          additionalFields: z.object({ Commission_Rate: numberOrExpression.optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Manufacturer: stringOrExpression.optional(), Product_Active: booleanOrExpression.optional(), Product_Category: stringOrExpression.optional(), Qty_in_Demand: numberOrExpression.optional(), Qty_in_Stock: numberOrExpression.optional(), Taxable: booleanOrExpression.optional(), Unit_Price: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_delete.schema.js
var require_operation_delete_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product"),
          operation: z.literal("delete"),
          productId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_get.schema.js
var require_operation_get_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product"),
          operation: z.literal("get"),
          productId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_get_all.schema.js
var require_operation_get_all_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ approved: booleanOrExpression.optional(), converted: booleanOrExpression.optional(), fields: z.array(z.string()).optional(), include_child: booleanOrExpression.optional(), sort_by: stringOrExpression.optional(), sort_order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_update.schema.js
var require_operation_update_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product"),
          operation: z.literal("update"),
          productId: stringOrExpression.optional(),
          updateFields: z.object({ Commission_Rate: numberOrExpression.optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Manufacturer: stringOrExpression.optional(), Product_Active: booleanOrExpression.optional(), Product_Category: stringOrExpression.optional(), Qty_in_Demand: numberOrExpression.optional(), Qty_in_Stock: numberOrExpression.optional(), Taxable: booleanOrExpression.optional(), Unit_Price: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_upsert.schema.js
var require_operation_upsert_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product"),
          operation: z.literal("upsert"),
          productName: stringOrExpression.optional(),
          additionalFields: z.object({ Commission_Rate: numberOrExpression.optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Manufacturer: stringOrExpression.optional(), Product_Active: booleanOrExpression.optional(), Product_Category: stringOrExpression.optional(), Qty_in_Demand: numberOrExpression.optional(), Qty_in_Stock: numberOrExpression.optional(), Taxable: booleanOrExpression.optional(), Unit_Price: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_product/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema6();
    var getDeleteSchema = require_operation_delete_schema6();
    var getGetSchema = require_operation_get_schema6();
    var getGetAllSchema = require_operation_get_all_schema6();
    var getUpdateSchema = require_operation_update_schema6();
    var getUpsertSchema = require_operation_upsert_schema6();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_create.schema.js
var require_operation_create_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("purchaseOrder"),
          operation: z.literal("create").default("create"),
          subject: stringOrExpression.optional(),
          vendorId: stringOrExpression.optional(),
          Product_Details: z.object({ list_price: numberOrExpression.optional(), id: stringOrExpression.optional(), product_description: stringOrExpression.optional(), quantity: numberOrExpression.optional(), quantity_in_stock: numberOrExpression.optional(), Tax: numberOrExpression.optional(), total: numberOrExpression.optional(), total_after_discount: numberOrExpression.optional(), net_total: numberOrExpression.optional(), unit_price: numberOrExpression.optional() }).optional(),
          additionalFields: z.object({ Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Carrier: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Discount: numberOrExpression.optional(), Due_Date: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), PO_Date: stringOrExpression.optional(), PO_Number: stringOrExpression.optional(), Sales_Commission: numberOrExpression.optional(), Shipping_Address: z.unknown().optional(), Status: stringOrExpression.optional(), Sub_Total: numberOrExpression.optional(), Tax: numberOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional(), Tracking_Number: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_delete.schema.js
var require_operation_delete_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("purchaseOrder"),
          operation: z.literal("delete"),
          purchaseOrderId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_get.schema.js
var require_operation_get_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("purchaseOrder"),
          operation: z.literal("get"),
          purchaseOrderId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_get_all.schema.js
var require_operation_get_all_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("purchaseOrder"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ approved: booleanOrExpression.optional(), converted: booleanOrExpression.optional(), fields: z.array(z.string()).optional(), include_child: booleanOrExpression.optional(), sort_by: stringOrExpression.optional(), sort_order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_update.schema.js
var require_operation_update_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("purchaseOrder"),
          operation: z.literal("update"),
          purchaseOrderId: stringOrExpression.optional(),
          updateFields: z.object({ Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Carrier: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Discount: numberOrExpression.optional(), Due_Date: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), PO_Date: stringOrExpression.optional(), PO_Number: stringOrExpression.optional(), Sales_Commission: numberOrExpression.optional(), Shipping_Address: z.unknown().optional(), Status: stringOrExpression.optional(), Sub_Total: numberOrExpression.optional(), Subject: stringOrExpression.optional(), Tax: numberOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional(), Tracking_Number: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_upsert.schema.js
var require_operation_upsert_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("purchaseOrder"),
          operation: z.literal("upsert"),
          subject: stringOrExpression.optional(),
          vendorId: stringOrExpression.optional(),
          Product_Details: z.object({ list_price: numberOrExpression.optional(), id: stringOrExpression.optional(), product_description: stringOrExpression.optional(), quantity: numberOrExpression.optional(), quantity_in_stock: numberOrExpression.optional(), Tax: numberOrExpression.optional(), total: numberOrExpression.optional(), total_after_discount: numberOrExpression.optional(), net_total: numberOrExpression.optional(), unit_price: numberOrExpression.optional() }).optional(),
          additionalFields: z.object({ Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Carrier: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Discount: numberOrExpression.optional(), Due_Date: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), PO_Date: stringOrExpression.optional(), PO_Number: stringOrExpression.optional(), Sales_Commission: numberOrExpression.optional(), Shipping_Address: z.unknown().optional(), Status: stringOrExpression.optional(), Sub_Total: numberOrExpression.optional(), Tax: numberOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional(), Tracking_Number: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/index.schema.js
var require_index_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_purchase_order/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema7();
    var getDeleteSchema = require_operation_delete_schema7();
    var getGetSchema = require_operation_get_schema7();
    var getGetAllSchema = require_operation_get_all_schema7();
    var getUpdateSchema = require_operation_update_schema7();
    var getUpsertSchema = require_operation_upsert_schema7();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_create.schema.js
var require_operation_create_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("quote"),
          operation: z.literal("create").default("create"),
          subject: stringOrExpression.optional(),
          Product_Details: z.object({ list_price: numberOrExpression.optional(), id: stringOrExpression.optional(), product_description: stringOrExpression.optional(), quantity: numberOrExpression.optional(), quantity_in_stock: numberOrExpression.optional(), Tax: numberOrExpression.optional(), total: numberOrExpression.optional(), total_after_discount: numberOrExpression.optional(), net_total: numberOrExpression.optional(), unit_price: numberOrExpression.optional() }).optional(),
          additionalFields: z.object({ Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Carrier: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), Quote_Stage: stringOrExpression.optional(), Shipping_Address: z.unknown().optional(), Sub_Total: numberOrExpression.optional(), Tax: numberOrExpression.optional(), Team: stringOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional(), Valid_Till: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_delete.schema.js
var require_operation_delete_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("quote"),
          operation: z.literal("delete"),
          quoteId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_get.schema.js
var require_operation_get_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("quote"),
          operation: z.literal("get"),
          quoteId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_get_all.schema.js
var require_operation_get_all_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("quote"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ approved: booleanOrExpression.optional(), converted: booleanOrExpression.optional(), fields: z.array(z.string()).optional(), include_child: booleanOrExpression.optional(), sort_by: stringOrExpression.optional(), sort_order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_update.schema.js
var require_operation_update_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("quote"),
          operation: z.literal("update"),
          quoteId: stringOrExpression.optional(),
          updateFields: z.object({ Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Carrier: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), Quote_Stage: stringOrExpression.optional(), Shipping_Address: z.unknown().optional(), Sub_Total: numberOrExpression.optional(), Subject: stringOrExpression.optional(), Tax: numberOrExpression.optional(), Team: stringOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional(), Valid_Till: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_upsert.schema.js
var require_operation_upsert_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("quote"),
          operation: z.literal("upsert"),
          subject: stringOrExpression.optional(),
          Product_Details: z.object({ list_price: numberOrExpression.optional(), id: stringOrExpression.optional(), product_description: stringOrExpression.optional(), quantity: numberOrExpression.optional(), quantity_in_stock: numberOrExpression.optional(), Tax: numberOrExpression.optional(), total: numberOrExpression.optional(), total_after_discount: numberOrExpression.optional(), net_total: numberOrExpression.optional(), unit_price: numberOrExpression.optional() }).optional(),
          additionalFields: z.object({ Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Carrier: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), Quote_Stage: stringOrExpression.optional(), Shipping_Address: z.unknown().optional(), Sub_Total: numberOrExpression.optional(), Tax: numberOrExpression.optional(), Team: stringOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional(), Valid_Till: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/index.schema.js
var require_index_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_quote/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema8();
    var getDeleteSchema = require_operation_delete_schema8();
    var getGetSchema = require_operation_get_schema8();
    var getGetAllSchema = require_operation_get_all_schema8();
    var getUpdateSchema = require_operation_update_schema8();
    var getUpsertSchema = require_operation_upsert_schema8();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_create.schema.js
var require_operation_create_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("salesOrder"),
          operation: z.literal("create").default("create"),
          accountId: stringOrExpression.optional(),
          subject: stringOrExpression.optional(),
          Product_Details: z.object({ list_price: numberOrExpression.optional(), id: stringOrExpression.optional(), product_description: stringOrExpression.optional(), quantity: numberOrExpression.optional(), quantity_in_stock: numberOrExpression.optional(), Tax: numberOrExpression.optional(), total: numberOrExpression.optional(), total_after_discount: numberOrExpression.optional(), net_total: numberOrExpression.optional(), unit_price: numberOrExpression.optional() }).optional(),
          additionalFields: z.object({ Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Carrier: stringOrExpression.optional(), contactId: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), dealId: stringOrExpression.optional(), Description: stringOrExpression.optional(), Discount: numberOrExpression.optional(), Due_Date: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), SO_Number: stringOrExpression.optional(), Sales_Commission: numberOrExpression.optional(), Shipping_Address: z.unknown().optional(), Status: stringOrExpression.optional(), Sub_Total: numberOrExpression.optional(), Tax: numberOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_delete.schema.js
var require_operation_delete_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("salesOrder"),
          operation: z.literal("delete"),
          salesOrderId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_get.schema.js
var require_operation_get_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("salesOrder"),
          operation: z.literal("get"),
          salesOrderId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_get_all.schema.js
var require_operation_get_all_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("salesOrder"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ approved: booleanOrExpression.optional(), converted: booleanOrExpression.optional(), fields: z.array(z.string()).optional(), include_child: booleanOrExpression.optional(), sort_by: stringOrExpression.optional(), sort_order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_update.schema.js
var require_operation_update_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("salesOrder"),
          operation: z.literal("update"),
          salesOrderId: stringOrExpression.optional(),
          updateFields: z.object({ accountId: stringOrExpression.optional(), Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Carrier: stringOrExpression.optional(), contactId: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), dealId: stringOrExpression.optional(), Description: stringOrExpression.optional(), Discount: numberOrExpression.optional(), Due_Date: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), SO_Number: stringOrExpression.optional(), Sales_Commission: numberOrExpression.optional(), Shipping_Address: z.unknown().optional(), Status: stringOrExpression.optional(), Sub_Total: numberOrExpression.optional(), Subject: stringOrExpression.optional(), Tax: numberOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_upsert.schema.js
var require_operation_upsert_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("salesOrder"),
          operation: z.literal("upsert"),
          accountId: stringOrExpression.optional(),
          subject: stringOrExpression.optional(),
          Product_Details: z.object({ list_price: numberOrExpression.optional(), id: stringOrExpression.optional(), product_description: stringOrExpression.optional(), quantity: numberOrExpression.optional(), quantity_in_stock: numberOrExpression.optional(), Tax: numberOrExpression.optional(), total: numberOrExpression.optional(), total_after_discount: numberOrExpression.optional(), net_total: numberOrExpression.optional(), unit_price: numberOrExpression.optional() }).optional(),
          additionalFields: z.object({ Adjustment: numberOrExpression.optional(), Billing_Address: z.unknown().optional(), Carrier: stringOrExpression.optional(), contactId: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), dealId: stringOrExpression.optional(), Description: stringOrExpression.optional(), Discount: numberOrExpression.optional(), Due_Date: stringOrExpression.optional(), Exchange_Rate: numberOrExpression.optional(), Grand_Total: numberOrExpression.optional(), SO_Number: stringOrExpression.optional(), Sales_Commission: numberOrExpression.optional(), Shipping_Address: z.unknown().optional(), Status: stringOrExpression.optional(), Sub_Total: numberOrExpression.optional(), Tax: numberOrExpression.optional(), Terms_and_Conditions: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/index.schema.js
var require_index_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_sales_order/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema9();
    var getDeleteSchema = require_operation_delete_schema9();
    var getGetSchema = require_operation_get_schema9();
    var getGetAllSchema = require_operation_get_all_schema9();
    var getUpdateSchema = require_operation_update_schema9();
    var getUpsertSchema = require_operation_upsert_schema9();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_create.schema.js
var require_operation_create_schema10 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("vendor"),
          operation: z.literal("create").default("create"),
          vendorName: stringOrExpression.optional(),
          additionalFields: z.object({ Address: z.unknown().optional(), Category: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Email: stringOrExpression.optional(), Phone: stringOrExpression.optional(), Website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_delete.schema.js
var require_operation_delete_schema10 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("vendor"),
          operation: z.literal("delete"),
          vendorId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_get.schema.js
var require_operation_get_schema10 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("vendor"),
          operation: z.literal("get"),
          vendorId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_get_all.schema.js
var require_operation_get_all_schema10 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("vendor"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ approved: booleanOrExpression.optional(), converted: booleanOrExpression.optional(), fields: z.array(z.string()).optional(), include_child: booleanOrExpression.optional(), sort_by: stringOrExpression.optional(), sort_order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_update.schema.js
var require_operation_update_schema10 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("vendor"),
          operation: z.literal("update"),
          vendorId: stringOrExpression.optional(),
          updateFields: z.object({ Address: z.unknown().optional(), Category: stringOrExpression.optional(), Currency: stringOrExpression.optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Email: stringOrExpression.optional(), Phone: stringOrExpression.optional(), Vendor_Name: stringOrExpression.optional(), Website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_upsert.schema.js
var require_operation_upsert_schema10 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("vendor"),
          operation: z.literal("upsert"),
          vendorName: stringOrExpression.optional(),
          additionalFields: z.object({ Address: z.unknown().optional(), Category: stringOrExpression.optional(), Currency: z.union([z.literal("USD"), z.literal("EUR"), z.literal("AED"), z.literal("AFN"), z.literal("ALL"), z.literal("ARS"), z.literal("AUD"), z.literal("AZN"), z.literal("BBD"), z.literal("BDT"), z.literal("BGN"), z.literal("BMD"), z.literal("BND"), z.literal("BOB"), z.literal("BRL"), z.literal("BSD"), z.literal("BWP"), z.literal("BZD"), z.literal("CAD"), z.literal("CHF"), z.literal("CLP"), z.literal("CNY"), z.literal("COP"), z.literal("CRC"), z.literal("CZK"), z.literal("DKK"), z.literal("DOP"), z.literal("DZD"), z.literal("EGP"), z.literal("FJD"), z.literal("GBP"), z.literal("GTQ"), z.literal("HKD"), z.literal("HNL"), z.literal("HRK"), z.literal("HUF"), z.literal("IDR"), z.literal("ILS"), z.literal("INR"), z.literal("JMD"), z.literal("JPY"), z.literal("KES"), z.literal("KRW"), z.literal("KZT"), z.literal("LAK"), z.literal("LBP"), z.literal("LKR"), z.literal("LRD"), z.literal("MAD"), z.literal("MMK"), z.literal("MOP"), z.literal("MRO"), z.literal("MUR"), z.literal("MVR"), z.literal("MXN"), z.literal("MYR"), z.literal("NIO"), z.literal("NOK"), z.literal("NPR"), z.literal("NZD"), z.literal("PEN"), z.literal("PGK"), z.literal("PHP"), z.literal("PKR"), z.literal("PLN"), z.literal("QAR"), z.literal("RON"), z.literal("RUB"), z.literal("SAR"), z.literal("SBD"), z.literal("SCR"), z.literal("SEK"), z.literal("SGD"), z.literal("SYP"), z.literal("THB"), z.literal("TOP"), z.literal("TRY"), z.literal("TTD"), z.literal("TWD"), z.literal("UAH"), z.literal("VND"), z.literal("VUV"), z.literal("WST"), z.literal("XCD"), z.literal("XOF"), z.literal("YER"), z.literal("ZAR"), expressionSchema]).optional(), customFields: z.unknown().optional(), Description: stringOrExpression.optional(), Email: stringOrExpression.optional(), Phone: stringOrExpression.optional(), Website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/index.schema.js
var require_index_schema10 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/resource_vendor/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema10();
    var getDeleteSchema = require_operation_delete_schema10();
    var getGetSchema = require_operation_get_schema10();
    var getGetAllSchema = require_operation_get_all_schema10();
    var getUpdateSchema = require_operation_update_schema10();
    var getUpsertSchema = require_operation_upsert_schema10();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/zohoCrm/v1/index.schema.js
var getAccountSchema = require_index_schema();
var getContactSchema = require_index_schema2();
var getDealSchema = require_index_schema3();
var getInvoiceSchema = require_index_schema4();
var getLeadSchema = require_index_schema5();
var getProductSchema = require_index_schema6();
var getPurchaseOrderSchema = require_index_schema7();
var getQuoteSchema = require_index_schema8();
var getSalesOrderSchema = require_index_schema9();
var getVendorSchema = require_index_schema10();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "account" } : parameters;
  return z.union([
    getAccountSchema({ ...helpers, parameters: effectiveParams }),
    getContactSchema({ ...helpers, parameters: effectiveParams }),
    getDealSchema({ ...helpers, parameters: effectiveParams }),
    getInvoiceSchema({ ...helpers, parameters: effectiveParams }),
    getLeadSchema({ ...helpers, parameters: effectiveParams }),
    getProductSchema({ ...helpers, parameters: effectiveParams }),
    getPurchaseOrderSchema({ ...helpers, parameters: effectiveParams }),
    getQuoteSchema({ ...helpers, parameters: effectiveParams }),
    getSalesOrderSchema({ ...helpers, parameters: effectiveParams }),
    getVendorSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
