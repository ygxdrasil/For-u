// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/invoiceNinjaTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    apiVersion: z.union([z.literal("v4"), z.literal("v5"), expressionSchema]).optional(),
    event: z.union([z.literal("create_client"), z.literal("create_invoice"), z.literal("create_payment"), z.literal("create_quote"), z.literal("create_vendor"), expressionSchema]).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
