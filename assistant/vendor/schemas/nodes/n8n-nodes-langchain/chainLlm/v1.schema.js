// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/chainLlm/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, languageModelInstanceSchema, outputParserInstanceSchema }) {
  function getSubnodesSchema() {
    return z.object({
      model: z.union([languageModelInstanceSchema, z.array(languageModelInstanceSchema)]),
      outputParser: resolveSchema({ parameters, schema: outputParserInstanceSchema, required: false, displayOptions: { "show": { "hasOutputParser": [true] } } })
    }).strict();
  }
  const parametersSchema = z.object({
    prompt: stringOrExpression.optional(),
    text: resolveSchema({ parameters, schema: stringOrExpression, required: true, displayOptions: { "show": { "promptType": ["define"] } } }),
    messages: z.object({ messageValues: z.array(z.object({ type: z.union([z.literal("AIMessagePromptTemplate"), z.literal("SystemMessagePromptTemplate"), z.literal("HumanMessagePromptTemplate"), expressionSchema]).optional(), messageType: z.union([z.literal("text"), z.literal("imageBinary"), z.literal("imageUrl"), expressionSchema]).optional(), binaryImageDataKey: stringOrExpression.optional(), imageUrl: stringOrExpression.optional(), imageDetail: z.union([z.literal("auto"), z.literal("low"), z.literal("high"), expressionSchema]).optional(), message: stringOrExpression.optional() })).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional(),
    subnodes: getSubnodesSchema()
  });
};
