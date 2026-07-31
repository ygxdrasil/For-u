// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/egoi/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    resource: z.union([z.literal("contact")]).optional(),
    operation: z.union([z.literal("create"), z.literal("get"), z.literal("getAll"), z.literal("update")]).optional(),
    list: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["getAll", "create", "update", "get"] } }, defaults: { "operation": "create" } }),
    email: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["create", "get"], "resource": ["contact"], "by": ["email"] } }, defaults: { "operation": "create", "resource": "contact", "by": "id" } }),
    contactId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "resource": ["contact"], "operation": ["update", "get"], "by": ["id"] } }, defaults: { "resource": "contact", "operation": "create", "by": "id" } }),
    resolveData: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["create", "update"] } }, defaults: { "operation": "create" } }),
    additionalFields: resolveSchema({ parameters, schema: z.object({ birth_date: stringOrExpression.optional(), cellphone: stringOrExpression.optional(), extraFieldsUi: z.unknown().optional(), first_name: stringOrExpression.optional(), last_name: stringOrExpression.optional(), status: z.union([z.literal("unconfirmed"), z.literal("active"), z.literal("inactive"), z.literal("removed"), expressionSchema]).optional(), tagIds: z.array(z.string()).optional() }), required: false, displayOptions: { "show": { "operation": ["create"], "resource": ["contact"] } }, defaults: { "operation": "create", "resource": "contact" } }),
    updateFields: resolveSchema({ parameters, schema: z.object({ birth_date: stringOrExpression.optional(), cellphone: stringOrExpression.optional(), email: stringOrExpression.optional(), extraFieldsUi: z.unknown().optional(), first_name: stringOrExpression.optional(), last_name: stringOrExpression.optional(), status: z.union([z.literal("unconfirmed"), z.literal("active"), z.literal("inactive"), z.literal("removed"), expressionSchema]).optional(), tagIds: z.array(z.string()).optional() }), required: false, displayOptions: { "show": { "operation": ["update"] } }, defaults: { "operation": "create" } }),
    by: resolveSchema({ parameters, schema: z.union([z.literal("id"), z.literal("email"), expressionSchema]), required: false, displayOptions: { "show": { "operation": ["get"], "resource": ["contact"] } }, defaults: { "operation": "create", "resource": "contact" } }),
    returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["getAll"], "resource": ["contact"] } }, defaults: { "operation": "create", "resource": "contact" } }),
    limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "operation": ["getAll"], "resource": ["contact"], "returnAll": [false] } }, defaults: { "operation": "create", "resource": "contact", "returnAll": false } }),
    simple: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["get", "getAll"], "resource": ["contact"] } }, defaults: { "operation": "create", "resource": "contact" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
