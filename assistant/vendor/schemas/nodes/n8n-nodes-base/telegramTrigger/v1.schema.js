// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegramTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    updates: z.array(z.union([z.literal("*"), z.literal("callback_query"), z.literal("channel_post"), z.literal("edited_channel_post"), z.literal("edited_message"), z.literal("inline_query"), z.literal("message"), z.literal("poll"), z.literal("pre_checkout_query"), z.literal("shipping_query")])).optional(),
    additionalFields: z.object({ download: booleanOrExpression.optional(), imageSize: z.union([z.literal("small"), z.literal("medium"), z.literal("large"), z.literal("extraLarge"), expressionSchema]).optional(), chatIds: stringOrExpression.optional(), userIds: stringOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
