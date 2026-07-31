// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailchimpTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("apiKey"), z.literal("oAuth2"), expressionSchema]).optional(),
    list: stringOrExpression.optional(),
    events: z.array(z.union([z.literal("campaign"), z.literal("cleaned"), z.literal("upemail"), z.literal("profile"), z.literal("subscribe"), z.literal("unsubscribe")])).optional(),
    sources: z.array(z.union([z.literal("user"), z.literal("admin"), z.literal("api")])).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
