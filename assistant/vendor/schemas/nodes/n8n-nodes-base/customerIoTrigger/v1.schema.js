// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIoTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    events: z.array(z.union([z.literal("customer.subscribed"), z.literal("customer.unsubscribed"), z.literal("email.attempted"), z.literal("email.bounced"), z.literal("email.clicked"), z.literal("email.converted"), z.literal("email.delivered"), z.literal("email.drafted"), z.literal("email.failed"), z.literal("email.opened"), z.literal("email.sent"), z.literal("email.spammed"), z.literal("push.attempted"), z.literal("push.bounced"), z.literal("push.clicked"), z.literal("push.delivered"), z.literal("push.drafted"), z.literal("push.failed"), z.literal("push.opened"), z.literal("push.sent"), z.literal("slack.attempted"), z.literal("slack.clicked"), z.literal("slack.drafted"), z.literal("slack.failed"), z.literal("slack.sent"), z.literal("sms.attempted"), z.literal("sms.bounced"), z.literal("sms.clicked"), z.literal("sms.delivered"), z.literal("sms.drafted"), z.literal("sms.failed"), z.literal("sms.sent")])).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
