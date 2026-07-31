var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsDynamoDb/v1/resource_item/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsDynamoDb/v1/resource_item/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("item").default("item"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
          tableName: stringOrExpression.optional(),
          returnValues: z.union([z.literal("ALL_OLD"), z.literal("NONE"), expressionSchema]).optional(),
          keysUi: z.object({ keyValues: z.array(z.object({ key: stringOrExpression.optional(), type: z.union([z.literal("B"), z.literal("N"), z.literal("S"), expressionSchema]).optional(), value: stringOrExpression.optional() })).optional() }).optional(),
          simple: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "returnValues": ["ALL_OLD"] } }, defaults: { "returnValues": "NONE" } }),
          additionalFields: z.object({ conditionExpression: stringOrExpression.optional(), eanUi: z.unknown().optional(), expressionAttributeUi: z.unknown().optional() }).optional(),
          filterExpression: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "scan": [true] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsDynamoDb/v1/resource_item/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsDynamoDb/v1/resource_item/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("item").default("item"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
          tableName: stringOrExpression.optional(),
          select: z.union([z.literal("ALL_ATTRIBUTES"), z.literal("ALL_PROJECTED_ATTRIBUTES"), z.literal("SPECIFIC_ATTRIBUTES"), expressionSchema]).optional(),
          simple: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "select": ["ALL_PROJECTED_ATTRIBUTES", "ALL_ATTRIBUTES"] } }, defaults: { "select": "ALL_ATTRIBUTES" } }),
          keysUi: z.object({ keyValues: z.array(z.object({ key: stringOrExpression.optional(), type: z.union([z.literal("B"), z.literal("N"), z.literal("S"), expressionSchema]).optional(), value: stringOrExpression.optional() })).optional() }).optional(),
          additionalFields: z.object({ projectionExpression: stringOrExpression.optional(), eanUi: z.unknown().optional(), readType: z.union([z.literal("stronglyConsistentRead"), z.literal("eventuallyConsistentRead"), expressionSchema]).optional() }).optional(),
          filterExpression: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "scan": [true] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsDynamoDb/v1/resource_item/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsDynamoDb/v1/resource_item/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("item").default("item"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
          tableName: stringOrExpression.optional(),
          scan: booleanOrExpression.optional(),
          filterExpression: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "scan": [true] } }, defaults: { "scan": false } }),
          keyConditionExpression: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "scan": [false] } }, defaults: { "scan": false } }),
          eavUi: z.object({ eavValues: z.array(z.object({ attribute: stringOrExpression.optional(), type: z.union([z.literal("N"), z.literal("S"), expressionSchema]).optional(), value: stringOrExpression.optional() })).optional() }).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          select: z.union([z.literal("ALL_ATTRIBUTES"), z.literal("ALL_PROJECTED_ATTRIBUTES"), z.literal("COUNT"), z.literal("SPECIFIC_ATTRIBUTES"), expressionSchema]).optional(),
          simple: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "select": ["ALL_PROJECTED_ATTRIBUTES", "ALL_ATTRIBUTES", "SPECIFIC_ATTRIBUTES"] } }, defaults: { "select": "ALL_ATTRIBUTES" } }),
          options: z.object({ indexName: stringOrExpression.optional(), projectionExpression: stringOrExpression.optional(), filterExpression: stringOrExpression.optional(), eanUi: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsDynamoDb/v1/resource_item/operation_upsert.schema.js
var require_operation_upsert_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsDynamoDb/v1/resource_item/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("item").default("item"),
          operation: z.literal("upsert").default("upsert"),
          authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
          tableName: stringOrExpression.optional(),
          dataToSend: z.union([z.literal("autoMapInputData"), z.literal("defineBelow"), expressionSchema]).optional(),
          inputsToIgnore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataToSend": ["autoMapInputData"] } }, defaults: { "dataToSend": "defineBelow" } }),
          fieldsUi: resolveSchema({ parameters, schema: z.object({ fieldValues: z.array(z.object({ fieldId: stringOrExpression.optional(), fieldValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "dataToSend": ["defineBelow"] } }, defaults: { "dataToSend": "defineBelow" } }),
          additionalFields: z.object({ eavUi: z.unknown().optional(), conditionExpression: stringOrExpression.optional(), eanUi: z.unknown().optional() }).optional(),
          filterExpression: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "scan": [true] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsDynamoDb/v1/resource_item/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsDynamoDb/v1/resource_item/index.schema.js"(exports2, module2) {
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpsertSchema = require_operation_upsert_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "upsert" } : parameters;
      return z.union([
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsDynamoDb/v1/index.schema.js
var getItemSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "item" } : parameters;
  return getItemSchema({ ...helpers, parameters: effectiveParams });
};
