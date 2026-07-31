// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsLambda/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
    operation: z.union([z.literal("invoke")]).optional(),
    "function": resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["invoke"] } }, defaults: { "operation": "invoke" } }),
    qualifier: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["invoke"] } }, defaults: { "operation": "invoke" } }),
    invocationType: resolveSchema({ parameters, schema: z.union([z.literal("RequestResponse"), z.literal("Event"), expressionSchema]), required: false, displayOptions: { "show": { "operation": ["invoke"] } }, defaults: { "operation": "invoke" } }),
    payload: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["invoke"] } }, defaults: { "operation": "invoke" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
