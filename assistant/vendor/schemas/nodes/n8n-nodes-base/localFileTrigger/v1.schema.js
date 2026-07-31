// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/localFileTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    triggerOn: z.union([z.literal("file"), z.literal("folder"), expressionSchema]).optional(),
    path: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "triggerOn": ["file", "folder"] } }, defaults: { "triggerOn": "" } }),
    events: resolveSchema({ parameters, schema: z.array(z.union([z.literal("add"), z.literal("change"), z.literal("unlink"), z.literal("addDir"), z.literal("unlinkDir")])), required: false, displayOptions: { "show": { "triggerOn": ["folder"] } }, defaults: { "triggerOn": "" } }),
    options: z.object({ awaitWriteFinish: booleanOrExpression.optional(), followSymlinks: booleanOrExpression.optional(), ignored: stringOrExpression.optional(), ignoreInitial: booleanOrExpression.optional(), depth: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(0), z.literal(-1), expressionSchema]).optional(), usePolling: booleanOrExpression.optional(), ignoreMode: z.union([z.literal("match"), z.literal("contain"), expressionSchema]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
