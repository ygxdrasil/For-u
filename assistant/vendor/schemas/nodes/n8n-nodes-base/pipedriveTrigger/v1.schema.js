// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/pipedriveTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("apiToken"), z.literal("oAuth2"), expressionSchema]).optional(),
    incomingAuthentication: z.union([z.literal("basicAuth"), z.literal("none"), expressionSchema]).optional(),
    action: z.union([z.literal("added"), z.literal("*"), z.literal("deleted"), z.literal("merged"), z.literal("updated"), expressionSchema]).optional(),
    object: z.union([z.literal("activity"), z.literal("activityType"), z.literal("*"), z.literal("deal"), z.literal("note"), z.literal("organization"), z.literal("person"), z.literal("pipeline"), z.literal("product"), z.literal("stage"), z.literal("user"), expressionSchema]).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
