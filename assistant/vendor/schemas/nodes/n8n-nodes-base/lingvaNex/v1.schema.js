// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/lingvaNex/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("translate")]).optional(),
    text: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["translate"] } }, defaults: { "operation": "translate" } }),
    translateTo: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["translate"] } }, defaults: { "operation": "translate" } }),
    options: resolveSchema({ parameters, schema: z.object({ from: stringOrExpression.optional(), platform: stringOrExpression.optional(), translateMode: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["translate"] } }, defaults: { "operation": "translate" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
