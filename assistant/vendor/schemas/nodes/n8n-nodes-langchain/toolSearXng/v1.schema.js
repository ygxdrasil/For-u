// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/toolSearXng/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    options: z.object({ numResults: numberOrExpression.optional(), pageNumber: numberOrExpression.optional(), language: stringOrExpression.optional(), safesearch: z.union([z.literal(0), z.literal(1), z.literal(2), expressionSchema]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
