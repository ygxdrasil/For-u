// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/mcpClient/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas }) {
  const parametersSchema = z.object({
    serverTransport: z.union([z.literal("httpStreamable"), z.literal("sse"), expressionSchema]).optional(),
    endpointUrl: stringOrExpression,
    authentication: z.union([z.literal("bearerAuth"), z.literal("headerAuth"), z.literal("mcpOAuth2Api"), z.literal("multipleHeadersAuth"), z.literal("none"), expressionSchema]).optional(),
    tool: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
    inputMode: z.union([z.literal("manual"), z.literal("json")]).optional(),
    parameters: resolveSchema({ parameters, schema: resourceMapperValueSchema, required: false, displayOptions: { "show": { "inputMode": ["manual"] } }, defaults: { "inputMode": "manual" } }),
    jsonInput: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "inputMode": ["json"] } }, defaults: { "inputMode": "manual" } }),
    options: z.object({ convertToBinary: booleanOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
