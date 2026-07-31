// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProjectTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    events: z.array(z.union([z.literal("*"), z.literal("alert_create"), z.literal("alert_delete"), z.literal("alert_update"), z.literal("case_create"), z.literal("case_delete"), z.literal("case_update"), z.literal("comment_create"), z.literal("comment_delete"), z.literal("comment_update"), z.literal("observable_create"), z.literal("observable_delete"), z.literal("observable_update"), z.literal("page_create"), z.literal("page_delete"), z.literal("page_update"), z.literal("task_create"), z.literal("task_update"), z.literal("log_create"), z.literal("log_delete"), z.literal("log_update")])).optional(),
    filters: z.object({ values: z.array(z.object({ field: stringOrExpression.optional(), operator: z.union([z.literal("equal"), z.literal("notEqual"), z.literal("includes"), expressionSchema]).optional(), value: stringOrExpression.optional() })).optional() }).optional(),
    options: z.object({ outputOnlyData: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
