// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/linearTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("apiToken"), z.literal("oAuth2"), expressionSchema]).optional(),
    teamId: stringOrExpression.optional(),
    resources: z.array(z.union([z.literal("reaction"), z.literal("cycle"), z.literal("issue"), z.literal("comment"), z.literal("issueLabel"), z.literal("project")])).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
