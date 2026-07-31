// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/memoryBufferWindow/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas }) {
  const parametersSchema = z.object({
    sessionKey: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionIdType": ["customKey"] } } }),
    contextWindowLength: numberOrExpression.optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
