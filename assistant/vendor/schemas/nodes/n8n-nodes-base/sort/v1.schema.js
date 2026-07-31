// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/sort/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    type: z.union([z.literal("simple"), z.literal("random"), z.literal("code"), expressionSchema]).optional(),
    sortFieldsUi: resolveSchema({ parameters, schema: z.object({ sortField: z.array(z.object({ fieldName: stringOrExpression.optional(), order: z.union([z.literal("ascending"), z.literal("descending"), expressionSchema]).optional() })).optional() }), required: false, displayOptions: { "show": { "type": ["simple"] } }, defaults: { "type": "simple" } }),
    code: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "type": ["code"] } }, defaults: { "type": "simple" } }),
    options: resolveSchema({ parameters, schema: z.object({ disableDotNotation: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "type": ["simple"] } }, defaults: { "type": "simple" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
