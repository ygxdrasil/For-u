// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/lmOllama/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    model: stringOrExpression.optional(),
    options: z.object({ think: booleanOrExpression.optional(), temperature: numberOrExpression.optional(), topK: numberOrExpression.optional(), topP: numberOrExpression.optional(), frequencyPenalty: numberOrExpression.optional(), keepAlive: stringOrExpression.optional(), lowVram: booleanOrExpression.optional(), mainGpu: numberOrExpression.optional(), numBatch: numberOrExpression.optional(), numCtx: numberOrExpression.optional(), numGpu: numberOrExpression.optional(), numPredict: numberOrExpression.optional(), numThread: numberOrExpression.optional(), penalizeNewline: booleanOrExpression.optional(), presencePenalty: numberOrExpression.optional(), repeatPenalty: numberOrExpression.optional(), useMLock: booleanOrExpression.optional(), useMMap: booleanOrExpression.optional(), vocabOnly: booleanOrExpression.optional(), format: z.union([z.literal("default"), z.literal("json"), expressionSchema]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
