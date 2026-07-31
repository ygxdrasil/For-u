// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/dhl/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    resource: z.unknown().optional(),
    operation: resolveSchema({ parameters, schema: z.union([z.literal("get")]), required: false, displayOptions: { "show": { "resource": ["shipment"] } }, defaults: { "resource": "shipment" } }),
    trackingNumber: stringOrExpression.optional(),
    options: z.object({ recipientPostalCode: stringOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
