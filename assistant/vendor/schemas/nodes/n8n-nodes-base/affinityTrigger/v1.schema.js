// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/affinityTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    events: z.array(z.union([z.literal("field_value.created"), z.literal("field_value.deleted"), z.literal("field_value.updated"), z.literal("field.created"), z.literal("field.deleted"), z.literal("field.updated"), z.literal("file.created"), z.literal("file.deleted"), z.literal("list_entry.created"), z.literal("list_entry.deleted"), z.literal("list.created"), z.literal("list.deleted"), z.literal("list.updated"), z.literal("note.created"), z.literal("note.deleted"), z.literal("note.updated"), z.literal("opportunity.created"), z.literal("opportunity.deleted"), z.literal("opportunity.updated"), z.literal("organization.created"), z.literal("organization.deleted"), z.literal("organization.updated"), z.literal("person.created"), z.literal("person.deleted"), z.literal("person.updated")])).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
