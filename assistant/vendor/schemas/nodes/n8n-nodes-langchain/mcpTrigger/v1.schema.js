// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/mcpTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, toolInstanceSchema }) {
  const subnodesSchema = z.object({
    tools: z.array(toolInstanceSchema).optional()
  }).strict();
  const parametersSchema = z.object({
    authentication: z.union([z.literal("none"), z.literal("n8nOAuth2"), z.literal("bearerAuth"), z.literal("headerAuth"), expressionSchema]).optional(),
    requireExecuteAccess: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "authentication": ["n8nOAuth2"] } }, defaults: { "authentication": "none" } }),
    path: stringOrExpression
  });
  return z.object({
    parameters: parametersSchema.nullable().optional(),
    subnodes: subnodesSchema.optional()
  });
};
