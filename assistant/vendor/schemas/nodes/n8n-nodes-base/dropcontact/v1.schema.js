// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/dropcontact/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    resource: z.union([z.literal("contact")]).optional(),
    operation: z.union([z.literal("enrich"), z.literal("fetchRequest")]).optional(),
    requestId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "resource": ["contact"], "operation": ["fetchRequest"] } }, defaults: { "resource": "contact", "operation": "enrich" } }),
    email: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "resource": ["contact"], "operation": ["enrich"] } }, defaults: { "resource": "contact", "operation": "enrich" } }),
    simplify: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "resource": ["contact"], "operation": ["enrich"] } }, defaults: { "resource": "contact", "operation": "enrich" } }),
    additionalFields: resolveSchema({ parameters, schema: z.object({ num_siren: stringOrExpression.optional(), siret: stringOrExpression.optional(), company: stringOrExpression.optional(), country: stringOrExpression.optional(), first_name: stringOrExpression.optional(), full_name: stringOrExpression.optional(), last_name: stringOrExpression.optional(), linkedin: stringOrExpression.optional(), phone: stringOrExpression.optional(), website: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "resource": ["contact"], "operation": ["enrich"] } }, defaults: { "resource": "contact", "operation": "enrich" } }),
    options: resolveSchema({ parameters, schema: z.object({ waitTime: numberOrExpression.optional(), siren: booleanOrExpression.optional(), language: z.union([z.literal("en"), z.literal("fr"), expressionSchema]).optional() }), required: false, displayOptions: { "show": { "resource": ["contact"], "operation": ["enrich"] } }, defaults: { "resource": "contact", "operation": "enrich" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
