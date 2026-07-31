/**
 * OpenAI Chat Model Node - Version 1 - Zod Validation Schemas
 *
 * These schemas validate node configuration at runtime.
 * Use .parse() for strict validation or .safeParse() for error handling.
 *
 * Schema helpers (z, expressionSchema, etc.) are passed as parameters
 * by the schema-validator, not imported from external files.
 *
 * @generated - CommonJS JavaScript for runtime loading
 */

module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas }) {

  // Parameters schema
  const parametersSchema = z.object({
    model: stringOrExpression.optional(),
    options: z.object({ baseURL: stringOrExpression.optional(), frequencyPenalty: numberOrExpression.optional(), maxTokens: numberOrExpression.optional(), responseFormat: z.union([z.literal('text'), z.literal('json_object'), expressionSchema]).optional(), textFormat: z.object({ textOptions: z.object({ type: z.union([z.literal('text'), z.literal('json_schema'), z.literal('json_object'), expressionSchema]).optional(), verbosity: z.union([z.literal('low'), z.literal('medium'), z.literal('high'), expressionSchema]).optional(), name: stringOrExpression.optional(), schema: z.union([iDataObjectSchema, z.string()]).optional(), description: stringOrExpression.optional(), strict: booleanOrExpression.optional() }).optional() }).optional(), presencePenalty: numberOrExpression.optional(), temperature: numberOrExpression.optional(), reasoningEffort: z.union([z.literal('low'), z.literal('medium'), z.literal('high'), expressionSchema]).optional(), timeout: numberOrExpression.optional(), maxRetries: numberOrExpression.optional(), topP: numberOrExpression.optional(), conversationId: stringOrExpression.optional(), promptCacheKey: stringOrExpression.optional(), safetyIdentifier: stringOrExpression.optional(), serviceTier: z.union([z.literal('auto'), z.literal('flex'), z.literal('default'), z.literal('priority'), expressionSchema]).optional(), metadata: z.union([iDataObjectSchema, z.string()]).optional(), topLogprobs: numberOrExpression.optional(), promptConfig: z.object({ promptOptions: z.object({ promptId: stringOrExpression.optional(), version: stringOrExpression.optional(), variables: z.union([iDataObjectSchema, z.string()]).optional() }).optional() }).optional() }).optional(),
  });

  // Return combined config schema
  return z.object({
    parameters: parametersSchema.nullable().optional(),
  });
};