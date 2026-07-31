// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailerLiteTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    event: z.union([z.literal("campaign.sent"), z.literal("subscriber.added_through_webform"), z.literal("subscriber.add_to_group"), z.literal("subscriber.automation_complete"), z.literal("subscriber.automation_triggered"), z.literal("subscriber.bounced"), z.literal("subscriber.complaint"), z.literal("subscriber.create"), z.literal("subscriber.remove_from_group"), z.literal("subscriber.unsubscribe"), z.literal("subscriber.update"), expressionSchema]).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
