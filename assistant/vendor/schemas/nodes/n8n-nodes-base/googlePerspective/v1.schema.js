// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googlePerspective/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("analyzeComment")]).optional(),
    text: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["analyzeComment"] } }, defaults: { "operation": "analyzeComment" } }),
    requestedAttributesUi: resolveSchema({ parameters, schema: z.object({ requestedAttributesValues: z.array(z.object({ attributeName: z.union([z.literal("flirtation"), z.literal("identity_attack"), z.literal("insult"), z.literal("profanity"), z.literal("severe_toxicity"), z.literal("sexually_explicit"), z.literal("threat"), z.literal("toxicity"), expressionSchema]).optional(), scoreThreshold: numberOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "operation": ["analyzeComment"] } }, defaults: { "operation": "analyzeComment" } }),
    options: resolveSchema({ parameters, schema: z.object({ languages: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["analyzeComment"] } }, defaults: { "operation": "analyzeComment" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
