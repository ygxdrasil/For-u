// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ftp/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    protocol: z.union([z.literal("ftp"), z.literal("sftp"), expressionSchema]).optional(),
    operation: z.union([z.literal("delete"), z.literal("download"), z.literal("list"), z.literal("rename"), z.literal("upload")]).optional(),
    path: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["delete", "download", "upload", "list"] } }, defaults: { "operation": "download" } }),
    options: resolveSchema({ parameters, schema: z.object({ folder: booleanOrExpression.optional(), recursive: booleanOrExpression.optional(), timeout: numberOrExpression.optional(), enableConcurrentReads: booleanOrExpression.optional(), maxConcurrentReads: numberOrExpression.optional(), chunkSize: numberOrExpression.optional(), createDirectories: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["delete", "download", "rename", "upload", "list"] } }, defaults: { "operation": "download" } }),
    binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["download", "upload"], "binaryData": [true] } }, defaults: { "operation": "download", "binaryData": true } }),
    oldPath: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["rename"] } }, defaults: { "operation": "download" } }),
    newPath: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["rename"] } }, defaults: { "operation": "download" } }),
    binaryData: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["upload"] } }, defaults: { "operation": "download" } }),
    fileContent: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["upload"], "binaryData": [false] } }, defaults: { "operation": "download", "binaryData": true } }),
    recursive: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["list"] } }, defaults: { "operation": "download" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
