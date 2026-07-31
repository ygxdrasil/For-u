// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/executeWorkflow/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.unknown().optional(),
    source: z.union([z.literal("database"), z.literal("localFile"), z.literal("parameter"), z.literal("url"), expressionSchema]).optional(),
    workflowId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["database"] } }, defaults: { "source": "database" } }),
    workflowPath: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["localFile"] } }, defaults: { "source": "database" } }),
    workflowJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "source": ["parameter"] } }, defaults: { "source": "database" } }),
    workflowUrl: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["url"] } }, defaults: { "source": "database" } }),
    mode: z.union([z.literal("once"), z.literal("each")]).optional(),
    options: z.object({ waitForSubWorkflow: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
