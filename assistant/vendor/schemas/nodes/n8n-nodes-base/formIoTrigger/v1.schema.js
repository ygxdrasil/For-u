// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/formIoTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    projectId: stringOrExpression.optional(),
    formId: stringOrExpression.optional(),
    events: z.array(z.union([z.literal("create"), z.literal("update")])).optional(),
    simple: booleanOrExpression.optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
