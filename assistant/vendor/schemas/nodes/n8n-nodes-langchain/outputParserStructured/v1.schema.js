// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/outputParserStructured/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, languageModelInstanceSchema }) {
  function getSubnodesSchema() {
    return z.object({
      model: resolveSchema({ parameters, schema: z.union([languageModelInstanceSchema, z.array(languageModelInstanceSchema)]), required: true, displayOptions: { "show": { "autoFix": [true] } }, defaults: { "autoFix": false } })
    }).strict();
  }
  const parametersSchema = z.object({
    jsonSchemaExample: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "schemaType": ["fromJson"] } } }),
    inputSchema: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "schemaType": ["manual"] } } }),
    jsonSchema: z.union([iDataObjectSchema, z.string()]).optional(),
    autoFix: booleanOrExpression.optional(),
    customizeRetryPrompt: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "autoFix": [true] } }, defaults: { "autoFix": false } }),
    prompt: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "autoFix": [true], "customizeRetryPrompt": [true] } }, defaults: { "autoFix": false, "customizeRetryPrompt": false } })
  });
  return z.object({
    parameters: parametersSchema.nullable().optional(),
    subnodes: getSubnodesSchema().optional()
  });
};
