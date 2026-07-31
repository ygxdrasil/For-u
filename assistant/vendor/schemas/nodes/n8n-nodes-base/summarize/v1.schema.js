// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/summarize/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    fieldsToSummarize: z.object({ values: z.array(z.object({ aggregation: z.union([z.literal("append"), z.literal("average"), z.literal("concatenate"), z.literal("count"), z.literal("countUnique"), z.literal("max"), z.literal("min"), z.literal("sum"), expressionSchema]).optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), includeEmpty: booleanOrExpression.optional(), separateBy: z.union([z.literal(","), z.literal(", "), z.literal("\n"), z.literal(""), z.literal(" "), z.literal("other"), expressionSchema]).optional(), customSeparator: stringOrExpression.optional() })).optional() }).optional(),
    fieldsToSplitBy: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "/options.outputFormat": ["singleItem"] }, "hide": { "/options.outputFormat": ["singleItem"] } } }),
    options: z.object({ continueIfFieldNotFound: booleanOrExpression.optional(), disableDotNotation: booleanOrExpression.optional(), outputFormat: z.union([z.literal("separateItems"), z.literal("singleItem"), expressionSchema]).optional(), skipEmptySplitFields: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
