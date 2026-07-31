// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/filemaker/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    action: z.union([z.literal("create"), z.literal("delete"), z.literal("duplicate"), z.literal("edit"), z.literal("find"), z.literal("records"), z.literal("record"), z.literal("performscript"), expressionSchema]).optional(),
    layout: stringOrExpression.optional(),
    recid: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "action": ["record", "edit", "delete", "duplicate"] } }, defaults: { "action": "record" } }),
    offset: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "action": ["find", "records"] } }, defaults: { "action": "record" } }),
    limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "action": ["find", "records"] } }, defaults: { "action": "record" } }),
    getPortals: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "action": ["record", "records", "find"] } }, defaults: { "action": "record" } }),
    portals: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["record", "records", "find"], "getPortals": [true] } }, defaults: { "action": "record", "getPortals": false } }),
    responseLayout: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["find"] } }, defaults: { "action": "record" } }),
    queries: resolveSchema({ parameters, schema: z.object({ query: z.array(z.object({ fields: z.unknown().optional(), omit: booleanOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "action": ["find"] } }, defaults: { "action": "record" } }),
    setSort: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "action": ["find", "record", "records"] } }, defaults: { "action": "record" } }),
    sortParametersUi: resolveSchema({ parameters, schema: z.object({ rules: z.array(z.object({ name: stringOrExpression.optional(), value: z.union([z.literal("ascend"), z.literal("descend"), expressionSchema]).optional() })).optional() }), required: false, displayOptions: { "show": { "setSort": [true], "action": ["find", "records"] } }, defaults: { "setSort": false, "action": "record" } }),
    setScriptBefore: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "action": ["find", "record", "records"] } }, defaults: { "action": "record" } }),
    scriptBefore: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["find", "record", "records"], "setScriptBefore": [true] } }, defaults: { "action": "record", "setScriptBefore": false } }),
    scriptBeforeParam: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["find", "record", "records"], "setScriptBefore": [true] } }, defaults: { "action": "record", "setScriptBefore": false } }),
    setScriptSort: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "action": ["find", "record", "records"] } }, defaults: { "action": "record" } }),
    scriptSort: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["find", "record", "records"], "setScriptSort": [true] } }, defaults: { "action": "record", "setScriptSort": false } }),
    scriptSortParam: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["find", "record", "records"], "setScriptSort": [true] } }, defaults: { "action": "record", "setScriptSort": false } }),
    setScriptAfter: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "action": ["find", "record", "records"] } }, defaults: { "action": "record" } }),
    scriptAfter: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["find", "record", "records"], "setScriptAfter": [true] } }, defaults: { "action": "record", "setScriptAfter": false } }),
    scriptAfterParam: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["find", "record", "records"], "setScriptAfter": [true] } }, defaults: { "action": "record", "setScriptAfter": false } }),
    modId: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "action": ["edit"] } }, defaults: { "action": "record" } }),
    fieldsParametersUi: resolveSchema({ parameters, schema: z.object({ fields: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "action": ["create", "edit"] } }, defaults: { "action": "record" } }),
    script: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["performscript"] } }, defaults: { "action": "record" } }),
    scriptParam: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "action": ["performscript"] } }, defaults: { "action": "record" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
