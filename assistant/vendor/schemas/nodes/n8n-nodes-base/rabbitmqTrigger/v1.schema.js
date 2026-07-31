// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/rabbitmqTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    queue: stringOrExpression.optional(),
    options: z.object({ arguments: z.unknown().optional(), assertExchange: booleanOrExpression.optional(), assertQueue: booleanOrExpression.optional(), autoDelete: booleanOrExpression.optional(), binding: z.unknown().optional(), contentIsBinary: booleanOrExpression.optional(), acknowledge: z.union([z.literal("executionFinishes"), z.literal("executionFinishesSuccessfully"), z.literal("immediately"), z.literal("laterMessageNode"), expressionSchema]).optional(), durable: booleanOrExpression.optional(), exclusive: booleanOrExpression.optional(), headers: z.unknown().optional(), jsonParseBody: booleanOrExpression.optional(), onlyContent: booleanOrExpression.optional(), parallelMessages: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
