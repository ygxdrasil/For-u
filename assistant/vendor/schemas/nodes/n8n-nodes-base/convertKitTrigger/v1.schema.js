// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/convertKitTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    event: z.union([z.literal("formSubscribe"), z.literal("linkClick"), z.literal("productPurchase"), z.literal("purchaseCreate"), z.literal("courseComplete"), z.literal("courseSubscribe"), z.literal("subscriberActivate"), z.literal("subscriberUnsubscribe"), z.literal("tagAdd"), z.literal("tagRemove"), expressionSchema]).optional(),
    formId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "event": ["formSubscribe"] } }, defaults: { "event": "" } }),
    courseId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "event": ["courseSubscribe", "courseComplete"] } }, defaults: { "event": "" } }),
    link: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "event": ["linkClick"] } }, defaults: { "event": "" } }),
    productId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "event": ["productPurchase"] } }, defaults: { "event": "" } }),
    tagId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "event": ["tagAdd", "tagRemove"] } }, defaults: { "event": "" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
