// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/respondToWebhook/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    respondWith: z.union([z.literal("allIncomingItems"), z.literal("binary"), z.literal("firstIncomingItem"), z.literal("json"), z.literal("jwt"), z.literal("noData"), z.literal("redirect"), z.literal("text"), expressionSchema]).optional(),
    redirectURL: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "respondWith": ["redirect"] } }, defaults: { "respondWith": "firstIncomingItem" } }),
    responseBody: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "respondWith": ["json", "text"] } }, defaults: { "respondWith": "firstIncomingItem" } }),
    payload: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "respondWith": ["jwt"] } }, defaults: { "respondWith": "firstIncomingItem" } }),
    responseDataSource: resolveSchema({ parameters, schema: z.union([z.literal("automatically"), z.literal("set"), expressionSchema]), required: false, displayOptions: { "show": { "respondWith": ["binary"] } }, defaults: { "respondWith": "firstIncomingItem" } }),
    inputFieldName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "respondWith": ["binary"], "responseDataSource": ["set"] } }, defaults: { "respondWith": "firstIncomingItem", "responseDataSource": "automatically" } }),
    options: z.object({ responseCode: numberOrExpression.optional(), responseHeaders: z.unknown().optional(), responseKey: stringOrExpression.optional(), enableStreaming: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
