// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/boxTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    events: z.array(z.union([z.literal("COLLABORATION.ACCEPTED"), z.literal("COLLABORATION.CREATED"), z.literal("COLLABORATION.REJECTED"), z.literal("COLLABORATION.REMOVED"), z.literal("COLLABORATION.UPDATED"), z.literal("COMMENT.CREATED"), z.literal("COMMENT.DELETED"), z.literal("COMMENT.UPDATED"), z.literal("FILE.COPIED"), z.literal("FILE.DELETED"), z.literal("FILE.DOWNLOADED"), z.literal("FILE.LOCKED"), z.literal("FILE.MOVED"), z.literal("FILE.PREVIEWED"), z.literal("FILE.RENAMED"), z.literal("FILE.RESTORED"), z.literal("FILE.TRASHED"), z.literal("FILE.UNLOCKED"), z.literal("FILE.UPLOADED"), z.literal("FOLDER.COPIED"), z.literal("FOLDER.CREATED"), z.literal("FOLDER.DELETED"), z.literal("FOLDER.DOWNLOADED"), z.literal("FOLDER.MOVED"), z.literal("FOLDER.RENAMED"), z.literal("FOLDER.RESTORED"), z.literal("FOLDER.TRASHED"), z.literal("METADATA_INSTANCE.CREATED"), z.literal("METADATA_INSTANCE.DELETED"), z.literal("METADATA_INSTANCE.UPDATED"), z.literal("SHARED_LINK.CREATED"), z.literal("SHARED_LINK.DELETED"), z.literal("SHARED_LINK.UPDATED"), z.literal("TASK_ASSIGNMENT.CREATED"), z.literal("TASK_ASSIGNMENT.UPDATED"), z.literal("WEBHOOK.DELETED")])).optional(),
    targetType: z.union([z.literal("file"), z.literal("folder"), expressionSchema]).optional(),
    targetId: stringOrExpression.optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
