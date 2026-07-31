// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/calTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    events: z.array(z.union([z.literal("BOOKING_CANCELLED"), z.literal("BOOKING_CREATED"), z.literal("BOOKING_RESCHEDULED"), z.literal("MEETING_ENDED")])).optional(),
    version: z.union([z.literal(1), z.literal(2), expressionSchema]).optional(),
    options: z.object({ appId: stringOrExpression.optional(), eventTypeId: stringOrExpression.optional(), payloadTemplate: stringOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
