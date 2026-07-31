// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerceTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    event: z.union([z.literal("coupon.created"), z.literal("coupon.deleted"), z.literal("coupon.updated"), z.literal("customer.created"), z.literal("customer.deleted"), z.literal("customer.updated"), z.literal("order.created"), z.literal("order.deleted"), z.literal("order.updated"), z.literal("product.created"), z.literal("product.deleted"), z.literal("product.updated"), expressionSchema]).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
