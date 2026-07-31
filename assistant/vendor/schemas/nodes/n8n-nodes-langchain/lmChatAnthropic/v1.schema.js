// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/lmChatAnthropic/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    model: z.union([z.literal("claude-3-5-sonnet-20241022"), z.literal("claude-3-opus-20240229"), z.literal("claude-3-5-sonnet-20240620"), z.literal("claude-3-sonnet-20240229"), z.literal("claude-3-5-haiku-20241022"), z.literal("claude-3-haiku-20240307"), z.literal("claude-2"), z.literal("claude-2.1"), z.literal("claude-instant-1.2"), z.literal("claude-instant-1"), expressionSchema]).optional(),
    options: z.object({ maxTokensToSample: numberOrExpression.optional(), temperature: numberOrExpression.optional(), topK: numberOrExpression.optional(), topP: numberOrExpression.optional(), thinking: booleanOrExpression.optional(), thinkingBudget: numberOrExpression.optional(), thinkingMode: z.union([z.literal("disabled"), z.literal("adaptive"), z.literal("manual"), expressionSchema]).optional(), effort: z.union([z.union([z.literal("low"), z.literal("medium"), z.literal("high"), z.literal("xhigh"), z.literal("max"), expressionSchema]), z.union([z.literal("low"), z.literal("medium"), z.literal("high"), expressionSchema])]).optional(), streaming: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
