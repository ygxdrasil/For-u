// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/sendInBlueTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    type: z.union([z.literal("inbound"), z.literal("marketing"), z.literal("transactional"), expressionSchema]).optional(),
    events: resolveSchema({ parameters, schema: z.array(z.union([z.literal("blocked"), z.literal("click"), z.literal("deferred"), z.literal("delivered"), z.literal("hardBounce"), z.literal("invalid"), z.literal("spam"), z.literal("opened"), z.literal("request"), z.literal("softBounce"), z.literal("uniqueOpened"), z.literal("unsubscribed")])), required: false, displayOptions: { "show": { "type": ["transactional", "marketing", "inbound"] } }, defaults: { "type": "transactional" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
