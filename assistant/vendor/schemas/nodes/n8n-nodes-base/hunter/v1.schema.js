// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hunter/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("domainSearch"), z.literal("emailFinder"), z.literal("emailVerifier")]).optional(),
    domain: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["domainSearch", "emailFinder"] } }, defaults: { "operation": "domainSearch" } }),
    onlyEmails: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["domainSearch"] } }, defaults: { "operation": "domainSearch" } }),
    returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["domainSearch"] } }, defaults: { "operation": "domainSearch" } }),
    limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "operation": ["domainSearch"], "returnAll": [false] } }, defaults: { "operation": "domainSearch", "returnAll": false } }),
    filters: resolveSchema({ parameters, schema: z.object({ type: z.union([z.literal("personal"), z.literal("generic"), expressionSchema]).optional(), seniority: z.array(z.union([z.literal("junior"), z.literal("senior"), z.literal("executive")])).optional(), department: z.array(z.union([z.literal("communication"), z.literal("executive"), z.literal("finance"), z.literal("hr"), z.literal("it"), z.literal("legal"), z.literal("management"), z.literal("marketing"), z.literal("sales"), z.literal("support")])).optional() }), required: false, displayOptions: { "show": { "operation": ["domainSearch"] } }, defaults: { "operation": "domainSearch" } }),
    firstname: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["emailFinder"] } }, defaults: { "operation": "domainSearch" } }),
    lastname: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["emailFinder"] } }, defaults: { "operation": "domainSearch" } }),
    email: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["emailVerifier"] } }, defaults: { "operation": "domainSearch" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
