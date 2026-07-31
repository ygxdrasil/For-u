// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/filter/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    conditions: z.object({ boolean: z.array(z.object({ value1: booleanOrExpression.optional(), operation: z.union([z.literal("equal"), z.literal("notEqual"), expressionSchema]).optional(), value2: booleanOrExpression.optional() })).optional(), dateTime: z.array(z.object({ value1: stringOrExpression.optional(), operation: z.union([z.literal("after"), z.literal("before"), expressionSchema]).optional(), value2: stringOrExpression.optional() })).optional(), number: z.array(z.object({ value1: numberOrExpression.optional(), operation: z.union([z.literal("smaller"), z.literal("smallerEqual"), z.literal("equal"), z.literal("notEqual"), z.literal("larger"), z.literal("largerEqual"), z.literal("isEmpty"), z.literal("isNotEmpty")]).optional(), value2: numberOrExpression.optional() })).optional(), string: z.array(z.object({ value1: stringOrExpression.optional(), operation: z.union([z.literal("contains"), z.literal("notContains"), z.literal("endsWith"), z.literal("notEndsWith"), z.literal("equal"), z.literal("notEqual"), z.literal("regex"), z.literal("notRegex"), z.literal("startsWith"), z.literal("notStartsWith"), z.literal("isEmpty"), z.literal("isNotEmpty")]).optional(), value2: stringOrExpression.optional(), value2: stringOrExpression.optional() })).optional() }).optional(),
    combineConditions: z.union([z.literal("AND"), z.literal("OR"), expressionSchema]).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
