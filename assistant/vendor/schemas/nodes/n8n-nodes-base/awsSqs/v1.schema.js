// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsSqs/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
    operation: z.union([z.literal("sendMessage")]).optional(),
    queue: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["sendMessage"] } }, defaults: { "operation": "sendMessage" } }),
    queueType: z.union([z.literal("fifo"), z.literal("standard"), expressionSchema]).optional(),
    sendInputData: booleanOrExpression.optional(),
    message: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["sendMessage"], "sendInputData": [false] } }, defaults: { "operation": "sendMessage", "sendInputData": true } }),
    messageGroupId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "queueType": ["fifo"] } }, defaults: { "queueType": "standard" } }),
    options: resolveSchema({ parameters, schema: z.object({ delaySeconds: numberOrExpression.optional(), messageAttributes: z.unknown().optional(), messageDeduplicationId: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["sendMessage"] } }, defaults: { "operation": "sendMessage" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
