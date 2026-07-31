// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/stravaTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    object: z.union([z.literal("*"), z.literal("activity"), z.literal("athlete"), expressionSchema]).optional(),
    event: z.union([z.literal("*"), z.literal("create"), z.literal("delete"), z.literal("update"), expressionSchema]).optional(),
    resolveData: booleanOrExpression.optional(),
    options: z.object({ deleteIfExist: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
