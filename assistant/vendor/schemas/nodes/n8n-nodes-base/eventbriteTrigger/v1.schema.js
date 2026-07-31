// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/eventbriteTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("privateKey"), z.literal("oAuth2"), expressionSchema]).optional(),
    organization: stringOrExpression.optional(),
    event: stringOrExpression.optional(),
    actions: z.array(z.union([z.literal("attendee.checked_in"), z.literal("attendee.checked_out"), z.literal("attendee.updated"), z.literal("event.created"), z.literal("event.published"), z.literal("event.unpublished"), z.literal("event.updated"), z.literal("order.placed"), z.literal("order.refunded"), z.literal("order.updated"), z.literal("organizer.updated"), z.literal("ticket_class.created"), z.literal("ticket_class.deleted"), z.literal("ticket_class.updated"), z.literal("venue.updated")])).optional(),
    resolveData: booleanOrExpression.optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
