// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/retrieverWorkflow/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas }) {
  const parametersSchema = z.object({
    source: z.union([z.literal("database"), z.literal("parameter"), expressionSchema]).optional(),
    workflowId: resolveSchema({ parameters, schema: stringOrExpression, required: true, displayOptions: { "show": { "source": ["database"] } }, defaults: { "source": "database" } }),
    workflowJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "source": ["parameter"] } }, defaults: { "source": "database" } }),
    fields: z.object({ values: z.array(z.object({ name: stringOrExpression.optional(), type: z.union([z.literal("stringValue"), z.literal("numberValue"), z.literal("booleanValue"), z.literal("arrayValue"), z.literal("objectValue"), expressionSchema]).optional(), stringValue: stringOrExpression.optional(), numberValue: stringOrExpression.optional(), booleanValue: z.union([z.literal("true"), z.literal("false"), expressionSchema]).optional(), arrayValue: stringOrExpression.optional(), objectValue: z.union([iDataObjectSchema, z.string()]).optional() })).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
