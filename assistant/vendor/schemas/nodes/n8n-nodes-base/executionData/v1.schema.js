// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/executionData/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("save")]).optional(),
    dataToSave: resolveSchema({ parameters, schema: z.object({ values: z.array(z.object({ key: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "operation": ["save"] } }, defaults: { "operation": "save" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
