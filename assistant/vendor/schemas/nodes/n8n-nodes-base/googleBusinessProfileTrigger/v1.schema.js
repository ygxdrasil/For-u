// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleBusinessProfileTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    pollTimes: z.object({ item: z.array(z.object({ mode: z.union([z.literal("everyMinute"), z.literal("everyHour"), z.literal("everyDay"), z.literal("everyWeek"), z.literal("everyMonth"), z.literal("everyX"), z.literal("custom"), expressionSchema]).optional(), hour: numberOrExpression.optional(), minute: numberOrExpression.optional(), dayOfMonth: numberOrExpression.optional(), weekday: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.literal("5"), z.literal("6"), z.literal("0"), expressionSchema]).optional(), cronExpression: stringOrExpression.optional(), value: numberOrExpression.optional(), unit: z.union([z.literal("minutes"), z.literal("hours"), expressionSchema]).optional() })).optional() }).optional(),
    event: z.union([z.literal("reviewAdded")]).optional(),
    account: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "event": ["reviewAdded"] } }, defaults: { "event": "reviewAdded" } }),
    location: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "event": ["reviewAdded"] } }, defaults: { "event": "reviewAdded" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
