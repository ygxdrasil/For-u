var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_batch_create.schema.js
var require_operation_batch_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_batch_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("batchCreate"),
          authentication: z.union([z.literal("usernamePassword"), z.literal("databaseToken"), expressionSchema]).optional(),
          databaseId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["databaseToken"] } }, defaults: { "authentication": "usernamePassword" } }),
          tableId: stringOrExpression.optional(),
          dataToSend: z.union([z.literal("autoMapInputData"), z.literal("defineBelow"), expressionSchema]).optional(),
          inputsToIgnore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataToSend": ["autoMapInputData"] } }, defaults: { "dataToSend": "defineBelow" } }),
          rowsUi: resolveSchema({ parameters, schema: z.object({ rowValues: z.array(z.object({ id: stringOrExpression.optional(), fieldsUi: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "dataToSend": ["defineBelow"] } }, defaults: { "dataToSend": "defineBelow" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_batch_delete.schema.js
var require_operation_batch_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_batch_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("batchDelete"),
          authentication: z.union([z.literal("usernamePassword"), z.literal("databaseToken"), expressionSchema]).optional(),
          databaseId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["databaseToken"] } }, defaults: { "authentication": "usernamePassword" } }),
          tableId: stringOrExpression.optional(),
          dataToSend: z.union([z.literal("autoMapInputData"), z.literal("defineBelow"), expressionSchema]).optional(),
          rowIds: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataToSend": ["defineBelow"] } }, defaults: { "dataToSend": "defineBelow" } }),
          rowIdProperty: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataToSend": ["autoMapInputData"] } }, defaults: { "dataToSend": "defineBelow" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_batch_update.schema.js
var require_operation_batch_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_batch_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("batchUpdate"),
          authentication: z.union([z.literal("usernamePassword"), z.literal("databaseToken"), expressionSchema]).optional(),
          databaseId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["databaseToken"] } }, defaults: { "authentication": "usernamePassword" } }),
          tableId: stringOrExpression.optional(),
          dataToSend: z.union([z.literal("autoMapInputData"), z.literal("defineBelow"), expressionSchema]).optional(),
          inputsToIgnore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataToSend": ["autoMapInputData"] } }, defaults: { "dataToSend": "defineBelow" } }),
          rowsUi: resolveSchema({ parameters, schema: z.object({ rowValues: z.array(z.object({ id: stringOrExpression.optional(), fieldsUi: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "dataToSend": ["defineBelow"] } }, defaults: { "dataToSend": "defineBelow" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("usernamePassword"), z.literal("databaseToken"), expressionSchema]).optional(),
          databaseId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["databaseToken"] } }, defaults: { "authentication": "usernamePassword" } }),
          tableId: stringOrExpression.optional(),
          dataToSend: z.union([z.literal("autoMapInputData"), z.literal("defineBelow"), expressionSchema]).optional(),
          inputsToIgnore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataToSend": ["autoMapInputData"] } }, defaults: { "dataToSend": "defineBelow" } }),
          fieldsUi: resolveSchema({ parameters, schema: z.object({ fieldValues: z.array(z.object({ fieldId: stringOrExpression.optional(), fieldValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "dataToSend": ["defineBelow"] } }, defaults: { "dataToSend": "defineBelow" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("usernamePassword"), z.literal("databaseToken"), expressionSchema]).optional(),
          databaseId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["databaseToken"] } }, defaults: { "authentication": "usernamePassword" } }),
          tableId: stringOrExpression.optional(),
          rowId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("usernamePassword"), z.literal("databaseToken"), expressionSchema]).optional(),
          databaseId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["databaseToken"] } }, defaults: { "authentication": "usernamePassword" } }),
          tableId: stringOrExpression.optional(),
          rowId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("getAll").default("getAll"),
          authentication: z.union([z.literal("usernamePassword"), z.literal("databaseToken"), expressionSchema]).optional(),
          databaseId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["databaseToken"] } }, defaults: { "authentication": "usernamePassword" } }),
          tableId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          additionalOptions: z.object({ filters: z.unknown().optional(), filterType: z.union([z.literal("AND"), z.literal("OR"), expressionSchema]).optional(), search: stringOrExpression.optional(), order: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("usernamePassword"), z.literal("databaseToken"), expressionSchema]).optional(),
          databaseId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["databaseToken"] } }, defaults: { "authentication": "usernamePassword" } }),
          tableId: stringOrExpression.optional(),
          rowId: stringOrExpression.optional(),
          dataToSend: z.union([z.literal("autoMapInputData"), z.literal("defineBelow"), expressionSchema]).optional(),
          inputsToIgnore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataToSend": ["autoMapInputData"] } }, defaults: { "dataToSend": "defineBelow" } }),
          fieldsUi: resolveSchema({ parameters, schema: z.object({ fieldValues: z.array(z.object({ fieldId: stringOrExpression.optional(), fieldValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "dataToSend": ["defineBelow"] } }, defaults: { "dataToSend": "defineBelow" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/resource_row/index.schema.js"(exports2, module2) {
    var getBatchCreateSchema = require_operation_batch_create_schema();
    var getBatchDeleteSchema = require_operation_batch_delete_schema();
    var getBatchUpdateSchema = require_operation_batch_update_schema();
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getAll" } : parameters;
      return z.union([
        getBatchCreateSchema({ ...helpers, parameters: effectiveParams }),
        getBatchDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getBatchUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/baserow/v11/index.schema.js
var getRowSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "row" } : parameters;
  return getRowSchema({ ...helpers, parameters: effectiveParams });
};
