// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/embeddingsOpenAi/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    model: stringOrExpression.optional(),
    options: z.object({ dimensions: z.union([z.literal(256), z.literal(512), z.literal(1024), z.literal(1536), z.literal(3072), expressionSchema]).optional(), baseURL: stringOrExpression.optional(), batchSize: numberOrExpression.optional(), stripNewLines: booleanOrExpression.optional(), timeout: numberOrExpression.optional(), encodingFormat: z.union([z.literal("float"), z.literal("base64"), expressionSchema]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
