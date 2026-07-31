// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/emeliaTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    campaignId: stringOrExpression.optional(),
    events: z.array(z.union([z.literal("bounced"), z.literal("opened"), z.literal("replied"), z.literal("sent"), z.literal("clicked"), z.literal("unsubscribed")])).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
