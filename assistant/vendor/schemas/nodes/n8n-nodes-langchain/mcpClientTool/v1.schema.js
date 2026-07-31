// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/mcpClientTool/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas }) {
  const parametersSchema = z.object({
    sseEndpoint: stringOrExpression,
    authentication: z.union([z.literal("bearerAuth"), z.literal("headerAuth"), z.literal("none"), expressionSchema]).optional(),
    include: z.union([z.literal("all"), z.literal("selected"), z.literal("except"), expressionSchema]).optional(),
    includeTools: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "show": { "include": ["selected"] } }, defaults: { "include": "all" } }),
    excludeTools: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "show": { "include": ["except"] } }, defaults: { "include": "all" } }),
    options: z.object({ timeout: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
