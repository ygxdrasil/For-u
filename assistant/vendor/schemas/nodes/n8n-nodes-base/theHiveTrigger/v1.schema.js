// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    events: z.array(z.union([z.literal("*"), z.literal("alert_create"), z.literal("alert_delete"), z.literal("alert_update"), z.literal("case_create"), z.literal("case_delete"), z.literal("case_update"), z.literal("case_task_log_create"), z.literal("case_task_log_delete"), z.literal("case_task_log_update"), z.literal("case_artifact_create"), z.literal("case_artifact_delete"), z.literal("case_artifact_update"), z.literal("case_task_create"), z.literal("case_task_delete"), z.literal("case_task_update")])).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
