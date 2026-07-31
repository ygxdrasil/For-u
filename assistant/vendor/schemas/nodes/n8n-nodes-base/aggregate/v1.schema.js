// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/aggregate/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    aggregate: z.union([z.literal("aggregateIndividualFields"), z.literal("aggregateAllItemData"), expressionSchema]).optional(),
    fieldsToAggregate: resolveSchema({ parameters, schema: z.object({ fieldToAggregate: z.array(z.object({ fieldToAggregate: stringOrExpression.optional(), renameField: booleanOrExpression.optional(), outputFieldName: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "aggregate": ["aggregateIndividualFields"] } }, defaults: { "aggregate": "aggregateIndividualFields" } }),
    destinationFieldName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "aggregate": ["aggregateAllItemData"] } }, defaults: { "aggregate": "aggregateIndividualFields" } }),
    include: resolveSchema({ parameters, schema: z.union([z.literal("allFields"), z.literal("specifiedFields"), z.literal("allFieldsExcept"), expressionSchema]), required: false, displayOptions: { "show": { "aggregate": ["aggregateAllItemData"] } }, defaults: { "aggregate": "aggregateIndividualFields" } }),
    fieldsToExclude: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "aggregate": ["aggregateAllItemData"], "include": ["allFieldsExcept"] } }, defaults: { "aggregate": "aggregateIndividualFields", "include": "allFields" } }),
    fieldsToInclude: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "aggregate": ["aggregateAllItemData"], "include": ["specifiedFields"] } }, defaults: { "aggregate": "aggregateIndividualFields", "include": "allFields" } }),
    options: z.object({ disableDotNotation: booleanOrExpression.optional(), mergeLists: booleanOrExpression.optional(), includeBinaries: booleanOrExpression.optional(), keepOnlyUnique: booleanOrExpression.optional(), keepMissing: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
