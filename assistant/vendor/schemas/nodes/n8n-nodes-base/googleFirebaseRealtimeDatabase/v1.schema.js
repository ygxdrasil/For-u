// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleFirebaseRealtimeDatabase/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    projectId: stringOrExpression.optional(),
    operation: z.union([z.literal("create"), z.literal("delete"), z.literal("get"), z.literal("push"), z.literal("update")]).optional(),
    path: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["get"] }, "hide": { "operation": ["get"] } }, defaults: { "operation": "create" } }),
    attributes: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["create", "push", "update"] } }, defaults: { "operation": "create" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
