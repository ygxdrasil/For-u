// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/readWriteFile/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("read"), z.literal("write")]).optional(),
    fileSelector: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["read"] } }, defaults: { "operation": "read" } }),
    options: resolveSchema({ parameters, schema: z.object({ fileExtension: stringOrExpression.optional(), fileName: stringOrExpression.optional(), mimeType: stringOrExpression.optional(), dataPropertyName: stringOrExpression.optional(), append: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["read", "write"] } }, defaults: { "operation": "read" } }),
    fileName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["write"] } }, defaults: { "operation": "read" } }),
    dataPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["write"] } }, defaults: { "operation": "read" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
