// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bitbucketTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("password"), z.literal("accessToken"), expressionSchema]).optional(),
    resource: z.union([z.literal("repository"), z.literal("workspace")]).optional(),
    workspace: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "resource": ["workspace", "repository"] } }, defaults: { "resource": "workspace" } }),
    events: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "show": { "resource": ["workspace", "repository"] } }, defaults: { "resource": "workspace" } }),
    repository: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "resource": ["repository"] } }, defaults: { "resource": "workspace" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
