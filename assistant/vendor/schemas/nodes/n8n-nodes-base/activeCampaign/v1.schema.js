var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("create").default("create"),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ accountUrl: stringOrExpression.optional(), fields: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("delete"),
          accountId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("get"),
          accountId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional(),
          filters: z.object({ search: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account"),
          operation: z.literal("update"),
          accountId: numberOrExpression.optional(),
          updateFields: z.object({ name: stringOrExpression.optional(), accountUrl: stringOrExpression.optional(), fields: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account_contact/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account_contact/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("accountContact"),
          operation: z.literal("create").default("create"),
          account: numberOrExpression.optional(),
          contact: numberOrExpression.optional(),
          additionalFields: z.object({ jobTitle: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account_contact/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account_contact/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("accountContact"),
          operation: z.literal("delete"),
          accountContactId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account_contact/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account_contact/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("accountContact"),
          operation: z.literal("update"),
          accountContactId: numberOrExpression.optional(),
          updateFields: z.object({ jobTitle: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account_contact/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_account_contact/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema2();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/operation_create.schema.js
var require_operation_create_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("connection"),
          operation: z.literal("create").default("create"),
          service: stringOrExpression.optional(),
          externalid: stringOrExpression.optional(),
          name: stringOrExpression.optional(),
          logoUrl: stringOrExpression.optional(),
          linkUrl: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/operation_delete.schema.js
var require_operation_delete_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("connection"),
          operation: z.literal("delete"),
          connectionId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("connection"),
          operation: z.literal("get"),
          connectionId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("connection"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/operation_update.schema.js
var require_operation_update_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("connection"),
          operation: z.literal("update"),
          connectionId: numberOrExpression.optional(),
          updateFields: z.object({ service: stringOrExpression.optional(), externalid: stringOrExpression.optional(), name: stringOrExpression.optional(), logoUrl: stringOrExpression.optional(), linkUrl: stringOrExpression.optional(), status: numberOrExpression.optional(), syncStatus: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_connection/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema3();
    var getDeleteSchema = require_operation_delete_schema3();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getUpdateSchema = require_operation_update_schema3();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/operation_create.schema.js
var require_operation_create_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("create").default("create"),
          email: stringOrExpression.optional(),
          updateIfExists: booleanOrExpression.optional(),
          additionalFields: z.object({ fieldValues: z.unknown().optional(), firstName: stringOrExpression.optional(), lastName: stringOrExpression.optional(), phone: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/operation_delete.schema.js
var require_operation_delete_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("delete"),
          contactId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("get"),
          contactId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional(),
          additionalFields: z.object({ datetime: stringOrExpression.optional(), email: stringOrExpression.optional(), email_like: stringOrExpression.optional(), exclude: stringOrExpression.optional(), formid: stringOrExpression.optional(), listid: stringOrExpression.optional(), search: stringOrExpression.optional(), segmentid: stringOrExpression.optional(), seriesid: stringOrExpression.optional(), status: z.union([z.literal(1), z.literal(-1), z.literal(3), z.literal(0), z.literal(2), expressionSchema]).optional(), tagid: stringOrExpression.optional(), "filters[created_before]": stringOrExpression.optional(), "filters[created_after]": stringOrExpression.optional(), "filters[updated_before]": stringOrExpression.optional(), "filters[updated_after]": stringOrExpression.optional(), waitid: stringOrExpression.optional(), orderBy: z.union([z.literal("orders[cdate]"), z.literal("orders[email]"), z.literal("orders[first_name]"), z.literal("orders[last_name]"), z.literal("orders[name]"), z.literal("orders[score]"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/operation_update.schema.js
var require_operation_update_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("update"),
          contactId: numberOrExpression.optional(),
          updateFields: z.object({ fieldValues: z.unknown().optional(), email: stringOrExpression.optional(), firstName: stringOrExpression.optional(), lastName: stringOrExpression.optional(), phone: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema4();
    var getDeleteSchema = require_operation_delete_schema4();
    var getGetSchema = require_operation_get_schema3();
    var getGetAllSchema = require_operation_get_all_schema3();
    var getUpdateSchema = require_operation_update_schema4();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_list/operation_add.schema.js
var require_operation_add_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_list/operation_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contactList"),
          operation: z.literal("add"),
          listId: numberOrExpression.optional(),
          contactId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_list/operation_remove.schema.js
var require_operation_remove_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_list/operation_remove.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contactList"),
          operation: z.literal("remove"),
          listId: numberOrExpression.optional(),
          contactId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_list/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_list/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_tag/operation_add.schema.js
var require_operation_add_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_tag/operation_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contactTag"),
          operation: z.literal("add"),
          tagId: stringOrExpression.optional(),
          contactId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_tag/operation_remove.schema.js
var require_operation_remove_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_tag/operation_remove.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contactTag"),
          operation: z.literal("remove"),
          contactTagId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_tag/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_contact_tag/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_create.schema.js
var require_operation_create_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("create").default("create"),
          title: stringOrExpression.optional(),
          contact: numberOrExpression.optional(),
          value: numberOrExpression.optional(),
          currency: z.union([z.literal("eur"), z.literal("usd"), z.literal("gbp"), z.literal("chf"), z.literal("cny"), z.literal(""), z.literal("aed"), z.literal("afn"), z.literal("all"), z.literal("amd"), z.literal("ang"), z.literal("aoa"), z.literal("ars"), z.literal("aud"), z.literal("awg"), z.literal("azn"), z.literal("bam"), z.literal("bbd"), z.literal("bdt"), z.literal("bgn"), z.literal("bhd"), z.literal("bif"), z.literal("bmd"), z.literal("bnd"), z.literal("bob"), z.literal("brl"), z.literal("bsd"), z.literal("btc"), z.literal("btn"), z.literal("bwp"), z.literal("byn"), z.literal("bzd"), z.literal("cad"), z.literal("cdf"), z.literal("clf"), z.literal("clp"), z.literal("cnh"), z.literal("cop"), z.literal("crc"), z.literal("cuc"), z.literal("cup"), z.literal("cve"), z.literal("czk"), z.literal("djf"), z.literal("dkk"), z.literal("dop"), z.literal("dzd"), z.literal("egp"), z.literal("ern"), z.literal("etb"), z.literal("fjd"), z.literal("fkp"), z.literal("gel"), z.literal("ggp"), z.literal("ghs"), z.literal("gip"), z.literal("gmd"), z.literal("gnf"), z.literal("gtq"), z.literal("gyd"), z.literal("hkd"), z.literal("hnl"), z.literal("hrk"), z.literal("htg"), z.literal("huf"), z.literal("idr"), z.literal("ils"), z.literal("imp"), z.literal("inr"), z.literal("iqd"), z.literal("irr"), z.literal("isk"), z.literal("jep"), z.literal("jmd"), z.literal("jod"), z.literal("jpy"), z.literal("kes"), z.literal("kgs"), z.literal("khr"), z.literal("kmf"), z.literal("kpw"), z.literal("krw"), z.literal("kwd"), z.literal("kyd"), z.literal("kzt"), z.literal("lak"), z.literal("lbp"), z.literal("lkr"), z.literal("lrd"), z.literal("lsl"), z.literal("lyd"), z.literal("mad"), z.literal("mdl"), z.literal("mga"), z.literal("mkd"), z.literal("mmk"), z.literal("mnt"), z.literal("mop"), z.literal("mro"), z.literal("mru"), z.literal("mur"), z.literal("mvr"), z.literal("mwk"), z.literal("mxn"), z.literal("myr"), z.literal("mzn"), z.literal("nad"), z.literal("ngn"), z.literal("nio"), z.literal("nok"), z.literal("npr"), z.literal("nzd"), z.literal("omr"), z.literal("pab"), z.literal("pen"), z.literal("pgk"), z.literal("php"), z.literal("pkr"), z.literal("pln"), z.literal("pyg"), z.literal("qar"), z.literal("ron"), z.literal("rsd"), z.literal("rub"), z.literal("rwf"), z.literal("sar"), z.literal("sbd"), z.literal("scr"), z.literal("sdg"), z.literal("sek"), z.literal("sgd"), z.literal("shp"), z.literal("sll"), z.literal("sos"), z.literal("srd"), z.literal("ssp"), z.literal("std"), z.literal("stn"), z.literal("svc"), z.literal("syp"), z.literal("szl"), z.literal("thb"), z.literal("tjs"), z.literal("tmt"), z.literal("tnd"), z.literal("top"), z.literal("try"), z.literal("ttd"), z.literal("twd"), z.literal("tzs"), z.literal("uah"), z.literal("ugx"), z.literal("uyu"), z.literal("uzs"), z.literal("vef"), z.literal("vnd"), z.literal("vuv"), z.literal("wst"), z.literal("xaf"), z.literal("xag"), z.literal("xau"), z.literal("xcd"), z.literal("xdr"), z.literal("xof"), z.literal("xpd"), z.literal("xpf"), z.literal("xpt"), z.literal("yer"), z.literal("zar"), z.literal("zmw"), z.literal("zwl"), expressionSchema]).optional(),
          group: stringOrExpression.optional(),
          stage: stringOrExpression.optional(),
          owner: stringOrExpression.optional(),
          additionalFields: z.object({ description: stringOrExpression.optional(), percent: numberOrExpression.optional(), status: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_create_note.schema.js
var require_operation_create_note_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_create_note.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("createNote"),
          dealId: numberOrExpression.optional(),
          dealNote: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_delete.schema.js
var require_operation_delete_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("delete"),
          dealId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("get"),
          dealId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_get_all.schema.js
var require_operation_get_all_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_update.schema.js
var require_operation_update_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("update"),
          dealId: numberOrExpression.optional(),
          updateFields: z.object({ title: stringOrExpression.optional(), contact: numberOrExpression.optional(), value: numberOrExpression.optional(), currency: z.union([z.literal("eur"), z.literal("usd"), z.literal("gbp"), z.literal("chf"), z.literal("cny"), z.literal(""), z.literal("aed"), z.literal("afn"), z.literal("all"), z.literal("amd"), z.literal("ang"), z.literal("aoa"), z.literal("ars"), z.literal("aud"), z.literal("awg"), z.literal("azn"), z.literal("bam"), z.literal("bbd"), z.literal("bdt"), z.literal("bgn"), z.literal("bhd"), z.literal("bif"), z.literal("bmd"), z.literal("bnd"), z.literal("bob"), z.literal("brl"), z.literal("bsd"), z.literal("btc"), z.literal("btn"), z.literal("bwp"), z.literal("byn"), z.literal("bzd"), z.literal("cad"), z.literal("cdf"), z.literal("clf"), z.literal("clp"), z.literal("cnh"), z.literal("cop"), z.literal("crc"), z.literal("cuc"), z.literal("cup"), z.literal("cve"), z.literal("czk"), z.literal("djf"), z.literal("dkk"), z.literal("dop"), z.literal("dzd"), z.literal("egp"), z.literal("ern"), z.literal("etb"), z.literal("fjd"), z.literal("fkp"), z.literal("gel"), z.literal("ggp"), z.literal("ghs"), z.literal("gip"), z.literal("gmd"), z.literal("gnf"), z.literal("gtq"), z.literal("gyd"), z.literal("hkd"), z.literal("hnl"), z.literal("hrk"), z.literal("htg"), z.literal("huf"), z.literal("idr"), z.literal("ils"), z.literal("imp"), z.literal("inr"), z.literal("iqd"), z.literal("irr"), z.literal("isk"), z.literal("jep"), z.literal("jmd"), z.literal("jod"), z.literal("jpy"), z.literal("kes"), z.literal("kgs"), z.literal("khr"), z.literal("kmf"), z.literal("kpw"), z.literal("krw"), z.literal("kwd"), z.literal("kyd"), z.literal("kzt"), z.literal("lak"), z.literal("lbp"), z.literal("lkr"), z.literal("lrd"), z.literal("lsl"), z.literal("lyd"), z.literal("mad"), z.literal("mdl"), z.literal("mga"), z.literal("mkd"), z.literal("mmk"), z.literal("mnt"), z.literal("mop"), z.literal("mro"), z.literal("mru"), z.literal("mur"), z.literal("mvr"), z.literal("mwk"), z.literal("mxn"), z.literal("myr"), z.literal("mzn"), z.literal("nad"), z.literal("ngn"), z.literal("nio"), z.literal("nok"), z.literal("npr"), z.literal("nzd"), z.literal("omr"), z.literal("pab"), z.literal("pen"), z.literal("pgk"), z.literal("php"), z.literal("pkr"), z.literal("pln"), z.literal("pyg"), z.literal("qar"), z.literal("ron"), z.literal("rsd"), z.literal("rub"), z.literal("rwf"), z.literal("sar"), z.literal("sbd"), z.literal("scr"), z.literal("sdg"), z.literal("sek"), z.literal("sgd"), z.literal("shp"), z.literal("sll"), z.literal("sos"), z.literal("srd"), z.literal("ssp"), z.literal("std"), z.literal("stn"), z.literal("svc"), z.literal("syp"), z.literal("szl"), z.literal("thb"), z.literal("tjs"), z.literal("tmt"), z.literal("tnd"), z.literal("top"), z.literal("try"), z.literal("ttd"), z.literal("twd"), z.literal("tzs"), z.literal("uah"), z.literal("ugx"), z.literal("uyu"), z.literal("uzs"), z.literal("vef"), z.literal("vnd"), z.literal("vuv"), z.literal("wst"), z.literal("xaf"), z.literal("xag"), z.literal("xau"), z.literal("xcd"), z.literal("xdr"), z.literal("xof"), z.literal("xpd"), z.literal("xpf"), z.literal("xpt"), z.literal("yer"), z.literal("zar"), z.literal("zmw"), z.literal("zwl"), expressionSchema]).optional(), description: stringOrExpression.optional(), group: stringOrExpression.optional(), stage: stringOrExpression.optional(), owner: stringOrExpression.optional(), percent: numberOrExpression.optional(), status: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_update_note.schema.js
var require_operation_update_note_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/operation_update_note.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("updateNote"),
          dealId: numberOrExpression.optional(),
          dealNoteId: numberOrExpression.optional(),
          dealNote: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/index.schema.js
var require_index_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_deal/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema5();
    var getCreateNoteSchema = require_operation_create_note_schema();
    var getDeleteSchema = require_operation_delete_schema5();
    var getGetSchema = require_operation_get_schema4();
    var getGetAllSchema = require_operation_get_all_schema4();
    var getUpdateSchema = require_operation_update_schema5();
    var getUpdateNoteSchema = require_operation_update_note_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getCreateNoteSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateNoteSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/operation_create.schema.js
var require_operation_create_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceCustomer"),
          operation: z.literal("create").default("create"),
          connectionid: stringOrExpression.optional(),
          externalid: stringOrExpression.optional(),
          email: stringOrExpression.optional(),
          additionalFields: z.object({ acceptsMarketing: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/operation_delete.schema.js
var require_operation_delete_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceCustomer"),
          operation: z.literal("delete"),
          ecommerceCustomerId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/operation_get.schema.js
var require_operation_get_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceCustomer"),
          operation: z.literal("get"),
          ecommerceCustomerId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/operation_get_all.schema.js
var require_operation_get_all_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceCustomer"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/operation_update.schema.js
var require_operation_update_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceCustomer"),
          operation: z.literal("update"),
          ecommerceCustomerId: numberOrExpression.optional(),
          updateFields: z.object({ connectionid: stringOrExpression.optional(), externalid: stringOrExpression.optional(), email: stringOrExpression.optional(), acceptsMarketing: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/index.schema.js
var require_index_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_customer/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema6();
    var getDeleteSchema = require_operation_delete_schema6();
    var getGetSchema = require_operation_get_schema5();
    var getGetAllSchema = require_operation_get_all_schema5();
    var getUpdateSchema = require_operation_update_schema6();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/operation_create.schema.js
var require_operation_create_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceOrder"),
          operation: z.literal("create").default("create"),
          externalid: stringOrExpression.optional(),
          externalcheckoutid: stringOrExpression.optional(),
          source: numberOrExpression.optional(),
          email: stringOrExpression.optional(),
          totalPrice: numberOrExpression.optional(),
          currency: z.union([z.literal("eur"), z.literal("usd"), z.literal("gbp"), z.literal("chf"), z.literal("cny"), z.literal(""), z.literal("aed"), z.literal("afn"), z.literal("all"), z.literal("amd"), z.literal("ang"), z.literal("aoa"), z.literal("ars"), z.literal("aud"), z.literal("awg"), z.literal("azn"), z.literal("bam"), z.literal("bbd"), z.literal("bdt"), z.literal("bgn"), z.literal("bhd"), z.literal("bif"), z.literal("bmd"), z.literal("bnd"), z.literal("bob"), z.literal("brl"), z.literal("bsd"), z.literal("btc"), z.literal("btn"), z.literal("bwp"), z.literal("byn"), z.literal("bzd"), z.literal("cad"), z.literal("cdf"), z.literal("clf"), z.literal("clp"), z.literal("cnh"), z.literal("cop"), z.literal("crc"), z.literal("cuc"), z.literal("cup"), z.literal("cve"), z.literal("czk"), z.literal("djf"), z.literal("dkk"), z.literal("dop"), z.literal("dzd"), z.literal("egp"), z.literal("ern"), z.literal("etb"), z.literal("fjd"), z.literal("fkp"), z.literal("gel"), z.literal("ggp"), z.literal("ghs"), z.literal("gip"), z.literal("gmd"), z.literal("gnf"), z.literal("gtq"), z.literal("gyd"), z.literal("hkd"), z.literal("hnl"), z.literal("hrk"), z.literal("htg"), z.literal("huf"), z.literal("idr"), z.literal("ils"), z.literal("imp"), z.literal("inr"), z.literal("iqd"), z.literal("irr"), z.literal("isk"), z.literal("jep"), z.literal("jmd"), z.literal("jod"), z.literal("jpy"), z.literal("kes"), z.literal("kgs"), z.literal("khr"), z.literal("kmf"), z.literal("kpw"), z.literal("krw"), z.literal("kwd"), z.literal("kyd"), z.literal("kzt"), z.literal("lak"), z.literal("lbp"), z.literal("lkr"), z.literal("lrd"), z.literal("lsl"), z.literal("lyd"), z.literal("mad"), z.literal("mdl"), z.literal("mga"), z.literal("mkd"), z.literal("mmk"), z.literal("mnt"), z.literal("mop"), z.literal("mro"), z.literal("mru"), z.literal("mur"), z.literal("mvr"), z.literal("mwk"), z.literal("mxn"), z.literal("myr"), z.literal("mzn"), z.literal("nad"), z.literal("ngn"), z.literal("nio"), z.literal("nok"), z.literal("npr"), z.literal("nzd"), z.literal("omr"), z.literal("pab"), z.literal("pen"), z.literal("pgk"), z.literal("php"), z.literal("pkr"), z.literal("pln"), z.literal("pyg"), z.literal("qar"), z.literal("ron"), z.literal("rsd"), z.literal("rub"), z.literal("rwf"), z.literal("sar"), z.literal("sbd"), z.literal("scr"), z.literal("sdg"), z.literal("sek"), z.literal("sgd"), z.literal("shp"), z.literal("sll"), z.literal("sos"), z.literal("srd"), z.literal("ssp"), z.literal("std"), z.literal("stn"), z.literal("svc"), z.literal("syp"), z.literal("szl"), z.literal("thb"), z.literal("tjs"), z.literal("tmt"), z.literal("tnd"), z.literal("top"), z.literal("try"), z.literal("ttd"), z.literal("twd"), z.literal("tzs"), z.literal("uah"), z.literal("ugx"), z.literal("uyu"), z.literal("uzs"), z.literal("vef"), z.literal("vnd"), z.literal("vuv"), z.literal("wst"), z.literal("xaf"), z.literal("xag"), z.literal("xau"), z.literal("xcd"), z.literal("xdr"), z.literal("xof"), z.literal("xpd"), z.literal("xpf"), z.literal("xpt"), z.literal("yer"), z.literal("zar"), z.literal("zmw"), z.literal("zwl"), expressionSchema]).optional(),
          connectionid: numberOrExpression.optional(),
          customerid: numberOrExpression.optional(),
          externalCreatedDate: stringOrExpression.optional(),
          abandonedDate: stringOrExpression.optional(),
          orderProducts: z.object({ name: stringOrExpression.optional(), price: numberOrExpression.optional(), quantity: numberOrExpression.optional(), externalid: stringOrExpression.optional(), category: stringOrExpression.optional(), sku: stringOrExpression.optional(), description: stringOrExpression.optional(), imageUrl: stringOrExpression.optional(), productUrl: stringOrExpression.optional() }).optional(),
          additionalFields: z.object({ shippingAmount: numberOrExpression.optional(), taxAmount: numberOrExpression.optional(), discountAmount: numberOrExpression.optional(), orderUrl: stringOrExpression.optional(), externalUpdatedDate: stringOrExpression.optional(), shippingMethod: stringOrExpression.optional(), orderNumber: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/operation_delete.schema.js
var require_operation_delete_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceOrder"),
          operation: z.literal("delete"),
          orderId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/operation_get.schema.js
var require_operation_get_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceOrder"),
          operation: z.literal("get"),
          orderId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/operation_get_all.schema.js
var require_operation_get_all_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceOrder"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/operation_update.schema.js
var require_operation_update_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceOrder"),
          operation: z.literal("update"),
          orderId: numberOrExpression.optional(),
          updateFields: z.object({ externalid: stringOrExpression.optional(), externalcheckoutid: stringOrExpression.optional(), source: numberOrExpression.optional(), email: stringOrExpression.optional(), totalPrice: numberOrExpression.optional(), currency: z.union([z.literal("eur"), z.literal("usd"), z.literal("gbp"), z.literal("chf"), z.literal("cny"), z.literal(""), z.literal("aed"), z.literal("afn"), z.literal("all"), z.literal("amd"), z.literal("ang"), z.literal("aoa"), z.literal("ars"), z.literal("aud"), z.literal("awg"), z.literal("azn"), z.literal("bam"), z.literal("bbd"), z.literal("bdt"), z.literal("bgn"), z.literal("bhd"), z.literal("bif"), z.literal("bmd"), z.literal("bnd"), z.literal("bob"), z.literal("brl"), z.literal("bsd"), z.literal("btc"), z.literal("btn"), z.literal("bwp"), z.literal("byn"), z.literal("bzd"), z.literal("cad"), z.literal("cdf"), z.literal("clf"), z.literal("clp"), z.literal("cnh"), z.literal("cop"), z.literal("crc"), z.literal("cuc"), z.literal("cup"), z.literal("cve"), z.literal("czk"), z.literal("djf"), z.literal("dkk"), z.literal("dop"), z.literal("dzd"), z.literal("egp"), z.literal("ern"), z.literal("etb"), z.literal("fjd"), z.literal("fkp"), z.literal("gel"), z.literal("ggp"), z.literal("ghs"), z.literal("gip"), z.literal("gmd"), z.literal("gnf"), z.literal("gtq"), z.literal("gyd"), z.literal("hkd"), z.literal("hnl"), z.literal("hrk"), z.literal("htg"), z.literal("huf"), z.literal("idr"), z.literal("ils"), z.literal("imp"), z.literal("inr"), z.literal("iqd"), z.literal("irr"), z.literal("isk"), z.literal("jep"), z.literal("jmd"), z.literal("jod"), z.literal("jpy"), z.literal("kes"), z.literal("kgs"), z.literal("khr"), z.literal("kmf"), z.literal("kpw"), z.literal("krw"), z.literal("kwd"), z.literal("kyd"), z.literal("kzt"), z.literal("lak"), z.literal("lbp"), z.literal("lkr"), z.literal("lrd"), z.literal("lsl"), z.literal("lyd"), z.literal("mad"), z.literal("mdl"), z.literal("mga"), z.literal("mkd"), z.literal("mmk"), z.literal("mnt"), z.literal("mop"), z.literal("mro"), z.literal("mru"), z.literal("mur"), z.literal("mvr"), z.literal("mwk"), z.literal("mxn"), z.literal("myr"), z.literal("mzn"), z.literal("nad"), z.literal("ngn"), z.literal("nio"), z.literal("nok"), z.literal("npr"), z.literal("nzd"), z.literal("omr"), z.literal("pab"), z.literal("pen"), z.literal("pgk"), z.literal("php"), z.literal("pkr"), z.literal("pln"), z.literal("pyg"), z.literal("qar"), z.literal("ron"), z.literal("rsd"), z.literal("rub"), z.literal("rwf"), z.literal("sar"), z.literal("sbd"), z.literal("scr"), z.literal("sdg"), z.literal("sek"), z.literal("sgd"), z.literal("shp"), z.literal("sll"), z.literal("sos"), z.literal("srd"), z.literal("ssp"), z.literal("std"), z.literal("stn"), z.literal("svc"), z.literal("syp"), z.literal("szl"), z.literal("thb"), z.literal("tjs"), z.literal("tmt"), z.literal("tnd"), z.literal("top"), z.literal("try"), z.literal("ttd"), z.literal("twd"), z.literal("tzs"), z.literal("uah"), z.literal("ugx"), z.literal("uyu"), z.literal("uzs"), z.literal("vef"), z.literal("vnd"), z.literal("vuv"), z.literal("wst"), z.literal("xaf"), z.literal("xag"), z.literal("xau"), z.literal("xcd"), z.literal("xdr"), z.literal("xof"), z.literal("xpd"), z.literal("xpf"), z.literal("xpt"), z.literal("yer"), z.literal("zar"), z.literal("zmw"), z.literal("zwl"), expressionSchema]).optional(), connectionid: numberOrExpression.optional(), customerid: numberOrExpression.optional(), externalupdatedDate: stringOrExpression.optional(), abandonedDate: stringOrExpression.optional(), shippingAmount: numberOrExpression.optional(), taxAmount: numberOrExpression.optional(), discountAmount: numberOrExpression.optional(), orderUrl: stringOrExpression.optional(), externalUpdatedDate: stringOrExpression.optional(), shippingMethod: stringOrExpression.optional(), orderNumber: stringOrExpression.optional(), orderProducts: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/index.schema.js
var require_index_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema7();
    var getDeleteSchema = require_operation_delete_schema7();
    var getGetSchema = require_operation_get_schema6();
    var getGetAllSchema = require_operation_get_all_schema6();
    var getUpdateSchema = require_operation_update_schema7();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order_products/operation_get_all.schema.js
var require_operation_get_all_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order_products/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceOrderProducts"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order_products/operation_get_by_order_id.schema.js
var require_operation_get_by_order_id_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order_products/operation_get_by_order_id.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceOrderProducts"),
          operation: z.literal("getByOrderId"),
          orderId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order_products/operation_get_by_product_id.schema.js
var require_operation_get_by_product_id_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order_products/operation_get_by_product_id.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ecommerceOrderProducts"),
          operation: z.literal("getByProductId"),
          procuctId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order_products/index.schema.js
var require_index_schema10 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_ecommerce_order_products/index.schema.js"(exports2, module2) {
    var getGetAllSchema = require_operation_get_all_schema7();
    var getGetByOrderIdSchema = require_operation_get_by_order_id_schema();
    var getGetByProductIdSchema = require_operation_get_by_product_id_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetByOrderIdSchema({ ...helpers, parameters: effectiveParams }),
        getGetByProductIdSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_list/operation_get_all.schema.js
var require_operation_get_all_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_list/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("list"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_list/index.schema.js
var require_index_schema11 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_list/index.schema.js"(exports2, module2) {
    var getGetAllSchema = require_operation_get_all_schema8();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getGetAllSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/operation_create.schema.js
var require_operation_create_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("tag"),
          operation: z.literal("create").default("create"),
          tagType: z.union([z.literal("contact"), z.literal("template"), expressionSchema]).optional(),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ description: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/operation_delete.schema.js
var require_operation_delete_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("tag"),
          operation: z.literal("delete"),
          tagId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/operation_get.schema.js
var require_operation_get_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("tag"),
          operation: z.literal("get"),
          tagId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/operation_get_all.schema.js
var require_operation_get_all_schema9 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("tag"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/operation_update.schema.js
var require_operation_update_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("tag"),
          operation: z.literal("update"),
          tagId: numberOrExpression.optional(),
          updateFields: z.object({ tag: stringOrExpression.optional(), description: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/index.schema.js
var require_index_schema12 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/resource_tag/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema8();
    var getDeleteSchema = require_operation_delete_schema8();
    var getGetSchema = require_operation_get_schema7();
    var getGetAllSchema = require_operation_get_all_schema9();
    var getUpdateSchema = require_operation_update_schema8();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/activeCampaign/v1/index.schema.js
var getAccountSchema = require_index_schema();
var getAccountContactSchema = require_index_schema2();
var getConnectionSchema = require_index_schema3();
var getContactSchema = require_index_schema4();
var getContactListSchema = require_index_schema5();
var getContactTagSchema = require_index_schema6();
var getDealSchema = require_index_schema7();
var getEcommerceCustomerSchema = require_index_schema8();
var getEcommerceOrderSchema = require_index_schema9();
var getEcommerceOrderProductsSchema = require_index_schema10();
var getListSchema = require_index_schema11();
var getTagSchema = require_index_schema12();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "contact" } : parameters;
  return z.union([
    getAccountSchema({ ...helpers, parameters: effectiveParams }),
    getAccountContactSchema({ ...helpers, parameters: effectiveParams }),
    getConnectionSchema({ ...helpers, parameters: effectiveParams }),
    getContactSchema({ ...helpers, parameters: effectiveParams }),
    getContactListSchema({ ...helpers, parameters: effectiveParams }),
    getContactTagSchema({ ...helpers, parameters: effectiveParams }),
    getDealSchema({ ...helpers, parameters: effectiveParams }),
    getEcommerceCustomerSchema({ ...helpers, parameters: effectiveParams }),
    getEcommerceOrderSchema({ ...helpers, parameters: effectiveParams }),
    getEcommerceOrderProductsSchema({ ...helpers, parameters: effectiveParams }),
    getListSchema({ ...helpers, parameters: effectiveParams }),
    getTagSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
