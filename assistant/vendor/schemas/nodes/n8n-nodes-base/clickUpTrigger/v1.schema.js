// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/clickUpTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
    team: stringOrExpression.optional(),
    events: z.array(z.union([z.literal("*"), z.literal("folderCreated"), z.literal("folderDeleted"), z.literal("folderUpdated"), z.literal("goalCreated"), z.literal("goalDeleted"), z.literal("goalUpdated"), z.literal("keyResultCreated"), z.literal("keyResultDelete"), z.literal("keyResultUpdated"), z.literal("listCreated"), z.literal("listDeleted"), z.literal("listUpdated"), z.literal("spaceCreated"), z.literal("spaceDeleted"), z.literal("spaceUpdated"), z.literal("taskAssigneeUpdated"), z.literal("taskCommentPosted"), z.literal("taskCommentUpdated"), z.literal("taskCreated"), z.literal("taskDeleted"), z.literal("taskDueDateUpdated"), z.literal("taskMoved"), z.literal("taskStatusUpdated"), z.literal("taskTagUpdated"), z.literal("taskTimeEstimateUpdated"), z.literal("taskTimeTrackedUpdated"), z.literal("taskUpdated")])).optional(),
    filters: z.object({ folderId: stringOrExpression.optional(), listId: stringOrExpression.optional(), spaceId: stringOrExpression.optional(), taskId: stringOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
