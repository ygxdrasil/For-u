// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/lmChatGoogleVertex/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    projectId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
    modelName: stringOrExpression.optional(),
    location: z.union([z.literal(""), z.literal("global"), z.literal("eu"), z.literal("us"), expressionSchema]).optional(),
    options: z.object({ maxOutputTokens: numberOrExpression.optional(), temperature: numberOrExpression.optional(), topK: numberOrExpression.optional(), topP: numberOrExpression.optional(), safetySettings: z.object({ values: z.array(z.object({ category: z.union([z.literal("HARM_CATEGORY_HARASSMENT"), z.literal("HARM_CATEGORY_HATE_SPEECH"), z.literal("HARM_CATEGORY_SEXUALLY_EXPLICIT"), z.literal("HARM_CATEGORY_DANGEROUS_CONTENT"), expressionSchema]).optional(), threshold: z.union([z.literal("HARM_BLOCK_THRESHOLD_UNSPECIFIED"), z.literal("BLOCK_LOW_AND_ABOVE"), z.literal("BLOCK_MEDIUM_AND_ABOVE"), z.literal("BLOCK_ONLY_HIGH"), z.literal("BLOCK_NONE"), expressionSchema]).optional() })).optional() }).optional(), thinkingBudget: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
