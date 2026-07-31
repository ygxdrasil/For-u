// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspotTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    eventsUi: z.object({ eventValues: z.array(z.object({ name: z.union([z.literal("company.creation"), z.literal("company.deletion"), z.literal("company.propertyChange"), z.literal("contact.creation"), z.literal("contact.deletion"), z.literal("contact.privacyDeletion"), z.literal("contact.propertyChange"), z.literal("conversation.creation"), z.literal("conversation.deletion"), z.literal("conversation.newMessage"), z.literal("conversation.privacyDeletion"), z.literal("conversation.propertyChange"), z.literal("deal.creation"), z.literal("deal.deletion"), z.literal("deal.propertyChange"), z.literal("ticket.creation"), z.literal("ticket.deletion"), z.literal("ticket.propertyChange"), expressionSchema]).optional(), property: stringOrExpression.optional(), property: stringOrExpression.optional(), property: stringOrExpression.optional() })).optional() }).optional(),
    additionalFields: z.object({ maxConcurrentRequests: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
