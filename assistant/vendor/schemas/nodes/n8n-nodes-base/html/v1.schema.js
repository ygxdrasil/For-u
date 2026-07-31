// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/html/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("generateHtmlTemplate"), z.literal("extractHtmlContent"), z.literal("convertToHtmlTable")]).optional(),
    html: resolveSchema({ parameters, schema: z.string(), required: false, displayOptions: { "show": { "operation": ["generateHtmlTemplate"] } }, defaults: { "operation": "generateHtmlTemplate" } }),
    sourceData: resolveSchema({ parameters, schema: z.union([z.literal("binary"), z.literal("json"), expressionSchema]), required: false, displayOptions: { "show": { "operation": ["extractHtmlContent"] } }, defaults: { "operation": "generateHtmlTemplate" } }),
    dataPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["extractHtmlContent"], "sourceData": ["binary", "json"] } }, defaults: { "operation": "generateHtmlTemplate", "sourceData": "json" } }),
    extractionValues: resolveSchema({ parameters, schema: z.object({ values: z.array(z.object({ key: stringOrExpression.optional(), cssSelector: stringOrExpression.optional(), returnValue: z.union([z.literal("attribute"), z.literal("html"), z.literal("text"), z.literal("value"), expressionSchema]).optional(), attribute: stringOrExpression.optional(), skipSelectors: stringOrExpression.optional(), returnArray: booleanOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "operation": ["extractHtmlContent"] } }, defaults: { "operation": "generateHtmlTemplate" } }),
    options: resolveSchema({ parameters, schema: z.object({ trimValues: booleanOrExpression.optional(), cleanUpText: booleanOrExpression.optional(), capitalize: booleanOrExpression.optional(), customStyling: booleanOrExpression.optional(), caption: stringOrExpression.optional(), tableAttributes: stringOrExpression.optional(), headerAttributes: stringOrExpression.optional(), rowAttributes: stringOrExpression.optional(), cellAttributes: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["extractHtmlContent", "convertToHtmlTable"] } }, defaults: { "operation": "generateHtmlTemplate" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
