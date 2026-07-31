// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ldap/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("compare"), z.literal("create"), z.literal("delete"), z.literal("rename"), z.literal("search"), z.literal("update")]).optional(),
    nodeDebug: z.boolean().optional(),
    dn: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["compare", "create", "delete", "rename", "modify", "update"] } }, defaults: { "operation": "search" } }),
    id: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["compare"] } }, defaults: { "operation": "search" } }),
    value: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["compare"] } }, defaults: { "operation": "search" } }),
    targetDn: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["rename"] } }, defaults: { "operation": "search" } }),
    attributes: resolveSchema({ parameters, schema: z.object({ attribute: z.array(z.object({ id: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional(), add: z.array(z.object({ id: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional(), replace: z.array(z.object({ id: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional(), "delete": z.array(z.object({ id: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "operation": ["create", "update"] } }, defaults: { "operation": "search" } }),
    baseDN: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["search"] } }, defaults: { "operation": "search" } }),
    searchFor: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["search"] } }, defaults: { "operation": "search" } }),
    customFilter: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["search"], "searchFor": ["custom"] } }, defaults: { "operation": "search", "searchFor": [] } }),
    attribute: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["search"] }, "hide": { "searchFor": ["custom"] } }, defaults: { "operation": "search", "searchFor": [] } }),
    searchText: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["search"] }, "hide": { "searchFor": ["custom"] } }, defaults: { "operation": "search", "searchFor": [] } }),
    returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["search"] } }, defaults: { "operation": "search" } }),
    limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "operation": ["search"], "returnAll": [false] } }, defaults: { "operation": "search", "returnAll": false } }),
    options: resolveSchema({ parameters, schema: z.object({ attributes: z.array(z.string()).optional(), pageSize: numberOrExpression.optional(), scope: z.union([z.literal("base"), z.literal("one"), z.literal("sub"), expressionSchema]).optional() }), required: false, displayOptions: { "show": { "operation": ["search"] } }, defaults: { "operation": "search" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
