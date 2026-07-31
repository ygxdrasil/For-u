// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/totp/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("generateSecret")]).optional(),
    options: resolveSchema({ parameters, schema: z.object({ algorithm: z.union([z.literal("SHA1"), z.literal("SHA224"), z.literal("SHA256"), z.literal("SHA3-224"), z.literal("SHA3-256"), z.literal("SHA3-384"), z.literal("SHA3-512"), z.literal("SHA384"), z.literal("SHA512"), expressionSchema]).optional(), digits: numberOrExpression.optional(), period: numberOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["generateSecret"] } }, defaults: { "operation": "generateSecret" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
