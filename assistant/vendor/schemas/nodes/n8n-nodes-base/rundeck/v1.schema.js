// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/rundeck/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    resource: z.union([z.literal("job")]).optional(),
    operation: z.union([z.literal("execute"), z.literal("getMetadata")]).optional(),
    jobid: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["execute", "getMetadata"], "resource": ["job"] } }, defaults: { "operation": "execute", "resource": "job" } }),
    arguments: resolveSchema({ parameters, schema: z.object({ arguments: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "operation": ["execute"], "resource": ["job"] } }, defaults: { "operation": "execute", "resource": "job" } }),
    filter: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["execute"], "resource": ["job"] } }, defaults: { "operation": "execute", "resource": "job" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
