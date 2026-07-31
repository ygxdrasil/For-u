// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/koBoToolboxTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    formId: stringOrExpression.optional(),
    triggerOn: z.union([z.literal("formSubmission"), expressionSchema]).optional(),
    formatOptions: z.object({ download: booleanOrExpression.optional(), binaryNamingScheme: z.union([z.literal("sequence"), z.literal("question"), expressionSchema]).optional(), dataPropertyAttachmentsPrefixName: stringOrExpression.optional(), version: z.union([z.literal("download_url"), z.literal("download_small_url"), z.literal("download_medium_url"), z.literal("download_large_url"), expressionSchema]).optional(), selectMask: stringOrExpression.optional(), numberMask: stringOrExpression.optional(), reformat: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
