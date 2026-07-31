// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/facebookGraphApi/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    hostUrl: z.union([z.literal("graph.facebook.com"), z.literal("graph-video.facebook.com"), expressionSchema]).optional(),
    httpRequestMethod: z.union([z.literal("GET"), z.literal("POST"), z.literal("DELETE"), expressionSchema]).optional(),
    graphApiVersion: z.union([z.literal(""), z.literal("v23.0"), z.literal("v22.0"), z.literal("v21.0"), z.literal("v20.0"), z.literal("v19.0"), z.literal("v18.0"), z.literal("v17.0"), z.literal("v16.0"), z.literal("v15.0"), z.literal("v14.0"), z.literal("v13.0"), z.literal("v12.0"), z.literal("v11.0"), z.literal("v10.0"), z.literal("v9.0"), z.literal("v8.0"), z.literal("v7.0"), z.literal("v6.0"), z.literal("v5.0"), z.literal("v4.0"), z.literal("v3.3"), z.literal("v3.2"), z.literal("v3.1"), z.literal("v3.0"), expressionSchema]).optional(),
    node: stringOrExpression.optional(),
    edge: stringOrExpression.optional(),
    allowUnauthorizedCerts: booleanOrExpression.optional(),
    sendBinaryData: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "httpRequestMethod": ["POST", "PUT"] } }, defaults: { "httpRequestMethod": "GET" } }),
    binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "httpRequestMethod": ["POST", "PUT"] }, "hide": { "sendBinaryData": [false] } }, defaults: { "httpRequestMethod": "GET", "sendBinaryData": false } }),
    options: z.object({ fields: z.unknown().optional(), queryParameters: z.unknown().optional(), queryParametersJson: z.union([iDataObjectSchema, z.string()]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
