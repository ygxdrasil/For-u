// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/postgresTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    triggerMode: z.union([z.literal("createTrigger"), z.literal("listenTrigger"), expressionSchema]).optional(),
    schema: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "triggerMode": ["createTrigger"] } }, defaults: { "triggerMode": "createTrigger" } }),
    tableName: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "triggerMode": ["createTrigger"] } }, defaults: { "triggerMode": "createTrigger" } }),
    channelName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "triggerMode": ["listenTrigger"] } }, defaults: { "triggerMode": "createTrigger" } }),
    firesOn: resolveSchema({ parameters, schema: z.union([z.literal("INSERT"), z.literal("UPDATE"), z.literal("DELETE"), expressionSchema]), required: false, displayOptions: { "show": { "triggerMode": ["createTrigger"] } }, defaults: { "triggerMode": "createTrigger" } }),
    additionalFields: resolveSchema({ parameters, schema: z.object({ channelName: stringOrExpression.optional(), functionName: stringOrExpression.optional(), replaceIfExists: booleanOrExpression.optional(), triggerName: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "triggerMode": ["createTrigger"] } }, defaults: { "triggerMode": "createTrigger" } }),
    options: z.object({ connectionTimeout: numberOrExpression.optional(), delayClosingIdleConnection: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
