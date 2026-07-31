// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/embeddingsHuggingFaceInference/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    modelName: stringOrExpression.optional(),
    options: z.object({ endpointUrl: stringOrExpression.optional(), provider: z.union([z.literal("black-forest-labs"), z.literal("cerebras"), z.literal("cohere"), z.literal("fal-ai"), z.literal("featherless-ai"), z.literal("fireworks-ai"), z.literal("groq"), z.literal("hf-inference"), z.literal("hyperbolic"), z.literal("nebius"), z.literal("novita"), z.literal("nscale"), z.literal("openai"), z.literal("ovhcloud"), z.literal("replicate"), z.literal("sambanova"), z.literal("together"), z.literal("auto"), expressionSchema]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
