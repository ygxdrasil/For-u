// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/emailReadImap/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    mailbox: stringOrExpression.optional(),
    postProcessAction: z.union([z.literal("read"), z.literal("nothing"), expressionSchema]).optional(),
    downloadAttachments: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "format": ["simple"] } }, defaults: { "format": "simple" } }),
    format: z.union([z.literal("raw"), z.literal("resolved"), z.literal("simple"), expressionSchema]).optional(),
    dataPropertyAttachmentsPrefixName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "format": ["resolved", "simple"], "downloadAttachments": [true] } }, defaults: { "format": "simple", "downloadAttachments": false } }),
    options: z.object({ customEmailConfig: stringOrExpression.optional(), allowUnauthorizedCerts: booleanOrExpression.optional(), forceReconnect: numberOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
