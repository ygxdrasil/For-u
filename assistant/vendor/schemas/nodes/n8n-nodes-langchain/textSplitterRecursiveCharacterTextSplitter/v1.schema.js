// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/textSplitterRecursiveCharacterTextSplitter/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    chunkSize: numberOrExpression.optional(),
    chunkOverlap: numberOrExpression.optional(),
    options: z.object({ splitCode: z.union([z.literal("cpp"), z.literal("go"), z.literal("java"), z.literal("js"), z.literal("php"), z.literal("proto"), z.literal("python"), z.literal("rst"), z.literal("ruby"), z.literal("rust"), z.literal("scala"), z.literal("swift"), z.literal("markdown"), z.literal("latex"), z.literal("html"), expressionSchema]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.nullable().optional()
  });
};
