// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/taigaTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    projectId: stringOrExpression.optional(),
    resources: z.array(z.union([z.literal("all"), z.literal("issue"), z.literal("milestone"), z.literal("task"), z.literal("userstory"), z.literal("wikipage")])).optional(),
    operations: z.array(z.union([z.literal("all"), z.literal("create"), z.literal("delete"), z.literal("change")])).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
