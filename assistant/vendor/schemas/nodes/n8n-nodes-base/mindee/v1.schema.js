// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mindee/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    apiVersion: z.union([z.literal(1), z.literal(3), z.literal(4), expressionSchema]).optional(),
    resource: z.union([z.literal("invoice"), z.literal("receipt")]).optional(),
    operation: z.union([z.literal("predict")]).optional(),
    binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["predict"], "resource": ["receipt", "invoice"] } }, defaults: { "operation": "predict", "resource": "receipt" } }),
    rawData: booleanOrExpression.optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
