// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/kafka/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    topic: stringOrExpression.optional(),
    sendInputData: booleanOrExpression.optional(),
    message: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sendInputData": [false] } }, defaults: { "sendInputData": true } }),
    jsonParameters: booleanOrExpression.optional(),
    useSchemaRegistry: booleanOrExpression.optional(),
    schemaRegistryUrl: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "useSchemaRegistry": [true] } }, defaults: { "useSchemaRegistry": false } }),
    useKey: booleanOrExpression.optional(),
    key: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "useKey": [true] } }, defaults: { "useKey": false } }),
    eventName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "useSchemaRegistry": [true] } }, defaults: { "useSchemaRegistry": false } }),
    headersUi: resolveSchema({ parameters, schema: z.object({ headerValues: z.array(z.object({ key: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
    headerParametersJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
    options: z.object({ acks: booleanOrExpression.optional(), compression: booleanOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
