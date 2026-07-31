var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("create").default("create"),
          useCustomSchema: z.boolean().optional(),
          schema: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "useCustomSchema": [true] } }, defaults: { "useCustomSchema": false } }),
          tableId: stringOrExpression.optional(),
          dataToSend: z.union([z.literal("autoMapInputData"), z.literal("defineBelow"), expressionSchema]).optional(),
          inputsToIgnore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataToSend": ["autoMapInputData"] } }, defaults: { "dataToSend": "defineBelow" } }),
          fieldsUi: resolveSchema({ parameters, schema: z.object({ fieldValues: z.array(z.object({ fieldId: stringOrExpression.optional(), fieldValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "dataToSend": ["defineBelow"] } }, defaults: { "dataToSend": "defineBelow" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("delete"),
          useCustomSchema: z.boolean().optional(),
          schema: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "useCustomSchema": [true] } }, defaults: { "useCustomSchema": false } }),
          tableId: stringOrExpression.optional(),
          filterType: z.union([z.literal("manual"), z.literal("string"), expressionSchema]).optional(),
          matchType: resolveSchema({ parameters, schema: z.union([z.literal("anyFilter"), z.literal("allFilters"), expressionSchema]), required: false, displayOptions: { "show": { "filterType": ["manual"] } }, defaults: { "filterType": "manual" } }),
          filters: resolveSchema({ parameters, schema: z.object({ conditions: z.array(z.object({ keyName: stringOrExpression.optional(), condition: z.union([z.literal("eq"), z.literal("fullText"), z.literal("gt"), z.literal("gte"), z.literal("ilike"), z.literal("is"), z.literal("lt"), z.literal("lte"), z.literal("like"), z.literal("neq"), expressionSchema]).optional(), searchFunction: z.union([z.literal("fts"), z.literal("plfts"), z.literal("phfts"), z.literal("wfts"), expressionSchema]).optional(), keyValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "filterType": ["manual"] } }, defaults: { "filterType": "manual" } }),
          filterString: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "filterType": ["string"] } }, defaults: { "filterType": "manual" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("get"),
          useCustomSchema: z.boolean().optional(),
          schema: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "useCustomSchema": [true] } }, defaults: { "useCustomSchema": false } }),
          tableId: stringOrExpression.optional(),
          filters: z.object({ conditions: z.array(z.object({ keyName: stringOrExpression.optional(), keyValue: stringOrExpression.optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("getAll"),
          useCustomSchema: z.boolean().optional(),
          schema: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "useCustomSchema": [true] } }, defaults: { "useCustomSchema": false } }),
          tableId: stringOrExpression.optional(),
          returnAll: z.boolean().optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filterType: z.union([z.literal("none"), z.literal("manual"), z.literal("string"), expressionSchema]).optional(),
          matchType: resolveSchema({ parameters, schema: z.union([z.literal("anyFilter"), z.literal("allFilters"), expressionSchema]), required: false, displayOptions: { "show": { "filterType": ["manual"] } }, defaults: { "filterType": "manual" } }),
          filters: resolveSchema({ parameters, schema: z.object({ conditions: z.array(z.object({ keyName: stringOrExpression.optional(), condition: z.union([z.literal("eq"), z.literal("fullText"), z.literal("gt"), z.literal("gte"), z.literal("ilike"), z.literal("is"), z.literal("lt"), z.literal("lte"), z.literal("like"), z.literal("neq"), expressionSchema]).optional(), searchFunction: z.union([z.literal("fts"), z.literal("plfts"), z.literal("phfts"), z.literal("wfts"), expressionSchema]).optional(), keyValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "filterType": ["manual"] } }, defaults: { "filterType": "manual" } }),
          filterString: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "filterType": ["string"] } }, defaults: { "filterType": "manual" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("row").default("row"),
          operation: z.literal("update"),
          useCustomSchema: z.boolean().optional(),
          schema: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "useCustomSchema": [true] } }, defaults: { "useCustomSchema": false } }),
          tableId: stringOrExpression.optional(),
          filterType: z.union([z.literal("manual"), z.literal("string"), expressionSchema]).optional(),
          matchType: resolveSchema({ parameters, schema: z.union([z.literal("anyFilter"), z.literal("allFilters"), expressionSchema]), required: false, displayOptions: { "show": { "filterType": ["manual"] } }, defaults: { "filterType": "manual" } }),
          filters: resolveSchema({ parameters, schema: z.object({ conditions: z.array(z.object({ keyName: stringOrExpression.optional(), condition: z.union([z.literal("eq"), z.literal("fullText"), z.literal("gt"), z.literal("gte"), z.literal("ilike"), z.literal("is"), z.literal("lt"), z.literal("lte"), z.literal("like"), z.literal("neq"), expressionSchema]).optional(), searchFunction: z.union([z.literal("fts"), z.literal("plfts"), z.literal("phfts"), z.literal("wfts"), expressionSchema]).optional(), keyValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "filterType": ["manual"] } }, defaults: { "filterType": "manual" } }),
          filterString: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "filterType": ["string"] } }, defaults: { "filterType": "manual" } }),
          dataToSend: z.union([z.literal("autoMapInputData"), z.literal("defineBelow"), expressionSchema]).optional(),
          inputsToIgnore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataToSend": ["autoMapInputData"] } }, defaults: { "dataToSend": "defineBelow" } }),
          fieldsUi: resolveSchema({ parameters, schema: z.object({ fieldValues: z.array(z.object({ fieldId: stringOrExpression.optional(), fieldValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "dataToSend": ["defineBelow"] } }, defaults: { "dataToSend": "defineBelow" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/resource_row/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/supabase/v1/index.schema.js
var getRowSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "row" } : parameters;
  return getRowSchema({ ...helpers, parameters: effectiveParams });
};
