// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/toolCode/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas }) {
  const parametersSchema = z.object({
    name: stringOrExpression.optional(),
    description: stringOrExpression.optional(),
    language: z.union([z.literal("javaScript"), z.literal("python")]).optional(),
    jsCode: resolveSchema({ parameters, schema: z.string(), required: false, displayOptions: { "show": { "language": ["javaScript"] } }, defaults: { "language": "javaScript" } }),
    pythonCode: resolveSchema({ parameters, schema: z.string(), required: false, displayOptions: { "show": { "language": ["python"] } }, defaults: { "language": "javaScript" } }),
    specifyInputSchema: z.boolean().optional(),
    schemaType: resolveSchema({ parameters, schema: z.union([z.literal("fromJson"), z.literal("manual")]), required: false, displayOptions: { "show": { "specifyInputSchema": [true] } }, defaults: { "specifyInputSchema": false } }),
    jsonSchemaExample: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "specifyInputSchema": [true], "schemaType": ["fromJson"] } }, defaults: { "specifyInputSchema": false, "schemaType": "fromJson" } }),
    inputSchema: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "specifyInputSchema": [true], "schemaType": ["manual"] } }, defaults: { "specifyInputSchema": false, "schemaType": "fromJson" } })
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
