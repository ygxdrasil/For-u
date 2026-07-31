// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/textClassifier/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, languageModelInstanceSchema }) {
  const subnodesSchema = z.object({
    model: z.union([languageModelInstanceSchema, z.array(languageModelInstanceSchema)])
  }).strict();
  const parametersSchema = z.object({
    inputText: stringOrExpression,
    categories: z.object({ categories: z.array(z.object({ category: stringOrExpression.optional(), description: stringOrExpression.optional() })).optional() }).optional(),
    options: z.object({ multiClass: booleanOrExpression.optional(), fallback: z.union([z.literal("discard"), z.literal("other"), expressionSchema]).optional(), systemPromptTemplate: stringOrExpression.optional(), enableAutoFixing: booleanOrExpression.optional(), batching: z.object({ batchSize: numberOrExpression.optional(), delayBetweenBatches: numberOrExpression.optional() }).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional(),
    subnodes: subnodesSchema
  });
};
