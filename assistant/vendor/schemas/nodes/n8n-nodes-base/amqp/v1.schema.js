// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/amqp/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    sink: stringOrExpression.optional(),
    headerParametersJson: z.union([iDataObjectSchema, z.string()]).optional(),
    options: z.object({ containerId: stringOrExpression.optional(), dataAsObject: booleanOrExpression.optional(), reconnect: booleanOrExpression.optional(), reconnectLimit: numberOrExpression.optional(), sendOnlyProperty: stringOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
