// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlabTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
    owner: stringOrExpression.optional(),
    repository: stringOrExpression.optional(),
    events: z.array(z.union([z.literal("note"), z.literal("confidential_issues"), z.literal("confidential_note"), z.literal("deployment"), z.literal("issues"), z.literal("job"), z.literal("merge_requests"), z.literal("pipeline"), z.literal("push"), z.literal("releases"), z.literal("tag_push"), z.literal("wiki_page"), z.literal("*")])).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
