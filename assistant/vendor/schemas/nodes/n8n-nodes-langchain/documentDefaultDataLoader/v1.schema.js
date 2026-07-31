// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/documentDefaultDataLoader/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, textSplitterInstanceSchema }) {
  function getSubnodesSchema() {
    return z.object({
      textSplitter: resolveSchema({ parameters, schema: textSplitterInstanceSchema, required: true, displayOptions: { "show": { "textSplittingMode": ["custom"] } } })
    }).strict();
  }
  const parametersSchema = z.object({
    dataType: z.union([z.literal("json"), z.literal("binary")]).optional(),
    jsonMode: resolveSchema({ parameters, schema: z.union([z.literal("allInputData"), z.literal("expressionData"), expressionSchema]), required: false, displayOptions: { "show": { "dataType": ["json"] } }, defaults: { "dataType": "json" } }),
    binaryMode: resolveSchema({ parameters, schema: z.union([z.literal("allInputData"), z.literal("specificField"), expressionSchema]), required: false, displayOptions: { "show": { "dataType": ["binary"] } }, defaults: { "dataType": "json" } }),
    loader: resolveSchema({ parameters, schema: z.union([z.literal("auto"), z.literal("csvLoader"), z.literal("docxLoader"), z.literal("epubLoader"), z.literal("jsonLoader"), z.literal("pdfLoader"), z.literal("textLoader"), expressionSchema]), required: false, displayOptions: { "show": { "dataType": ["binary"] } }, defaults: { "dataType": "json" } }),
    jsonData: resolveSchema({ parameters, schema: stringOrExpression, required: true, displayOptions: { "show": { "dataType": ["json"], "jsonMode": ["expressionData"] } }, defaults: { "dataType": "json", "jsonMode": "allInputData" } }),
    binaryDataKey: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dataType": ["binary"] }, "hide": { "binaryMode": ["allInputData"] } }, defaults: { "dataType": "json", "binaryMode": "allInputData" } }),
    options: z.object({ pointers: stringOrExpression.optional(), separator: stringOrExpression.optional(), column: stringOrExpression.optional(), splitPages: booleanOrExpression.optional(), metadata: z.object({ metadataValues: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional(),
    subnodes: getSubnodesSchema().optional()
  });
};
