// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/postmarkTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    events: z.array(z.union([z.literal("bounce"), z.literal("click"), z.literal("delivery"), z.literal("open"), z.literal("spamComplaint"), z.literal("subscriptionChange")])).optional(),
    firstOpen: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "events": ["open"] } }, defaults: { "events": [] } }),
    includeContent: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "events": ["bounce", "spamComplaint"] } }, defaults: { "events": [] } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
