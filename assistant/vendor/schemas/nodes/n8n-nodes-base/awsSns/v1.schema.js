// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsSns/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
    operation: z.union([z.literal("create"), z.literal("delete"), z.literal("publish")]).optional(),
    name: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["create"] } }, defaults: { "operation": "publish" } }),
    options: resolveSchema({ parameters, schema: z.object({ displayName: stringOrExpression.optional(), fifoTopic: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["create"] } }, defaults: { "operation": "publish" } }),
    topic: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "operation": ["publish", "delete"] } }, defaults: { "operation": "publish" } }),
    subject: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["publish"] } }, defaults: { "operation": "publish" } }),
    message: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["publish"] } }, defaults: { "operation": "publish" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
