// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/rabbitmq/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.unknown().optional(),
    mode: resolveSchema({ parameters, schema: z.union([z.literal("queue"), z.literal("exchange"), expressionSchema]), required: false, displayOptions: { "hide": { "operation": ["deleteMessage"] } }, defaults: { "operation": "sendMessage" } }),
    queue: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "mode": ["queue"] }, "hide": { "operation": ["deleteMessage"] } }, defaults: { "mode": "queue", "operation": "sendMessage" } }),
    exchange: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "mode": ["exchange"] } }, defaults: { "mode": "queue" } }),
    exchangeType: resolveSchema({ parameters, schema: z.union([z.literal("direct"), z.literal("topic"), z.literal("headers"), z.literal("fanout"), expressionSchema]), required: false, displayOptions: { "show": { "mode": ["exchange"] } }, defaults: { "mode": "queue" } }),
    routingKey: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "mode": ["exchange"] } }, defaults: { "mode": "queue" } }),
    sendInputData: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["sendMessage"] } }, defaults: { "operation": "sendMessage" } }),
    message: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sendInputData": [false] } }, defaults: { "sendInputData": true } }),
    options: resolveSchema({ parameters, schema: z.object({ alternateExchange: stringOrExpression.optional(), arguments: z.unknown().optional(), autoDelete: booleanOrExpression.optional(), durable: booleanOrExpression.optional(), exclusive: booleanOrExpression.optional(), headers: z.unknown().optional() }), required: false, displayOptions: { "show": { "operation": ["sendMessage"] } }, defaults: { "operation": "sendMessage" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
