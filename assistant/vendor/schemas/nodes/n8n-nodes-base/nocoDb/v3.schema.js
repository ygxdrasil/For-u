var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("nocoDbApiToken"), z.literal("nocoDb"), expressionSchema]).optional(),
          version: z.union([z.literal(1), z.literal(2), z.literal(3), expressionSchema]).optional(),
          workspaceId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [3] } }, defaults: { "version": 3 } }),
          projectId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [3, 1, 2] } }, defaults: { "version": 3 } }),
          table: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [2, 3, 1] } }, defaults: { "version": 3 } }),
          dataToSend: z.union([z.literal("autoMapInputData"), z.literal("defineBelow"), expressionSchema]).optional(),
          inputsToIgnore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataToSend": ["autoMapInputData"] } }, defaults: { "dataToSend": "defineBelow" } }),
          fieldsUi: resolveSchema({ parameters, schema: z.object({ fieldValues: z.array(z.object({ fieldName: stringOrExpression.optional(), binaryData: booleanOrExpression.optional(), fieldValue: stringOrExpression.optional(), binaryProperty: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "dataToSend": ["defineBelow"] } }, defaults: { "dataToSend": "defineBelow" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("nocoDbApiToken"), z.literal("nocoDb"), expressionSchema]).optional(),
          version: z.union([z.literal(1), z.literal(2), z.literal(3), expressionSchema]).optional(),
          workspaceId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [3] } }, defaults: { "version": 3 } }),
          projectId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [3, 1, 2] } }, defaults: { "version": 3 } }),
          table: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [2, 3, 1] } }, defaults: { "version": 3 } }),
          primaryKey: resolveSchema({ parameters, schema: z.union([z.literal("id"), z.literal("ncRecordId"), z.literal("custom"), expressionSchema]), required: false, displayOptions: { "show": { "version": [1, 2, 3] } }, defaults: { "version": 3 } }),
          customPrimaryKey: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [1, 2, 3], "primaryKey": ["custom"] } }, defaults: { "version": 3, "primaryKey": "id" } }),
          id: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [1, 2, 3] } }, defaults: { "version": 3 } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("get").default("get"),
          authentication: z.union([z.literal("nocoDbApiToken"), z.literal("nocoDb"), expressionSchema]).optional(),
          version: z.union([z.literal(1), z.literal(2), z.literal(3), expressionSchema]).optional(),
          workspaceId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [3] } }, defaults: { "version": 3 } }),
          projectId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [3, 1, 2] } }, defaults: { "version": 3 } }),
          table: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [2, 3, 1] } }, defaults: { "version": 3 } }),
          id: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [1, 2, 3] } }, defaults: { "version": 3 } }),
          downloadAttachments: booleanOrExpression.optional(),
          downloadFieldNames: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "downloadAttachments": [true] } }, defaults: { "downloadAttachments": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("nocoDbApiToken"), z.literal("nocoDb"), expressionSchema]).optional(),
          version: z.union([z.literal(1), z.literal(2), z.literal(3), expressionSchema]).optional(),
          workspaceId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [3] } }, defaults: { "version": 3 } }),
          projectId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [3, 1, 2] } }, defaults: { "version": 3 } }),
          table: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [2, 3, 1] } }, defaults: { "version": 3 } }),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          downloadAttachments: booleanOrExpression.optional(),
          downloadFieldNames: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "downloadAttachments": [true] } }, defaults: { "downloadAttachments": false } }),
          options: z.object({ viewId: stringOrExpression.optional(), fields: stringOrExpression.optional(), sort: z.unknown().optional(), where: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("nocoDbApiToken"), z.literal("nocoDb"), expressionSchema]).optional(),
          version: z.union([z.literal(1), z.literal(2), z.literal(3), expressionSchema]).optional(),
          workspaceId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [3] } }, defaults: { "version": 3 } }),
          projectId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [3, 1, 2] } }, defaults: { "version": 3 } }),
          table: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [2, 3, 1] } }, defaults: { "version": 3 } }),
          primaryKey: resolveSchema({ parameters, schema: z.union([z.literal("id"), z.literal("ncRecordId"), z.literal("custom"), expressionSchema]), required: false, displayOptions: { "show": { "version": [1, 2, 3] } }, defaults: { "version": 3 } }),
          customPrimaryKey: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [1, 2, 3], "primaryKey": ["custom"] } }, defaults: { "version": 3, "primaryKey": "id" } }),
          id: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "version": [1, 2, 3] } }, defaults: { "version": 3 } }),
          dataToSend: z.union([z.literal("autoMapInputData"), z.literal("defineBelow"), expressionSchema]).optional(),
          inputsToIgnore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataToSend": ["autoMapInputData"] } }, defaults: { "dataToSend": "defineBelow" } }),
          fieldsUi: resolveSchema({ parameters, schema: z.object({ fieldValues: z.array(z.object({ fieldName: stringOrExpression.optional(), binaryData: booleanOrExpression.optional(), fieldValue: stringOrExpression.optional(), binaryProperty: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "dataToSend": ["defineBelow"] } }, defaults: { "dataToSend": "defineBelow" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/resource_row/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/nocoDb/v3/index.schema.js
var getRowSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "row" } : parameters;
  return getRowSchema({ ...helpers, parameters: effectiveParams });
};
