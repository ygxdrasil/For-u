// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebexTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    resource: z.union([z.literal("all"), z.literal("attachmentAction"), z.literal("meeting"), z.literal("membership"), z.literal("message"), z.literal("recording"), z.literal("room")]).optional(),
    event: resolveSchema({ parameters, schema: z.union([z.literal("created"), z.literal("deleted"), z.literal("updated"), z.literal("all"), expressionSchema]), required: false, displayOptions: { "show": { "resource": ["attachmentAction", "membership", "message", "room", "meeting", "recording", "telephonyCall", "all"] } }, defaults: { "resource": "meeting" } }),
    resolveData: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "resource": ["attachmentAction"] } }, defaults: { "resource": "meeting" } }),
    filters: z.object({ hasFiles: booleanOrExpression.optional(), isLocked: booleanOrExpression.optional(), isModerator: booleanOrExpression.optional(), mentionedPeople: stringOrExpression.optional(), messageId: stringOrExpression.optional(), ownedBy: stringOrExpression.optional(), personEmail: stringOrExpression.optional(), personEmail: stringOrExpression.optional(), personId: stringOrExpression.optional(), personId: stringOrExpression.optional(), personId: stringOrExpression.optional(), roomId: stringOrExpression.optional(), roomId: stringOrExpression.optional(), roomId: stringOrExpression.optional(), roomType: z.union([z.literal("direct"), z.literal("group"), expressionSchema]).optional(), type: z.union([z.literal("direct"), z.literal("group"), expressionSchema]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
