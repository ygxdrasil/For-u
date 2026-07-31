// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mqtt/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    topic: stringOrExpression.optional(),
    sendInputData: booleanOrExpression.optional(),
    message: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sendInputData": [false] } }, defaults: { "sendInputData": true } }),
    options: z.object({ qos: z.union([z.literal(0), z.literal(1), z.literal(2), expressionSchema]).optional(), retain: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
