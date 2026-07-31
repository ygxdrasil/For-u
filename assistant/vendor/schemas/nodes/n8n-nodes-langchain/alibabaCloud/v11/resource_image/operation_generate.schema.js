/**
 * Qwen Cloud Node - Version 1.1 - Zod Schema
 * Discriminator: resource=image, operation=generate
 *
 * Use .parse() for strict validation or .safeParse() for error handling.
 *
 * Schema helpers (z, expressionSchema, etc.) are passed as parameters
 * by the schema-validator, not imported from external files.
 *
 * @generated - CommonJS JavaScript for runtime loading
 */

module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, toolInstanceSchema }) {

  // Static subnode schema
  const subnodesSchema = z.object({
    tools: z.array(toolInstanceSchema).optional(),
  }).strict();

  return z.object({
    parameters: z.object({
      resource: z.literal('image'),
      operation: z.literal('generate'),
      modelId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal('list'), z.literal('id')]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
      prompt: stringOrExpression,
      downloadImage: booleanOrExpression.optional(),
      imageOptions: z.object({ size: z.union([z.union([z.literal('1024*1024'), z.literal('720*1280'), z.literal('1280*720'), expressionSchema]), z.union([z.literal('1104*1472'), z.literal('1328*1328'), z.literal('1472*1104'), z.literal('1664*928'), z.literal('928*1664'), expressionSchema])]).optional(), promptExtend: booleanOrExpression.optional() }).optional(),
    }).optional(),
    subnodes: subnodesSchema.optional(),
  });
};