// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/e2eTest/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("remoteOptions"), z.literal("resourceLocator"), z.literal("resourceMapper")]).optional(),
    fieldId: stringOrExpression.optional(),
    remoteOptions: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["remoteOptions"] } }, defaults: { "operation": "remoteOptions" } }),
    rlc: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "operation": ["resourceLocator"] } }, defaults: { "operation": "remoteOptions" } }),
    resourceMapper: resolveSchema({ parameters, schema: resourceMapperValueSchema, required: false, displayOptions: { "show": { "operation": ["resourceMapper"] } }, defaults: { "operation": "remoteOptions" } }),
    otherField: stringOrExpression.optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
