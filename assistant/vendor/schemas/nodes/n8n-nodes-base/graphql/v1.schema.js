// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/graphql/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("basicAuth"), z.literal("customAuth"), z.literal("digestAuth"), z.literal("headerAuth"), z.literal("none"), z.literal("oAuth1"), z.literal("oAuth2"), z.literal("queryAuth"), expressionSchema]).optional(),
    requestMethod: z.union([z.literal("GET"), z.literal("POST"), expressionSchema]).optional(),
    endpoint: stringOrExpression.optional(),
    allowUnauthorizedCerts: booleanOrExpression.optional(),
    requestFormat: resolveSchema({ parameters, schema: z.union([z.literal("graphql"), z.literal("json"), expressionSchema]), required: false, displayOptions: { "show": { "requestMethod": ["POST"] } }, defaults: { "requestMethod": "POST" } }),
    query: stringOrExpression.optional(),
    variables: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "requestFormat": ["json"], "requestMethod": ["POST"] } }, defaults: { "requestFormat": "graphql", "requestMethod": "POST" } }),
    operationName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "requestFormat": ["json"], "requestMethod": ["POST"] } }, defaults: { "requestFormat": "graphql", "requestMethod": "POST" } }),
    responseFormat: z.union([z.literal("json"), z.literal("string"), expressionSchema]).optional(),
    dataPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "responseFormat": ["string"] } }, defaults: { "responseFormat": "json" } }),
    headerParametersUi: z.object({ parameter: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
