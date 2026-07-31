// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/facebookTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    appId: stringOrExpression.optional(),
    object: z.union([z.literal("adAccount"), z.literal("application"), z.literal("certificateTransparency"), z.literal("group"), z.literal("instagram"), z.literal("link"), z.literal("page"), z.literal("permissions"), z.literal("user"), z.literal("whatsappBusinessAccount"), z.literal("workplaceSecurity"), expressionSchema]).optional(),
    fields: z.array(z.string()).optional(),
    options: z.object({ includeValues: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
