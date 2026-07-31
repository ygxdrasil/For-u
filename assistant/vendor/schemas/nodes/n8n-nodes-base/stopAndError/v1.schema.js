// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/stopAndError/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    errorType: z.union([z.literal("errorMessage"), z.literal("errorObject"), expressionSchema]).optional(),
    errorMessage: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "errorType": ["errorMessage"] } }, defaults: { "errorType": "errorMessage" } }),
    errorObject: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "errorType": ["errorObject"] } }, defaults: { "errorType": "errorMessage" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
