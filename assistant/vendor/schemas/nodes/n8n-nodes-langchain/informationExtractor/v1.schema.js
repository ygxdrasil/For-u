// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/informationExtractor/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, languageModelInstanceSchema }) {
  const subnodesSchema = z.object({
    model: z.union([languageModelInstanceSchema, z.array(languageModelInstanceSchema)])
  }).strict();
  const parametersSchema = z.object({
    text: stringOrExpression.optional(),
    schemaType: z.union([z.literal("fromAttributes"), z.literal("fromJson"), z.literal("manual")]).optional(),
    jsonSchemaExample: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "schemaType": ["fromJson"] } }, defaults: { "schemaType": "fromAttributes" } }),
    inputSchema: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "schemaType": ["manual"] } }, defaults: { "schemaType": "fromAttributes" } }),
    attributes: resolveSchema({ parameters, schema: z.object({ attributes: z.array(z.object({ name: stringOrExpression.optional(), type: z.union([z.literal("boolean"), z.literal("date"), z.literal("number"), z.literal("string"), expressionSchema]).optional(), description: stringOrExpression.optional(), required: booleanOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "schemaType": ["fromAttributes"] } }, defaults: { "schemaType": "fromAttributes" } }),
    options: z.object({ systemPromptTemplate: stringOrExpression.optional(), batching: z.object({ batchSize: numberOrExpression.optional(), delayBetweenBatches: numberOrExpression.optional() }).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional(),
    subnodes: subnodesSchema
  });
};
