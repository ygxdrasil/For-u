// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/chatTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, memoryInstanceSchema }) {
  function getSubnodesSchema() {
    return z.object({
      memory: resolveSchema({ parameters, schema: memoryInstanceSchema, required: true, displayOptions: { "show": { "options.loadPreviousSession": ["memory"] } }, defaults: { "options": {} } })
    }).strict();
  }
  const parametersSchema = z.object({
    public: booleanOrExpression.optional(),
    mode: resolveSchema({ parameters, schema: z.union([z.literal("hostedChat"), z.literal("webhook"), expressionSchema]), required: false, displayOptions: { "show": { "public": [true] } }, defaults: { "public": false } }),
    authentication: resolveSchema({ parameters, schema: z.union([z.literal("basicAuth"), z.literal("n8nUserAuth"), z.literal("none"), expressionSchema]), required: false, displayOptions: { "show": { "public": [true] } }, defaults: { "public": false } }),
    initialMessages: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "mode": ["hostedChat"], "public": [true] } }, defaults: { "mode": "hostedChat", "public": false } }),
    availableInChat: z.boolean().optional(),
    options: resolveOneOfSchemas({ parameters, variants: [{ schema: z.object({ allowFileUploads: booleanOrExpression.optional(), allowedFilesMimeTypes: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "public": [false] } }, defaults: { "public": false } }, { schema: z.object({ allowedOrigins: stringOrExpression.optional(), allowFileUploads: booleanOrExpression.optional(), allowedFilesMimeTypes: stringOrExpression.optional(), inputPlaceholder: stringOrExpression.optional(), loadPreviousSession: z.union([z.literal("notSupported"), z.literal("memory"), z.literal("manually"), expressionSchema]).optional(), showWelcomeScreen: booleanOrExpression.optional(), getStarted: stringOrExpression.optional(), subtitle: stringOrExpression.optional(), title: stringOrExpression.optional(), customCss: stringOrExpression.optional(), responseMode: z.union([z.literal("lastNode"), z.literal("responseNode"), expressionSchema]).optional(), autoSaveHighlightedData: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "mode": ["hostedChat", "webhook"], "public": [true] } }, defaults: { "mode": "hostedChat", "public": false } }] })
  });
  return z.object({
    parameters: parametersSchema.nullable().optional(),
    subnodes: getSubnodesSchema().optional()
  });
};
