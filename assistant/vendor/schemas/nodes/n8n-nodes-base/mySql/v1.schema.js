// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mySql/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("executeQuery"), z.literal("insert"), z.literal("update")]).optional(),
    query: resolveSchema({ parameters, schema: z.string(), required: false, displayOptions: { "show": { "operation": ["executeQuery"] } }, defaults: { "operation": "insert" } }),
    table: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "operation": ["insert", "update"] } }, defaults: { "operation": "insert" } }),
    columns: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["insert", "update"] } }, defaults: { "operation": "insert" } }),
    options: resolveSchema({ parameters, schema: z.object({ ignore: booleanOrExpression.optional(), priority: z.union([z.literal("LOW_PRIORITY"), z.literal("HIGH_PRIORITY"), expressionSchema]).optional() }), required: false, displayOptions: { "show": { "operation": ["insert"] } }, defaults: { "operation": "insert" } }),
    updateKey: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["update"] } }, defaults: { "operation": "insert" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
