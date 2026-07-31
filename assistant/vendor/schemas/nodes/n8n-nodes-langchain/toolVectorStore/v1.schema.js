// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/toolVectorStore/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, vectorStoreInstanceSchema, languageModelInstanceSchema }) {
  const subnodesSchema = z.object({
    vectorStore: vectorStoreInstanceSchema,
    model: z.union([languageModelInstanceSchema, z.array(languageModelInstanceSchema)])
  }).strict();
  const parametersSchema = z.object({
    name: stringOrExpression.optional(),
    description: stringOrExpression.optional(),
    topK: numberOrExpression.optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional(),
    subnodes: subnodesSchema
  });
};
