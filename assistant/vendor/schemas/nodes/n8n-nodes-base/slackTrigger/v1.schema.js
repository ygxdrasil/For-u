// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/slackTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    authentication: z.unknown().optional(),
    trigger: z.array(z.union([z.literal("any_event"), z.literal("app_mention"), z.literal("file_public"), z.literal("file_share"), z.literal("message"), z.literal("channel_created"), z.literal("team_join"), z.literal("reaction_added")])).optional(),
    watchWorkspace: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "trigger": ["any_event", "message", "reaction_added", "file_share", "app_mention"] } }, defaults: { "trigger": [] } }),
    channelId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id"), z.literal("url")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "watchWorkspace": [false] } }, defaults: { "watchWorkspace": false } }),
    downloadFiles: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "trigger": ["any_event", "file_share"] } }, defaults: { "trigger": [] } }),
    options: z.object({ resolveIds: booleanOrExpression.optional(), userIds: z.array(z.string()).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
