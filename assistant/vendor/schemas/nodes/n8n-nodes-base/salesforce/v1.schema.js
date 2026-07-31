var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_add_note.schema.js
var require_operation_add_note_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_add_note.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("addNote"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          accountId: stringOrExpression.optional(),
          title: stringOrExpression.optional(),
          options: z.object({ body: stringOrExpression.optional(), isPrivate: booleanOrExpression.optional(), ownerId: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ accountNumber: stringOrExpression.optional(), annualRevenue: numberOrExpression.optional(), accountSource: stringOrExpression.optional(), billingCity: stringOrExpression.optional(), billingCountry: stringOrExpression.optional(), billingPostalCode: stringOrExpression.optional(), billingState: stringOrExpression.optional(), billingStreet: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), fax: stringOrExpression.optional(), jigsaw: stringOrExpression.optional(), industry: stringOrExpression.optional(), numberOfEmployees: numberOrExpression.optional(), owner: stringOrExpression.optional(), parentId: stringOrExpression.optional(), phone: stringOrExpression.optional(), recordTypeId: stringOrExpression.optional(), sicDesc: stringOrExpression.optional(), type: stringOrExpression.optional(), shippingCity: stringOrExpression.optional(), shippingCountry: stringOrExpression.optional(), shippingPostalCode: stringOrExpression.optional(), shippingState: stringOrExpression.optional(), shippingStreet: stringOrExpression.optional(), website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          accountId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          accountId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ fields: stringOrExpression.optional(), conditionsUi: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_get_summary.schema.js
var require_operation_get_summary_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_get_summary.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("getSummary"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          accountId: stringOrExpression.optional(),
          updateFields: z.object({ accountNumber: stringOrExpression.optional(), accountSource: stringOrExpression.optional(), annualRevenue: numberOrExpression.optional(), billingCity: stringOrExpression.optional(), billingCountry: stringOrExpression.optional(), billingPostalCode: stringOrExpression.optional(), billingState: stringOrExpression.optional(), billingStreet: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), fax: stringOrExpression.optional(), industry: stringOrExpression.optional(), jigsaw: stringOrExpression.optional(), name: stringOrExpression.optional(), numberOfEmployees: numberOrExpression.optional(), ownerId: stringOrExpression.optional(), parentId: stringOrExpression.optional(), phone: stringOrExpression.optional(), recordTypeId: stringOrExpression.optional(), sicDesc: stringOrExpression.optional(), shippingCity: stringOrExpression.optional(), shippingCountry: stringOrExpression.optional(), shippingPostalCode: stringOrExpression.optional(), shippingState: stringOrExpression.optional(), shippingStreet: stringOrExpression.optional(), type: stringOrExpression.optional(), website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_upsert.schema.js
var require_operation_upsert_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("upsert"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          externalId: stringOrExpression.optional(),
          externalIdValue: stringOrExpression.optional(),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ accountNumber: stringOrExpression.optional(), annualRevenue: numberOrExpression.optional(), accountSource: stringOrExpression.optional(), billingCity: stringOrExpression.optional(), billingCountry: stringOrExpression.optional(), billingPostalCode: stringOrExpression.optional(), billingState: stringOrExpression.optional(), billingStreet: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), fax: stringOrExpression.optional(), jigsaw: stringOrExpression.optional(), industry: stringOrExpression.optional(), numberOfEmployees: numberOrExpression.optional(), owner: stringOrExpression.optional(), parentId: stringOrExpression.optional(), phone: stringOrExpression.optional(), recordTypeId: stringOrExpression.optional(), sicDesc: stringOrExpression.optional(), type: stringOrExpression.optional(), shippingCity: stringOrExpression.optional(), shippingCountry: stringOrExpression.optional(), shippingPostalCode: stringOrExpression.optional(), shippingState: stringOrExpression.optional(), shippingStreet: stringOrExpression.optional(), website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_account/index.schema.js"(exports2, module2) {
    var getAddNoteSchema = require_operation_add_note_schema();
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getGetSummarySchema = require_operation_get_summary_schema();
    var getUpdateSchema = require_operation_update_schema();
    var getUpsertSchema = require_operation_upsert_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddNoteSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetSummarySchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("attachment"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          parentId: stringOrExpression.optional(),
          name: stringOrExpression.optional(),
          binaryPropertyName: stringOrExpression.optional(),
          additionalFields: z.object({ description: stringOrExpression.optional(), isPrivate: booleanOrExpression.optional(), owner: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("attachment"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          attachmentId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("attachment"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          attachmentId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("attachment"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ conditionsUi: z.unknown().optional(), fields: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_get_summary.schema.js
var require_operation_get_summary_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_get_summary.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("attachment"),
          operation: z.literal("getSummary"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("attachment"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          attachmentId: stringOrExpression.optional(),
          updateFields: z.object({ binaryPropertyName: stringOrExpression.optional(), description: stringOrExpression.optional(), isPrivate: booleanOrExpression.optional(), name: stringOrExpression.optional(), owner: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_attachment/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getGetSummarySchema = require_operation_get_summary_schema2();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetSummarySchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_add_comment.schema.js
var require_operation_add_comment_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_add_comment.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("addComment"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          caseId: stringOrExpression.optional(),
          options: z.object({ commentBody: stringOrExpression.optional(), isPublished: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_create.schema.js
var require_operation_create_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          type: stringOrExpression.optional(),
          additionalFields: z.object({ accountId: stringOrExpression.optional(), contactId: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), isEscalated: booleanOrExpression.optional(), origin: stringOrExpression.optional(), owner: stringOrExpression.optional(), ParentId: stringOrExpression.optional(), priority: stringOrExpression.optional(), reason: stringOrExpression.optional(), recordTypeId: stringOrExpression.optional(), status: stringOrExpression.optional(), subject: stringOrExpression.optional(), suppliedCompany: stringOrExpression.optional(), suppliedEmail: stringOrExpression.optional(), suppliedName: stringOrExpression.optional(), suppliedPhone: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_delete.schema.js
var require_operation_delete_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          caseId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          caseId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ conditionsUi: z.unknown().optional(), fields: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_get_summary.schema.js
var require_operation_get_summary_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_get_summary.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("getSummary"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_update.schema.js
var require_operation_update_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          caseId: stringOrExpression.optional(),
          updateFields: z.object({ accountId: stringOrExpression.optional(), contactId: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), isEscalated: booleanOrExpression.optional(), origin: stringOrExpression.optional(), owner: stringOrExpression.optional(), ParentId: stringOrExpression.optional(), priority: stringOrExpression.optional(), reason: stringOrExpression.optional(), recordTypeId: stringOrExpression.optional(), status: stringOrExpression.optional(), subject: stringOrExpression.optional(), suppliedCompany: stringOrExpression.optional(), suppliedEmail: stringOrExpression.optional(), suppliedName: stringOrExpression.optional(), suppliedPhone: stringOrExpression.optional(), type: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_case/index.schema.js"(exports2, module2) {
    var getAddCommentSchema = require_operation_add_comment_schema();
    var getCreateSchema = require_operation_create_schema3();
    var getDeleteSchema = require_operation_delete_schema3();
    var getGetSchema = require_operation_get_schema3();
    var getGetAllSchema = require_operation_get_all_schema3();
    var getGetSummarySchema = require_operation_get_summary_schema3();
    var getUpdateSchema = require_operation_update_schema3();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddCommentSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetSummarySchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_add_note.schema.js
var require_operation_add_note_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_add_note.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("addNote"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          title: stringOrExpression.optional(),
          options: z.object({ body: stringOrExpression.optional(), isPrivate: booleanOrExpression.optional(), owner: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_add_to_campaign.schema.js
var require_operation_add_to_campaign_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_add_to_campaign.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("addToCampaign"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          campaignId: stringOrExpression.optional(),
          options: z.object({ status: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_create.schema.js
var require_operation_create_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          lastname: stringOrExpression.optional(),
          additionalFields: z.object({ acconuntId: stringOrExpression.optional(), assistantName: stringOrExpression.optional(), "Assistant Phone": stringOrExpression.optional(), birthdate: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), department: stringOrExpression.optional(), description: stringOrExpression.optional(), email: stringOrExpression.optional(), otherPostalCode: stringOrExpression.optional(), emailBouncedReason: stringOrExpression.optional(), fax: stringOrExpression.optional(), firstName: stringOrExpression.optional(), homePhone: stringOrExpression.optional(), jigsaw: stringOrExpression.optional(), leadSource: stringOrExpression.optional(), mailingCity: stringOrExpression.optional(), mailingCountry: stringOrExpression.optional(), mobilePhone: stringOrExpression.optional(), mailingPostalCode: stringOrExpression.optional(), mailingState: stringOrExpression.optional(), mailingStreet: stringOrExpression.optional(), otherCity: stringOrExpression.optional(), otherCountry: stringOrExpression.optional(), otherPhone: stringOrExpression.optional(), otherPostalCode: stringOrExpression.optional(), otherState: stringOrExpression.optional(), otherStreet: stringOrExpression.optional(), owner: stringOrExpression.optional(), phone: stringOrExpression.optional(), recordTypeId: stringOrExpression.optional(), salutation: stringOrExpression.optional(), title: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_delete.schema.js
var require_operation_delete_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_get_all.schema.js
var require_operation_get_all_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ conditionsUi: z.unknown().optional(), fields: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_get_summary.schema.js
var require_operation_get_summary_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_get_summary.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("getSummary"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_update.schema.js
var require_operation_update_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          contactId: stringOrExpression.optional(),
          updateFields: z.object({ acconuntId: stringOrExpression.optional(), assistantName: stringOrExpression.optional(), "Assistant Phone": stringOrExpression.optional(), birthdate: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), department: stringOrExpression.optional(), description: stringOrExpression.optional(), email: stringOrExpression.optional(), emailBouncedDate: stringOrExpression.optional(), emailBouncedReason: stringOrExpression.optional(), fax: stringOrExpression.optional(), firstName: stringOrExpression.optional(), homePhone: stringOrExpression.optional(), jigsaw: stringOrExpression.optional(), lastName: stringOrExpression.optional(), leadSource: stringOrExpression.optional(), mailingCity: stringOrExpression.optional(), mailingCountry: stringOrExpression.optional(), mailingState: stringOrExpression.optional(), mailingStreet: stringOrExpression.optional(), mailingPostalCode: stringOrExpression.optional(), mobilePhone: stringOrExpression.optional(), otherCity: stringOrExpression.optional(), otherCountry: stringOrExpression.optional(), otherPhone: stringOrExpression.optional(), otherPostalCode: stringOrExpression.optional(), otherState: stringOrExpression.optional(), otherStreet: stringOrExpression.optional(), owner: stringOrExpression.optional(), phone: stringOrExpression.optional(), recordTypeId: stringOrExpression.optional(), salutation: stringOrExpression.optional(), title: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_upsert.schema.js
var require_operation_upsert_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("upsert"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          externalId: stringOrExpression.optional(),
          externalIdValue: stringOrExpression.optional(),
          lastname: stringOrExpression.optional(),
          additionalFields: z.object({ acconuntId: stringOrExpression.optional(), assistantName: stringOrExpression.optional(), "Assistant Phone": stringOrExpression.optional(), birthdate: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), department: stringOrExpression.optional(), description: stringOrExpression.optional(), email: stringOrExpression.optional(), otherPostalCode: stringOrExpression.optional(), emailBouncedReason: stringOrExpression.optional(), fax: stringOrExpression.optional(), firstName: stringOrExpression.optional(), homePhone: stringOrExpression.optional(), jigsaw: stringOrExpression.optional(), leadSource: stringOrExpression.optional(), mailingCity: stringOrExpression.optional(), mailingCountry: stringOrExpression.optional(), mobilePhone: stringOrExpression.optional(), mailingPostalCode: stringOrExpression.optional(), mailingState: stringOrExpression.optional(), mailingStreet: stringOrExpression.optional(), otherCity: stringOrExpression.optional(), otherCountry: stringOrExpression.optional(), otherPhone: stringOrExpression.optional(), otherPostalCode: stringOrExpression.optional(), otherState: stringOrExpression.optional(), otherStreet: stringOrExpression.optional(), owner: stringOrExpression.optional(), phone: stringOrExpression.optional(), recordTypeId: stringOrExpression.optional(), salutation: stringOrExpression.optional(), title: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_contact/index.schema.js"(exports2, module2) {
    var getAddNoteSchema = require_operation_add_note_schema2();
    var getAddToCampaignSchema = require_operation_add_to_campaign_schema();
    var getCreateSchema = require_operation_create_schema4();
    var getDeleteSchema = require_operation_delete_schema4();
    var getGetSchema = require_operation_get_schema4();
    var getGetAllSchema = require_operation_get_all_schema4();
    var getGetSummarySchema = require_operation_get_summary_schema4();
    var getUpdateSchema = require_operation_update_schema4();
    var getUpsertSchema = require_operation_upsert_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddNoteSchema({ ...helpers, parameters: effectiveParams }),
        getAddToCampaignSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetSummarySchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_create.schema.js
var require_operation_create_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customObject"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          customObject: stringOrExpression.optional(),
          customFieldsUi: z.object({ customFieldsValues: z.array(z.object({ fieldId: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional(),
          additionalFields: z.object({ recordTypeId: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_delete.schema.js
var require_operation_delete_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customObject"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          customObject: stringOrExpression.optional(),
          recordId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_get.schema.js
var require_operation_get_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customObject"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          customObject: stringOrExpression.optional(),
          recordId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_get_all.schema.js
var require_operation_get_all_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customObject"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          customObject: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ conditionsUi: z.unknown().optional(), fields: z.array(z.string()).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_update.schema.js
var require_operation_update_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customObject"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          customObject: stringOrExpression.optional(),
          recordId: stringOrExpression.optional(),
          customFieldsUi: z.object({ customFieldsValues: z.array(z.object({ fieldId: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional(),
          updateFields: z.object({ recordTypeId: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_upsert.schema.js
var require_operation_upsert_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customObject"),
          operation: z.literal("upsert"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          customObject: stringOrExpression.optional(),
          externalId: stringOrExpression.optional(),
          externalIdValue: stringOrExpression.optional(),
          customFieldsUi: z.object({ customFieldsValues: z.array(z.object({ fieldId: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional(),
          additionalFields: z.object({ recordTypeId: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_custom_object/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema5();
    var getDeleteSchema = require_operation_delete_schema5();
    var getGetSchema = require_operation_get_schema5();
    var getGetAllSchema = require_operation_get_all_schema5();
    var getUpdateSchema = require_operation_update_schema5();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_document/operation_upload.schema.js
var require_operation_upload_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_document/operation_upload.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("document"),
          operation: z.literal("upload"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          title: stringOrExpression.optional(),
          binaryPropertyName: stringOrExpression.optional(),
          additionalFields: z.object({ fileExtension: stringOrExpression.optional(), linkToObjectId: stringOrExpression.optional(), ownerId: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_document/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_document/index.schema.js"(exports2, module2) {
    var getUploadSchema = require_operation_upload_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getUploadSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_flow/operation_get_all.schema.js
var require_operation_get_all_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_flow/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("flow"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_flow/operation_invoke.schema.js
var require_operation_invoke_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_flow/operation_invoke.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("flow"),
          operation: z.literal("invoke"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          apiName: stringOrExpression.optional(),
          jsonParameters: booleanOrExpression.optional(),
          variablesJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          variablesUi: resolveSchema({ parameters, schema: z.object({ variablesValues: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_flow/index.schema.js
var require_index_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_flow/index.schema.js"(exports2, module2) {
    var getGetAllSchema = require_operation_get_all_schema6();
    var getInvokeSchema = require_operation_invoke_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getInvokeSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_add_note.schema.js
var require_operation_add_note_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_add_note.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead").default("lead"),
          operation: z.literal("addNote"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          leadId: stringOrExpression.optional(),
          title: stringOrExpression.optional(),
          options: z.object({ body: stringOrExpression.optional(), isPrivate: booleanOrExpression.optional(), owner: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_add_to_campaign.schema.js
var require_operation_add_to_campaign_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_add_to_campaign.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead").default("lead"),
          operation: z.literal("addToCampaign"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          leadId: stringOrExpression.optional(),
          campaignId: stringOrExpression.optional(),
          options: z.object({ status: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_create.schema.js
var require_operation_create_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead").default("lead"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          company: stringOrExpression.optional(),
          lastname: stringOrExpression.optional(),
          additionalFields: z.object({ annualRevenue: numberOrExpression.optional(), city: stringOrExpression.optional(), country: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), email: stringOrExpression.optional(), fax: numberOrExpression.optional(), firstname: stringOrExpression.optional(), hasOptedOutOfEmail: booleanOrExpression.optional(), hasOptedOutOfFax: booleanOrExpression.optional(), industry: stringOrExpression.optional(), IsUnreadByOwner: booleanOrExpression.optional(), jigsaw: stringOrExpression.optional(), leadSource: stringOrExpression.optional(), mobilePhone: stringOrExpression.optional(), numberOfEmployees: numberOrExpression.optional(), owner: stringOrExpression.optional(), phone: stringOrExpression.optional(), postalCode: stringOrExpression.optional(), recordTypeId: stringOrExpression.optional(), rating: stringOrExpression.optional(), salutation: stringOrExpression.optional(), state: stringOrExpression.optional(), status: stringOrExpression.optional(), street: stringOrExpression.optional(), title: stringOrExpression.optional(), website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_delete.schema.js
var require_operation_delete_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead").default("lead"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          leadId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_get.schema.js
var require_operation_get_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead").default("lead"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          leadId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_get_all.schema.js
var require_operation_get_all_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead").default("lead"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ conditionsUi: z.unknown().optional(), fields: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_get_summary.schema.js
var require_operation_get_summary_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_get_summary.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead").default("lead"),
          operation: z.literal("getSummary"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_update.schema.js
var require_operation_update_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead").default("lead"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          leadId: stringOrExpression.optional(),
          updateFields: z.object({ annualRevenue: numberOrExpression.optional(), city: stringOrExpression.optional(), company: stringOrExpression.optional(), country: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), email: stringOrExpression.optional(), fax: numberOrExpression.optional(), firstname: stringOrExpression.optional(), hasOptedOutOfEmail: booleanOrExpression.optional(), HasOptedOutOfFax: booleanOrExpression.optional(), industry: stringOrExpression.optional(), IsUnreadByOwner: booleanOrExpression.optional(), jigsaw: stringOrExpression.optional(), lastname: stringOrExpression.optional(), leadSource: stringOrExpression.optional(), mobilePhone: stringOrExpression.optional(), numberOfEmployees: numberOrExpression.optional(), owner: stringOrExpression.optional(), postalCode: stringOrExpression.optional(), phone: stringOrExpression.optional(), recordTypeId: stringOrExpression.optional(), rating: stringOrExpression.optional(), salutation: stringOrExpression.optional(), state: stringOrExpression.optional(), status: stringOrExpression.optional(), street: stringOrExpression.optional(), title: stringOrExpression.optional(), website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_upsert.schema.js
var require_operation_upsert_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("lead").default("lead"),
          operation: z.literal("upsert"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          externalId: stringOrExpression.optional(),
          externalIdValue: stringOrExpression.optional(),
          company: stringOrExpression.optional(),
          lastname: stringOrExpression.optional(),
          additionalFields: z.object({ annualRevenue: numberOrExpression.optional(), city: stringOrExpression.optional(), country: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), email: stringOrExpression.optional(), fax: numberOrExpression.optional(), firstname: stringOrExpression.optional(), hasOptedOutOfEmail: booleanOrExpression.optional(), hasOptedOutOfFax: booleanOrExpression.optional(), industry: stringOrExpression.optional(), IsUnreadByOwner: booleanOrExpression.optional(), jigsaw: stringOrExpression.optional(), leadSource: stringOrExpression.optional(), mobilePhone: stringOrExpression.optional(), numberOfEmployees: numberOrExpression.optional(), owner: stringOrExpression.optional(), phone: stringOrExpression.optional(), postalCode: stringOrExpression.optional(), recordTypeId: stringOrExpression.optional(), rating: stringOrExpression.optional(), salutation: stringOrExpression.optional(), state: stringOrExpression.optional(), status: stringOrExpression.optional(), street: stringOrExpression.optional(), title: stringOrExpression.optional(), website: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/index.schema.js
var require_index_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_lead/index.schema.js"(exports2, module2) {
    var getAddNoteSchema = require_operation_add_note_schema3();
    var getAddToCampaignSchema = require_operation_add_to_campaign_schema2();
    var getCreateSchema = require_operation_create_schema6();
    var getDeleteSchema = require_operation_delete_schema6();
    var getGetSchema = require_operation_get_schema6();
    var getGetAllSchema = require_operation_get_all_schema7();
    var getGetSummarySchema = require_operation_get_summary_schema5();
    var getUpdateSchema = require_operation_update_schema6();
    var getUpsertSchema = require_operation_upsert_schema4();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddNoteSchema({ ...helpers, parameters: effectiveParams }),
        getAddToCampaignSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetSummarySchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_add_note.schema.js
var require_operation_add_note_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_add_note.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("opportunity"),
          operation: z.literal("addNote"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          opportunityId: stringOrExpression.optional(),
          title: stringOrExpression.optional(),
          options: z.object({ body: stringOrExpression.optional(), isPrivate: booleanOrExpression.optional(), owner: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_create.schema.js
var require_operation_create_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("opportunity"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          name: stringOrExpression.optional(),
          closeDate: stringOrExpression.optional(),
          stageName: stringOrExpression.optional(),
          additionalFields: z.object({ accountId: stringOrExpression.optional(), amount: numberOrExpression.optional(), campaignId: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), forecastCategoryName: stringOrExpression.optional(), leadSource: stringOrExpression.optional(), nextStep: stringOrExpression.optional(), owner: stringOrExpression.optional(), phone: stringOrExpression.optional(), pricebook2Id: stringOrExpression.optional(), probability: numberOrExpression.optional(), type: z.union([z.literal("Business"), z.literal("New Business"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_delete.schema.js
var require_operation_delete_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("opportunity"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          opportunityId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_get.schema.js
var require_operation_get_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("opportunity"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          opportunityId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_get_all.schema.js
var require_operation_get_all_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("opportunity"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ conditionsUi: z.unknown().optional(), fields: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_get_summary.schema.js
var require_operation_get_summary_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_get_summary.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("opportunity"),
          operation: z.literal("getSummary"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_update.schema.js
var require_operation_update_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("opportunity"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          opportunityId: stringOrExpression.optional(),
          updateFields: z.object({ accountId: stringOrExpression.optional(), amount: numberOrExpression.optional(), campaignId: stringOrExpression.optional(), closeDate: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), forecastCategoryName: stringOrExpression.optional(), leadSource: stringOrExpression.optional(), name: stringOrExpression.optional(), nextStep: stringOrExpression.optional(), owner: stringOrExpression.optional(), phone: stringOrExpression.optional(), pricebook2Id: stringOrExpression.optional(), probability: numberOrExpression.optional(), stageName: stringOrExpression.optional(), type: z.union([z.literal("Business"), z.literal("New Business"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_upsert.schema.js
var require_operation_upsert_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("opportunity"),
          operation: z.literal("upsert"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          externalId: stringOrExpression.optional(),
          externalIdValue: stringOrExpression.optional(),
          name: stringOrExpression.optional(),
          closeDate: stringOrExpression.optional(),
          stageName: stringOrExpression.optional(),
          additionalFields: z.object({ accountId: stringOrExpression.optional(), amount: numberOrExpression.optional(), campaignId: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), forecastCategoryName: stringOrExpression.optional(), leadSource: stringOrExpression.optional(), nextStep: stringOrExpression.optional(), owner: stringOrExpression.optional(), phone: stringOrExpression.optional(), pricebook2Id: stringOrExpression.optional(), probability: numberOrExpression.optional(), type: z.union([z.literal("Business"), z.literal("New Business"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/index.schema.js
var require_index_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_opportunity/index.schema.js"(exports2, module2) {
    var getAddNoteSchema = require_operation_add_note_schema4();
    var getCreateSchema = require_operation_create_schema7();
    var getDeleteSchema = require_operation_delete_schema7();
    var getGetSchema = require_operation_get_schema7();
    var getGetAllSchema = require_operation_get_all_schema8();
    var getGetSummarySchema = require_operation_get_summary_schema6();
    var getUpdateSchema = require_operation_update_schema7();
    var getUpsertSchema = require_operation_upsert_schema5();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddNoteSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetSummarySchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_search/operation_query.schema.js
var require_operation_query_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_search/operation_query.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("search"),
          operation: z.literal("query"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          query: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_search/index.schema.js
var require_index_schema10 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_search/index.schema.js"(exports2, module2) {
    var getQuerySchema = require_operation_query_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getQuerySchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_create.schema.js
var require_operation_create_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          status: stringOrExpression.optional(),
          additionalFields: z.object({ activityDate: stringOrExpression.optional(), callDisposition: stringOrExpression.optional(), callDurationInSeconds: numberOrExpression.optional(), callObject: stringOrExpression.optional(), callType: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), isReminderSet: booleanOrExpression.optional(), owner: stringOrExpression.optional(), priority: stringOrExpression.optional(), recurrenceType: stringOrExpression.optional(), recurrenceInstance: stringOrExpression.optional(), recurrenceInterval: numberOrExpression.optional(), recurrenceDayOfMonth: numberOrExpression.optional(), recurrenceDayOfWeekMask: numberOrExpression.optional(), recurrenceEndDateOnly: stringOrExpression.optional(), recurrenceMonthOfYear: z.union([z.literal("January"), z.literal("February"), z.literal("March"), z.literal("April"), z.literal("May"), z.literal("June"), z.literal("July"), z.literal("August"), z.literal("September"), z.literal("October"), z.literal("November"), z.literal("December"), expressionSchema]).optional(), recurrenceRegeneratedType: z.union([z.literal("RecurrenceRegenerateAfterDueDate"), z.literal("RecurrenceRegenerateAfterToday"), z.literal("RecurrenceRegenerated"), expressionSchema]).optional(), recurrenceEndDateOnly: stringOrExpression.optional(), recurrenceTimeZoneSidKey: stringOrExpression.optional(), reminderDateTime: stringOrExpression.optional(), subject: stringOrExpression.optional(), type: stringOrExpression.optional(), whatId: stringOrExpression.optional(), whoId: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_delete.schema.js
var require_operation_delete_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          taskId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_get.schema.js
var require_operation_get_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          taskId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_get_all.schema.js
var require_operation_get_all_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ conditionsUi: z.unknown().optional(), fields: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_get_summary.schema.js
var require_operation_get_summary_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_get_summary.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("getSummary"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_update.schema.js
var require_operation_update_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          taskId: stringOrExpression.optional(),
          updateFields: z.object({ activityDate: stringOrExpression.optional(), callDisposition: stringOrExpression.optional(), callDurationInSeconds: numberOrExpression.optional(), callObject: stringOrExpression.optional(), callType: stringOrExpression.optional(), customFieldsUi: z.unknown().optional(), description: stringOrExpression.optional(), isReminderSet: booleanOrExpression.optional(), owner: stringOrExpression.optional(), priority: stringOrExpression.optional(), status: stringOrExpression.optional(), subject: stringOrExpression.optional(), recurrenceDayOfMonth: numberOrExpression.optional(), recurrenceDayOfWeekMask: numberOrExpression.optional(), recurrenceEndDateOnly: stringOrExpression.optional(), recurrenceInstance: stringOrExpression.optional(), recurrenceInterval: numberOrExpression.optional(), recurrenceMonthOfYear: z.union([z.literal("January"), z.literal("February"), z.literal("March"), z.literal("April"), z.literal("May"), z.literal("June"), z.literal("July"), z.literal("August"), z.literal("September"), z.literal("October"), z.literal("November"), z.literal("December"), expressionSchema]).optional(), recurrenceEndDateOnly: stringOrExpression.optional(), recurrenceRegeneratedType: z.union([z.literal("RecurrenceRegenerateAfterDueDate"), z.literal("RecurrenceRegenerateAfterToday"), z.literal("RecurrenceRegenerated"), expressionSchema]).optional(), recurrenceType: stringOrExpression.optional(), recurrenceTimeZoneSidKey: stringOrExpression.optional(), reminderDateTime: stringOrExpression.optional(), type: stringOrExpression.optional(), whatId: stringOrExpression.optional(), whoId: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/index.schema.js
var require_index_schema11 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_task/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema8();
    var getDeleteSchema = require_operation_delete_schema8();
    var getGetSchema = require_operation_get_schema8();
    var getGetAllSchema = require_operation_get_all_schema9();
    var getGetSummarySchema = require_operation_get_summary_schema7();
    var getUpdateSchema = require_operation_update_schema8();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetSummarySchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_user/operation_get.schema.js
var require_operation_get_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_user/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          userId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_user/operation_get_all.schema.js
var require_operation_get_all_schema10 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_user/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("jwt"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ conditionsUi: z.unknown().optional(), fields: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_user/index.schema.js
var require_index_schema12 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/resource_user/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema9();
    var getGetAllSchema = require_operation_get_all_schema10();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/salesforce/v1/index.schema.js
var getAccountSchema = require_index_schema();
var getAttachmentSchema = require_index_schema2();
var getCaseSchema = require_index_schema3();
var getContactSchema = require_index_schema4();
var getCustomObjectSchema = require_index_schema5();
var getDocumentSchema = require_index_schema6();
var getFlowSchema = require_index_schema7();
var getLeadSchema = require_index_schema8();
var getOpportunitySchema = require_index_schema9();
var getSearchSchema = require_index_schema10();
var getTaskSchema = require_index_schema11();
var getUserSchema = require_index_schema12();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "lead" } : parameters;
  return z.union([
    getAccountSchema({ ...helpers, parameters: effectiveParams }),
    getAttachmentSchema({ ...helpers, parameters: effectiveParams }),
    getCaseSchema({ ...helpers, parameters: effectiveParams }),
    getContactSchema({ ...helpers, parameters: effectiveParams }),
    getCustomObjectSchema({ ...helpers, parameters: effectiveParams }),
    getDocumentSchema({ ...helpers, parameters: effectiveParams }),
    getFlowSchema({ ...helpers, parameters: effectiveParams }),
    getLeadSchema({ ...helpers, parameters: effectiveParams }),
    getOpportunitySchema({ ...helpers, parameters: effectiveParams }),
    getSearchSchema({ ...helpers, parameters: effectiveParams }),
    getTaskSchema({ ...helpers, parameters: effectiveParams }),
    getUserSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
