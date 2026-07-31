// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/modelSelector/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, languageModelInstanceSchema }) {
  const subnodesSchema = z.object({
    model: z.union([languageModelInstanceSchema, z.array(languageModelInstanceSchema)]).optional()
  }).strict();
  const parametersSchema = z.object({
    numberInputs: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10)]).optional(),
    rules: z.object({ rule: z.array(z.object({ modelIndex: stringOrExpression.optional(), conditions: filterValueSchema.optional() })).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional(),
    subnodes: subnodesSchema.optional()
  });
};
