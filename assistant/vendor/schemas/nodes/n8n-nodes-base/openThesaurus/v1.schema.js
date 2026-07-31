// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/openThesaurus/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("getSynonyms")]).optional(),
    text: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["getSynonyms"] } }, defaults: { "operation": "getSynonyms" } }),
    options: resolveSchema({ parameters, schema: z.object({ baseform: booleanOrExpression.optional(), similar: booleanOrExpression.optional(), startswith: booleanOrExpression.optional(), substring: booleanOrExpression.optional(), substringFromResults: numberOrExpression.optional(), substringMaxResults: numberOrExpression.optional(), subsynsets: booleanOrExpression.optional(), supersynsets: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["getSynonyms"] } }, defaults: { "operation": "getSynonyms" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
