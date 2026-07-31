// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/calendlyTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("oAuth2"), z.literal("apiKey"), expressionSchema]).optional(),
    scope: z.union([z.literal("organization"), z.literal("user"), expressionSchema]).optional(),
    events: z.array(z.union([z.literal("invitee.created"), z.literal("invitee.canceled")])).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
