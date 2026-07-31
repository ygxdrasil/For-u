// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/lmChatAwsBedrock/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
    model: resolveOneOfSchemas({ parameters, variants: [{ schema: stringOrExpression, required: false, displayOptions: { "hide": { "modelSource": ["inferenceProfile"] } } }, { schema: stringOrExpression, required: false, displayOptions: { "show": { "modelSource": ["inferenceProfile"] } } }] }),
    options: z.object({ maxTokensToSample: numberOrExpression.optional(), temperature: numberOrExpression.optional(), topP: numberOrExpression.optional(), maxRetries: numberOrExpression.optional(), timeout: numberOrExpression.optional(), additionalModelRequestFields: z.union([iDataObjectSchema, z.string()]).optional(), latency: z.union([z.literal("standard"), z.literal("optimized"), expressionSchema]).optional(), guardrail: z.object({ values: z.object({ guardrailIdentifier: stringOrExpression.optional(), guardrailVersion: stringOrExpression.optional(), trace: z.union([z.literal("disabled"), z.literal("enabled"), z.literal("enabled_full"), expressionSchema]).optional() }).optional() }).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
