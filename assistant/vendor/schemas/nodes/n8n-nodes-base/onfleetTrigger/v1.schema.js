// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/onfleetTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    triggerOn: z.union([z.literal("SMSRecipientOptOut"), z.literal("smsRecipientResponseMissed"), z.literal("taskArrival"), z.literal("taskAssigned"), z.literal("taskCloned"), z.literal("taskCompleted"), z.literal("taskCreated"), z.literal("taskDelayed"), z.literal("taskDeleted"), z.literal("taskEta"), z.literal("taskFailed"), z.literal("taskStarted"), z.literal("taskUnassigned"), z.literal("taskUpdated"), z.literal("workerCreated"), z.literal("workerDeleted"), z.literal("workerDuty"), expressionSchema]).optional(),
    additionalFields: z.object({ name: stringOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
