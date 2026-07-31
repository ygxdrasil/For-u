// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/grist/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("create"), z.literal("delete"), z.literal("getAll"), z.literal("update")]).optional(),
    docId: stringOrExpression.optional(),
    tableId: stringOrExpression.optional(),
    rowId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["delete", "update"] } }, defaults: { "operation": "getAll" } }),
    returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["getAll"] } }, defaults: { "operation": "getAll" } }),
    limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "operation": ["getAll"], "returnAll": [false] } }, defaults: { "operation": "getAll", "returnAll": false } }),
    additionalOptions: resolveSchema({ parameters, schema: z.object({ filter: z.unknown().optional(), sort: z.unknown().optional() }), required: false, displayOptions: { "show": { "operation": ["getAll"] } }, defaults: { "operation": "getAll" } }),
    dataToSend: resolveSchema({ parameters, schema: z.union([z.literal("autoMapInputs"), z.literal("defineInNode"), expressionSchema]), required: false, displayOptions: { "show": { "operation": ["create", "update"] } }, defaults: { "operation": "getAll" } }),
    inputsToIgnore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["create", "update"], "dataToSend": ["autoMapInputs"] } }, defaults: { "operation": "getAll", "dataToSend": "defineInNode" } }),
    fieldsToSend: resolveSchema({ parameters, schema: z.object({ properties: z.array(z.object({ fieldId: stringOrExpression.optional(), fieldValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "operation": ["create", "update"], "dataToSend": ["defineInNode"] } }, defaults: { "operation": "getAll", "dataToSend": "defineInNode" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
