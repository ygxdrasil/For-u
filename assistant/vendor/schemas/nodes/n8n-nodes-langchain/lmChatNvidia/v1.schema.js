// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/lmChatNvidia/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas }) {
  const parametersSchema = z.object({
    model: z.union([z.literal("nvidia/llama-3.1-nemotron-nano-8b-v1"), z.literal("nvidia/llama-3.3-nemotron-super-49b-v1"), z.literal("nvidia/llama-3.3-nemotron-super-49b-v1.5"), z.literal("nvidia/nemotron-3-nano-30b-a3b"), z.literal("nvidia/nemotron-3-nano-omni-30b-a3b-reasoning"), z.literal("nvidia/nemotron-3-super-120b-a12b"), z.literal("nvidia/nemotron-nano-12b-v2-vl"), z.literal("nvidia/nvidia-nemotron-nano-9b-v2"), expressionSchema]).optional(),
    options: z.object({ frequencyPenalty: numberOrExpression.optional(), maxTokens: numberOrExpression.optional(), responseFormat: z.union([z.literal("text"), z.literal("json_object"), expressionSchema]).optional(), presencePenalty: numberOrExpression.optional(), temperature: numberOrExpression.optional(), timeout: numberOrExpression.optional(), maxRetries: numberOrExpression.optional(), topP: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
