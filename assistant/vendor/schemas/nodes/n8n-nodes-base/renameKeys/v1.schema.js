// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/renameKeys/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    keys: z.object({ key: z.array(z.object({ currentKey: stringOrExpression.optional(), newKey: stringOrExpression.optional() })).optional() }).optional(),
    additionalOptions: z.object({ regexReplacement: z.unknown().optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
