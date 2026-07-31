// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/chainRetrievalQa/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, languageModelInstanceSchema, retrieverInstanceSchema }) {
  const subnodesSchema = z.object({
    model: z.union([languageModelInstanceSchema, z.array(languageModelInstanceSchema)]),
    retriever: retrieverInstanceSchema
  }).strict();
  const parametersSchema = z.object({
    query: stringOrExpression.optional(),
    text: resolveSchema({ parameters, schema: stringOrExpression, required: true, displayOptions: { "show": { "promptType": ["define"] } } }),
    options: z.object({ systemPromptTemplate: stringOrExpression.optional(), batching: z.object({ batchSize: numberOrExpression.optional(), delayBetweenBatches: numberOrExpression.optional() }).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional(),
    subnodes: subnodesSchema
  });
};
