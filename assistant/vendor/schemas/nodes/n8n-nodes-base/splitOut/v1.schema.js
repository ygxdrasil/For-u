// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/splitOut/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    fieldToSplitOut: stringOrExpression.optional(),
    include: z.union([z.literal("noOtherFields"), z.literal("allOtherFields"), z.literal("selectedOtherFields"), expressionSchema]).optional(),
    fieldsToInclude: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "include": ["selectedOtherFields"] } }, defaults: { "include": "noOtherFields" } }),
    options: z.object({ disableDotNotation: booleanOrExpression.optional(), destinationFieldName: stringOrExpression.optional(), includeBinary: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
