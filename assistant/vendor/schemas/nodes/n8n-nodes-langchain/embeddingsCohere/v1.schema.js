// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/embeddingsCohere/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    modelName: z.union([z.literal("embed-english-light-v2.0"), z.literal("embed-english-light-v3.0"), z.literal("embed-english-v2.0"), z.literal("embed-english-v3.0"), z.literal("embed-multilingual-light-v3.0"), z.literal("embed-multilingual-v2.0"), z.literal("embed-multilingual-v3.0"), expressionSchema]).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
