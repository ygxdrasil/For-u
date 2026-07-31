// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheetsTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    pollTimes: z.object({ item: z.array(z.object({ mode: z.union([z.literal("everyMinute"), z.literal("everyHour"), z.literal("everyDay"), z.literal("everyWeek"), z.literal("everyMonth"), z.literal("everyX"), z.literal("custom"), expressionSchema]).optional(), hour: numberOrExpression.optional(), minute: numberOrExpression.optional(), dayOfMonth: numberOrExpression.optional(), weekday: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.literal("5"), z.literal("6"), z.literal("0"), expressionSchema]).optional(), cronExpression: stringOrExpression.optional(), value: numberOrExpression.optional(), unit: z.union([z.literal("minutes"), z.literal("hours"), expressionSchema]).optional() })).optional() }).optional(),
    authentication: z.unknown().optional(),
    documentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
    sheetName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
    event: z.union([z.literal("rowAdded"), z.literal("rowUpdate"), z.literal("anyUpdate"), expressionSchema]).optional(),
    includeInOutput: resolveSchema({ parameters, schema: z.union([z.literal("new"), z.literal("old"), z.literal("both"), expressionSchema]), required: false, displayOptions: { "hide": { "event": ["rowAdded"] } }, defaults: { "event": "anyUpdate" } }),
    options: z.object({ columnsToWatch: z.array(z.string()).optional(), dataLocationOnSheet: z.unknown().optional(), valueRender: z.union([z.literal("UNFORMATTED_VALUE"), z.literal("FORMATTED_VALUE"), z.literal("FORMULA"), expressionSchema]).optional(), dateTimeRenderOption: z.union([z.literal("SERIAL_NUMBER"), z.literal("FORMATTED_STRING"), expressionSchema]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
