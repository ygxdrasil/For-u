// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsAppTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    updates: z.array(z.union([z.literal("account_review_update"), z.literal("account_update"), z.literal("business_capability_update"), z.literal("message_template_quality_update"), z.literal("message_template_status_update"), z.literal("messages"), z.literal("phone_number_name_update"), z.literal("phone_number_quality_update"), z.literal("security"), z.literal("template_category_update")])).optional(),
    options: z.object({ messageStatusUpdates: z.array(z.union([z.literal("all"), z.literal("deleted"), z.literal("delivered"), z.literal("failed"), z.literal("read"), z.literal("sent")])).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
