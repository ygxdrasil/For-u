// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/rerankerCohere/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    modelName: z.union([z.literal("rerank-v3.5"), z.literal("rerank-english-v3.0"), z.literal("rerank-multilingual-v3.0"), expressionSchema]).optional(),
    topN: numberOrExpression.optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
