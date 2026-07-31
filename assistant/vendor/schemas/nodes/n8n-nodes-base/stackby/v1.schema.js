// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/stackby/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("append"), z.literal("delete"), z.literal("list"), z.literal("read")]).optional(),
    stackId: stringOrExpression.optional(),
    table: stringOrExpression.optional(),
    id: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["read", "delete"] } }, defaults: { "operation": "append" } }),
    returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["list"] } }, defaults: { "operation": "append" } }),
    limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "operation": ["list"], "returnAll": [false] } }, defaults: { "operation": "append", "returnAll": true } }),
    additionalFields: resolveSchema({ parameters, schema: z.object({ view: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["list"] } }, defaults: { "operation": "append" } }),
    columns: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["append"] } }, defaults: { "operation": "append" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
