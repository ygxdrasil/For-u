// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/copperTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    resource: z.union([z.literal("company"), z.literal("lead"), z.literal("opportunity"), z.literal("person"), z.literal("project"), z.literal("task")]).optional(),
    event: z.union([z.literal("delete"), z.literal("new"), z.literal("update"), expressionSchema]).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
