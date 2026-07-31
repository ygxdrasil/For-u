// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtableTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    pollTimes: z.object({ item: z.array(z.object({ mode: z.union([z.literal("everyMinute"), z.literal("everyHour"), z.literal("everyDay"), z.literal("everyWeek"), z.literal("everyMonth"), z.literal("everyX"), z.literal("custom"), expressionSchema]).optional(), hour: numberOrExpression.optional(), minute: numberOrExpression.optional(), dayOfMonth: numberOrExpression.optional(), weekday: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.literal("5"), z.literal("6"), z.literal("0"), expressionSchema]).optional(), cronExpression: stringOrExpression.optional(), value: numberOrExpression.optional(), unit: z.union([z.literal("minutes"), z.literal("hours"), expressionSchema]).optional() })).optional() }).optional(),
    authentication: z.union([z.literal("airtableApi"), z.literal("airtableTokenApi"), z.literal("airtableOAuth2Api"), expressionSchema]).optional(),
    baseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
    tableId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
    triggerField: stringOrExpression.optional(),
    downloadAttachments: booleanOrExpression.optional(),
    downloadFieldNames: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "downloadAttachments": [true] } }, defaults: { "downloadAttachments": false } }),
    additionalFields: z.object({ fields: stringOrExpression.optional(), formula: stringOrExpression.optional(), viewId: stringOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
