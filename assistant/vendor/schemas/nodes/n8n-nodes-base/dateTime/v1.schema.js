// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/dateTime/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    action: z.union([z.literal("calculate"), z.literal("format"), expressionSchema]).optional(),
    value: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["format", "calculate"] } }, defaults: { "action": "format" } }),
    dataPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["format", "calculate"] } }, defaults: { "action": "format" } }),
    custom: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "action": ["format"] } }, defaults: { "action": "format" } }),
    toFormat: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["format"], "custom": [true, false] } }, defaults: { "action": "format", "custom": false } }),
    options: resolveSchema({ parameters, schema: z.object({ fromFormat: stringOrExpression.optional(), fromTimezone: stringOrExpression.optional(), toTimezone: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "action": ["format", "calculate"] } }, defaults: { "action": "format" } }),
    operation: resolveSchema({ parameters, schema: z.union([z.literal("add"), z.literal("subtract")]), required: false, displayOptions: { "show": { "action": ["calculate"] } }, defaults: { "action": "format" } }),
    duration: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "action": ["calculate"] } }, defaults: { "action": "format" } }),
    timeUnit: resolveSchema({ parameters, schema: z.union([z.literal("quarters"), z.literal("years"), z.literal("months"), z.literal("weeks"), z.literal("days"), z.literal("hours"), z.literal("minutes"), z.literal("seconds"), z.literal("milliseconds"), expressionSchema]), required: false, displayOptions: { "show": { "action": ["calculate"] } }, defaults: { "action": "format" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
