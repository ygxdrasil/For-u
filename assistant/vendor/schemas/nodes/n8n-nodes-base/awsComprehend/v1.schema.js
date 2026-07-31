// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsComprehend/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
    resource: z.union([z.literal("text")]).optional(),
    operation: z.union([z.literal("detectDominantLanguage"), z.literal("detectEntities"), z.literal("detectSentiment")]).optional(),
    languageCode: resolveSchema({ parameters, schema: z.union([z.literal("ar"), z.literal("zh"), z.literal("zh-TW"), z.literal("en"), z.literal("fr"), z.literal("de"), z.literal("hi"), z.literal("it"), z.literal("ja"), z.literal("ko"), z.literal("pt"), z.literal("es"), expressionSchema]), required: false, displayOptions: { "show": { "resource": ["text"], "operation": ["detectSentiment", "detectEntities"] } }, defaults: { "resource": "text", "operation": "detectDominantLanguage" } }),
    text: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "resource": ["text"] } }, defaults: { "resource": "text" } }),
    simple: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "resource": ["text"], "operation": ["detectDominantLanguage"] } }, defaults: { "resource": "text", "operation": "detectDominantLanguage" } }),
    additionalFields: resolveSchema({ parameters, schema: z.object({ endpointArn: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "resource": ["text"], "operation": ["detectEntities"] } }, defaults: { "resource": "text", "operation": "detectDominantLanguage" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
