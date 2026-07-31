// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/webhook/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    multipleMethods: booleanOrExpression.optional(),
    httpMethod: resolveSchema({ parameters, schema: z.union([z.literal("DELETE"), z.literal("GET"), z.literal("HEAD"), z.literal("PATCH"), z.literal("POST"), z.literal("PUT"), expressionSchema]), required: false, displayOptions: { "show": { "multipleMethods": [false, true] } }, defaults: { "multipleMethods": false } }),
    path: stringOrExpression.optional(),
    authentication: z.union([z.literal("basicAuth"), z.literal("headerAuth"), z.literal("jwtAuth"), z.literal("none"), expressionSchema]).optional(),
    responseMode: z.union([z.literal("onReceived"), z.literal("lastNode"), z.literal("responseNode"), expressionSchema]).optional(),
    responseCode: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "hide": { "responseMode": ["responseNode"] } }, defaults: { "responseMode": "onReceived" } }),
    responseData: resolveSchema({ parameters, schema: z.union([z.literal("allEntries"), z.literal("firstEntryJson"), z.literal("firstEntryBinary"), z.literal("noData"), expressionSchema]), required: false, displayOptions: { "show": { "responseMode": ["lastNode"] } }, defaults: { "responseMode": "onReceived" } }),
    responseBinaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "responseData": ["firstEntryBinary"] } }, defaults: { "responseData": "firstEntryJson" } }),
    options: z.object({ allowedOrigins: stringOrExpression.optional(), binaryData: booleanOrExpression.optional(), binaryPropertyName: stringOrExpression.optional(), ignoreBots: booleanOrExpression.optional(), ipWhitelist: stringOrExpression.optional(), noResponseBody: booleanOrExpression.optional(), responsePropertyName: stringOrExpression.optional(), binaryPropertyName: stringOrExpression.optional(), rawBody: booleanOrExpression.optional(), rawBody: booleanOrExpression.optional(), responseCode: z.unknown().optional(), responseContentType: stringOrExpression.optional(), responseData: stringOrExpression.optional(), responseHeaders: z.unknown().optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
