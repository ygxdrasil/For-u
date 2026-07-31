// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/chainSummarization/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, languageModelInstanceSchema, documentLoaderInstanceSchema }) {
  const subnodesSchema = z.object({
    model: z.union([languageModelInstanceSchema, z.array(languageModelInstanceSchema)]).optional(),
    documentLoader: z.union([documentLoaderInstanceSchema, z.array(documentLoaderInstanceSchema)]).optional()
  }).strict();
  const parametersSchema = z.object({
    type: z.union([z.literal("map_reduce"), z.literal("refine"), z.literal("stuff"), expressionSchema]).optional(),
    options: z.object({ combineMapPrompt: stringOrExpression.optional(), prompt: stringOrExpression.optional(), refinePrompt: stringOrExpression.optional(), refineQuestionPrompt: stringOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional(),
    subnodes: subnodesSchema.optional()
  });
};
