var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_campaign_contact/operation_add.schema.js
var require_operation_add_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_campaign_contact/operation_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("campaignContact"),
          operation: z.literal("add"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          campaignId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_campaign_contact/operation_remove.schema.js
var require_operation_remove_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_campaign_contact/operation_remove.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("campaignContact"),
          operation: z.literal("remove"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          campaignId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_campaign_contact/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_campaign_contact/index.schema.js"(exports2, module2) {
    var getAddSchema = require_operation_add_schema();
    var getRemoveSchema = require_operation_remove_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddSchema({ ...helpers, parameters: effectiveParams }),
        getRemoveSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          name: stringOrExpression.optional(),
          simple: booleanOrExpression.optional(),
          additionalFields: z.object({ addressUi: z.unknown().optional(), annualRevenue: numberOrExpression.optional(), companyEmail: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), fax: stringOrExpression.optional(), industry: stringOrExpression.optional(), isPublished: booleanOrExpression.optional(), numberOfEmpoyees: numberOrExpression.optional(), overwriteWithBlank: booleanOrExpression.optional(), phone: stringOrExpression.optional(), website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          companyId: stringOrExpression.optional(),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          companyId: stringOrExpression.optional(),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional(),
          additionalFields: z.object({ orderByDir: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), orderBy: stringOrExpression.optional(), search: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          companyId: stringOrExpression.optional(),
          simple: booleanOrExpression.optional(),
          updateFields: z.object({ addressUi: z.unknown().optional(), annualRevenue: numberOrExpression.optional(), companyEmail: stringOrExpression.optional(), name: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), fax: stringOrExpression.optional(), industry: stringOrExpression.optional(), isPublished: booleanOrExpression.optional(), numberOfEmpoyees: numberOrExpression.optional(), overwriteWithBlank: booleanOrExpression.optional(), phone: stringOrExpression.optional(), website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company_contact/operation_add.schema.js
var require_operation_add_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company_contact/operation_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("companyContact"),
          operation: z.literal("add"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          companyId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company_contact/operation_remove.schema.js
var require_operation_remove_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company_contact/operation_remove.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("companyContact"),
          operation: z.literal("remove"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          companyId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company_contact/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_company_contact/index.schema.js"(exports2, module2) {
    var getAddSchema = require_operation_add_schema2();
    var getRemoveSchema = require_operation_remove_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddSchema({ ...helpers, parameters: effectiveParams }),
        getRemoveSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          jsonParameters: booleanOrExpression.optional(),
          email: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          firstName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          lastName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          company: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          position: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          title: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          bodyJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          additionalFields: z.object({ addressUi: z.unknown().optional(), b2bOrb2c: z.union([z.literal("B2B"), z.literal("B2C"), expressionSchema]).optional(), crmId: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), fax: stringOrExpression.optional(), hasPurchased: booleanOrExpression.optional(), ipAddress: stringOrExpression.optional(), lastActive: stringOrExpression.optional(), mobile: stringOrExpression.optional(), ownerId: stringOrExpression.optional(), phone: stringOrExpression.optional(), prospectOrCustomer: z.union([z.literal("Prospect"), z.literal("Customer"), expressionSchema]).optional(), sandbox: booleanOrExpression.optional(), stage: stringOrExpression.optional(), tags: z.array(z.string()).optional(), socialMediaUi: z.unknown().optional(), website: stringOrExpression.optional() }).optional(),
          options: z.object({ search: stringOrExpression.optional(), orderBy: stringOrExpression.optional(), orderByDir: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), publishedOnly: booleanOrExpression.optional(), minimal: booleanOrExpression.optional(), rawData: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          options: z.object({ search: stringOrExpression.optional(), orderBy: stringOrExpression.optional(), orderByDir: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), publishedOnly: booleanOrExpression.optional(), minimal: booleanOrExpression.optional(), rawData: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_edit_contact_point.schema.js
var require_operation_edit_contact_point_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_edit_contact_point.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("editContactPoint"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          action: z.union([z.literal("add"), z.literal("remove"), expressionSchema]).optional(),
          points: numberOrExpression.optional(),
          options: z.object({ search: stringOrExpression.optional(), orderBy: stringOrExpression.optional(), orderByDir: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), publishedOnly: booleanOrExpression.optional(), minimal: booleanOrExpression.optional(), rawData: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_edit_do_not_contact_list.schema.js
var require_operation_edit_do_not_contact_list_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_edit_do_not_contact_list.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("editDoNotContactList"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          action: z.union([z.literal("add"), z.literal("remove"), expressionSchema]).optional(),
          channel: z.union([z.literal("email"), z.literal("sms"), expressionSchema]).optional(),
          additionalFields: z.object({ reason: z.union([z.literal("1"), z.literal("2"), z.literal("3"), expressionSchema]).optional(), comments: stringOrExpression.optional() }).optional(),
          options: z.object({ search: stringOrExpression.optional(), orderBy: stringOrExpression.optional(), orderByDir: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), publishedOnly: booleanOrExpression.optional(), minimal: booleanOrExpression.optional(), rawData: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          options: z.object({ search: stringOrExpression.optional(), orderBy: stringOrExpression.optional(), orderByDir: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), publishedOnly: booleanOrExpression.optional(), minimal: booleanOrExpression.optional(), rawData: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ search: stringOrExpression.optional(), orderBy: stringOrExpression.optional(), orderByDir: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), publishedOnly: booleanOrExpression.optional(), minimal: booleanOrExpression.optional(), rawData: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_send_email.schema.js
var require_operation_send_email_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_send_email.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("sendEmail"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          options: z.object({ search: stringOrExpression.optional(), orderBy: stringOrExpression.optional(), orderByDir: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), publishedOnly: booleanOrExpression.optional(), minimal: booleanOrExpression.optional(), rawData: booleanOrExpression.optional() }).optional(),
          campaignEmailId: stringOrExpression.optional(),
          contactId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          jsonParameters: booleanOrExpression.optional(),
          updateFields: z.object({ bodyJson: z.union([iDataObjectSchema, z.string()]).optional(), addressUi: z.unknown().optional(), b2bOrb2c: z.union([z.literal("B2B"), z.literal("B2C"), expressionSchema]).optional(), crmId: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), email: stringOrExpression.optional(), fax: stringOrExpression.optional(), firstName: stringOrExpression.optional(), hasPurchased: booleanOrExpression.optional(), ipAddress: stringOrExpression.optional(), lastActive: stringOrExpression.optional(), lastName: stringOrExpression.optional(), mobile: stringOrExpression.optional(), ownerId: stringOrExpression.optional(), phone: stringOrExpression.optional(), position: stringOrExpression.optional(), company: stringOrExpression.optional(), prospectOrCustomer: z.union([z.literal("Prospect"), z.literal("Customer"), expressionSchema]).optional(), sandbox: booleanOrExpression.optional(), stage: stringOrExpression.optional(), tags: z.array(z.string()).optional(), title: stringOrExpression.optional(), socialMediaUi: z.unknown().optional(), website: stringOrExpression.optional(), ipAddress: stringOrExpression.optional() }).optional(),
          options: z.object({ search: stringOrExpression.optional(), orderBy: stringOrExpression.optional(), orderByDir: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), publishedOnly: booleanOrExpression.optional(), minimal: booleanOrExpression.optional(), rawData: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema2();
    var getEditContactPointSchema = require_operation_edit_contact_point_schema();
    var getEditDoNotContactListSchema = require_operation_edit_do_not_contact_list_schema();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getSendEmailSchema = require_operation_send_email_schema();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getEditContactPointSchema({ ...helpers, parameters: effectiveParams }),
        getEditDoNotContactListSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getSendEmailSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact_segment/operation_add.schema.js
var require_operation_add_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact_segment/operation_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contactSegment"),
          operation: z.literal("add"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          segmentId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact_segment/operation_remove.schema.js
var require_operation_remove_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact_segment/operation_remove.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contactSegment"),
          operation: z.literal("remove"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          segmentId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact_segment/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_contact_segment/index.schema.js"(exports2, module2) {
    var getAddSchema = require_operation_add_schema3();
    var getRemoveSchema = require_operation_remove_schema3();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddSchema({ ...helpers, parameters: effectiveParams }),
        getRemoveSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_segment_email/operation_send.schema.js
var require_operation_send_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_segment_email/operation_send.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("segmentEmail"),
          operation: z.literal("send"),
          authentication: z.union([z.literal("credentials"), z.literal("oAuth2"), expressionSchema]).optional(),
          segmentEmailId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_segment_email/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/resource_segment_email/index.schema.js"(exports2, module2) {
    var getSendSchema = require_operation_send_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getSendSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mautic/v1/index.schema.js
var getCampaignContactSchema = require_index_schema();
var getCompanySchema = require_index_schema2();
var getCompanyContactSchema = require_index_schema3();
var getContactSchema = require_index_schema4();
var getContactSegmentSchema = require_index_schema5();
var getSegmentEmailSchema = require_index_schema6();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "contact" } : parameters;
  return z.union([
    getCampaignContactSchema({ ...helpers, parameters: effectiveParams }),
    getCompanySchema({ ...helpers, parameters: effectiveParams }),
    getCompanyContactSchema({ ...helpers, parameters: effectiveParams }),
    getContactSchema({ ...helpers, parameters: effectiveParams }),
    getContactSegmentSchema({ ...helpers, parameters: effectiveParams }),
    getSegmentEmailSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
