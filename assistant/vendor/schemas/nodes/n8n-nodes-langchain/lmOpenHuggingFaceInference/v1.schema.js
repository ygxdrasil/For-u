// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/lmOpenHuggingFaceInference/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    model: stringOrExpression.optional(),
    options: z.object({ endpointUrl: stringOrExpression.optional(), frequencyPenalty: numberOrExpression.optional(), maxTokens: numberOrExpression.optional(), presencePenalty: numberOrExpression.optional(), temperature: numberOrExpression.optional(), topK: numberOrExpression.optional(), topP: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
