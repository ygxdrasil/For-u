// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/httpRequest/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("basicAuth"), z.literal("digestAuth"), z.literal("headerAuth"), z.literal("none"), z.literal("oAuth1"), z.literal("oAuth2"), z.literal("queryAuth"), expressionSchema]).optional(),
    requestMethod: z.union([z.literal("DELETE"), z.literal("GET"), z.literal("HEAD"), z.literal("OPTIONS"), z.literal("PATCH"), z.literal("POST"), z.literal("PUT"), expressionSchema]).optional(),
    url: stringOrExpression.optional(),
    allowUnauthorizedCerts: booleanOrExpression.optional(),
    responseFormat: z.union([z.literal("file"), z.literal("json"), z.literal("string"), expressionSchema]).optional(),
    dataPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "responseFormat": ["string", "file"] } }, defaults: { "responseFormat": "json" } }),
    jsonParameters: booleanOrExpression.optional(),
    options: z.object({ batchInterval: numberOrExpression.optional(), batchSize: numberOrExpression.optional(), bodyContentType: z.union([z.literal("json"), z.literal("raw"), z.literal("multipart-form-data"), z.literal("form-urlencoded"), expressionSchema]).optional(), fullResponse: booleanOrExpression.optional(), followAllRedirects: booleanOrExpression.optional(), followRedirect: booleanOrExpression.optional(), ignoreResponseCode: booleanOrExpression.optional(), bodyContentCustomMimeType: stringOrExpression.optional(), proxy: stringOrExpression.optional(), splitIntoItems: booleanOrExpression.optional(), timeout: numberOrExpression.optional(), useQueryString: booleanOrExpression.optional() }).optional(),
    sendBinaryData: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "jsonParameters": [true], "requestMethod": ["PATCH", "POST", "PUT"] } }, defaults: { "jsonParameters": false, "requestMethod": "GET" } }),
    binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "jsonParameters": [true], "requestMethod": ["PATCH", "POST", "PUT"] }, "hide": { "sendBinaryData": [false] } }, defaults: { "jsonParameters": false, "requestMethod": "GET", "sendBinaryData": false } }),
    bodyParametersJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true], "requestMethod": ["PATCH", "POST", "PUT", "DELETE"] }, "hide": { "sendBinaryData": [true] } }, defaults: { "jsonParameters": false, "requestMethod": "GET", "sendBinaryData": false } }),
    bodyParametersUi: resolveSchema({ parameters, schema: z.object({ parameter: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false], "requestMethod": ["PATCH", "POST", "PUT", "DELETE"] } }, defaults: { "jsonParameters": false, "requestMethod": "GET" } }),
    headerParametersJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
    headerParametersUi: resolveSchema({ parameters, schema: z.object({ parameter: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
    queryParametersJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
    queryParametersUi: resolveSchema({ parameters, schema: z.object({ parameter: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
