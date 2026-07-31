// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/webflowTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
    site: stringOrExpression.optional(),
    event: z.union([z.literal("collection_item_created"), z.literal("collection_item_deleted"), z.literal("collection_item_changed"), z.literal("ecomm_inventory_changed"), z.literal("ecomm_new_order"), z.literal("ecomm_order_changed"), z.literal("form_submission"), z.literal("site_publish"), expressionSchema]).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
