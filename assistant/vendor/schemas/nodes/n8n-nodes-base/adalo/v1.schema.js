// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/adalo/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    resource: z.union([z.literal("collection")]).optional(),
    operation: z.union([z.literal("create"), z.literal("delete"), z.literal("get"), z.literal("getAll"), z.literal("update")]).optional(),
    collectionId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "resource": ["collection"] } }, defaults: { "resource": "collection" } }),
    rowId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["get", "delete", "update"], "resource": ["collection"] } }, defaults: { "operation": "getAll", "resource": "collection" } }),
    dataToSend: resolveSchema({ parameters, schema: z.union([z.literal("autoMapInputData"), z.literal("defineBelow"), expressionSchema]), required: false, displayOptions: { "show": { "operation": ["create", "update"], "resource": ["collection"] } }, defaults: { "operation": "getAll", "resource": "collection" } }),
    inputsToIgnore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["create", "update"], "dataToSend": ["autoMapInputData"], "resource": ["collection"] } }, defaults: { "operation": "getAll", "dataToSend": "defineBelow", "resource": "collection" } }),
    fieldsUi: resolveSchema({ parameters, schema: z.object({ fieldValues: z.array(z.object({ fieldId: stringOrExpression.optional(), fieldValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "operation": ["create", "update"], "dataToSend": ["defineBelow"], "resource": ["collection"] } }, defaults: { "operation": "getAll", "dataToSend": "defineBelow", "resource": "collection" } }),
    returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["getAll"], "resource": ["collection"] } }, defaults: { "operation": "getAll", "resource": "collection" } }),
    limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "operation": ["getAll"], "resource": ["collection"], "returnAll": [false] } }, defaults: { "operation": "getAll", "resource": "collection", "returnAll": false } }),
    requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
