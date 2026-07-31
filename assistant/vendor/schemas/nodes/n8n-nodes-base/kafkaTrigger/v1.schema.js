// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/kafkaTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    topic: stringOrExpression.optional(),
    groupId: stringOrExpression.optional(),
    useSchemaRegistry: booleanOrExpression.optional(),
    schemaRegistryUrl: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "useSchemaRegistry": [true] } }, defaults: { "useSchemaRegistry": false } }),
    options: z.object({ allowAutoTopicCreation: booleanOrExpression.optional(), autoCommitThreshold: numberOrExpression.optional(), autoCommitInterval: numberOrExpression.optional(), batchSize: numberOrExpression.optional(), eachBatchAutoResolve: booleanOrExpression.optional(), fetchMaxBytes: numberOrExpression.optional(), fetchMinBytes: numberOrExpression.optional(), heartbeatInterval: numberOrExpression.optional(), heartbeatInterval: numberOrExpression.optional(), maxInFlightRequests: numberOrExpression.optional(), fromBeginning: booleanOrExpression.optional(), jsonParseMessage: booleanOrExpression.optional(), keepBinaryData: booleanOrExpression.optional(), parallelProcessing: booleanOrExpression.optional(), partitionsConsumedConcurrently: numberOrExpression.optional(), onlyMessage: booleanOrExpression.optional(), returnHeaders: booleanOrExpression.optional(), rebalanceTimeout: numberOrExpression.optional(), errorRetryDelay: numberOrExpression.optional(), sessionTimeout: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
