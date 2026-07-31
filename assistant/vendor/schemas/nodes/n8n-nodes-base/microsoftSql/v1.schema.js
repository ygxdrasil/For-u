// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftSql/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("executeQuery"), z.literal("insert"), z.literal("update"), z.literal("delete")]).optional(),
    query: resolveSchema({ parameters, schema: z.string(), required: false, displayOptions: { "show": { "operation": ["executeQuery"] } }, defaults: { "operation": "insert" } }),
    options: resolveSchema({ parameters, schema: z.object({ queryReplacement: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["executeQuery"] } }, defaults: { "operation": "insert" } }),
    table: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["insert", "update", "delete"] } }, defaults: { "operation": "insert" } }),
    columns: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["insert", "update"] } }, defaults: { "operation": "insert" } }),
    updateKey: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["update"] } }, defaults: { "operation": "insert" } }),
    deleteKey: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["delete"] } }, defaults: { "operation": "insert" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
