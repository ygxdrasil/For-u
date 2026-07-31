// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/removeDuplicates/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    compare: z.union([z.literal("allFields"), z.literal("allFieldsExcept"), z.literal("selectedFields"), expressionSchema]).optional(),
    fieldsToExclude: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "compare": ["allFieldsExcept"] } }, defaults: { "compare": "allFields" } }),
    fieldsToCompare: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "compare": ["selectedFields"] } }, defaults: { "compare": "allFields" } }),
    options: resolveSchema({ parameters, schema: z.object({ disableDotNotation: booleanOrExpression.optional(), removeOtherFields: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "compare": ["allFieldsExcept", "selectedFields"] } }, defaults: { "compare": "allFields" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
