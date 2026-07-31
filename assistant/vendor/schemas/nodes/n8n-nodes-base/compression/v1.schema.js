// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/compression/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("compress"), z.literal("decompress")]).optional(),
    binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["compress", "decompress"] } }, defaults: { "operation": "decompress" } }),
    outputFormat: resolveSchema({ parameters, schema: z.union([z.literal("gzip"), z.literal("zip"), expressionSchema]), required: false, displayOptions: { "show": { "operation": ["compress"] } }, defaults: { "operation": "decompress" } }),
    fileName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["compress"], "outputFormat": ["zip"] } }, defaults: { "operation": "decompress", "outputFormat": "" } }),
    binaryPropertyOutput: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "outputFormat": ["zip"], "operation": ["compress"] } }, defaults: { "outputFormat": "", "operation": "decompress" } }),
    outputPrefix: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["compress", "decompress"], "outputFormat": ["gzip"] } }, defaults: { "operation": "decompress", "outputFormat": "" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
