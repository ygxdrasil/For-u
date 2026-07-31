// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/lmChatMinimax/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    model: z.union([z.literal("MiniMax-M2"), z.literal("MiniMax-M2.1"), z.literal("MiniMax-M2.1-highspeed"), z.literal("MiniMax-M2.5"), z.literal("MiniMax-M2.5-highspeed"), z.literal("MiniMax-M2.7"), z.literal("MiniMax-M2.7-highspeed"), expressionSchema]).optional(),
    options: z.object({ hideThinking: booleanOrExpression.optional(), maxTokens: numberOrExpression.optional(), temperature: numberOrExpression.optional(), timeout: numberOrExpression.optional(), maxRetries: numberOrExpression.optional(), topP: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
