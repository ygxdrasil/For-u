// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/compareDatasets/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    mergeByFields: z.object({ values: z.array(z.object({ field1: stringOrExpression.optional(), field2: stringOrExpression.optional() })).optional() }).optional(),
    resolve: z.union([z.literal("preferInput1"), z.literal("preferInput2"), z.literal("mix"), z.literal("includeBoth"), expressionSchema]).optional(),
    preferWhenMix: resolveSchema({ parameters, schema: z.union([z.literal("input1"), z.literal("input2"), expressionSchema]), required: false, displayOptions: { "show": { "resolve": ["mix"] } }, defaults: { "resolve": "preferInput2" } }),
    exceptWhenMix: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "resolve": ["mix"] } }, defaults: { "resolve": "preferInput2" } }),
    options: z.object({ skipFields: stringOrExpression.optional(), fuzzyCompare: booleanOrExpression.optional(), disableDotNotation: booleanOrExpression.optional(), multipleMatches: z.union([z.literal("first"), z.literal("all"), expressionSchema]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
