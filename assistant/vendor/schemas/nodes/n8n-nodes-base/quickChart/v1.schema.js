// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/quickChart/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    chartType: z.union([z.literal("bar"), z.literal("doughnut"), z.literal("line"), z.literal("pie"), z.literal("polarArea"), expressionSchema]).optional(),
    labelsMode: z.union([z.literal("manually"), z.literal("array"), expressionSchema]).optional(),
    labelsUi: resolveSchema({ parameters, schema: z.object({ labelsValues: z.array(z.object({ label: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "labelsMode": ["manually"] } }, defaults: { "labelsMode": "manually" } }),
    labelsArray: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "labelsMode": ["array"] } }, defaults: { "labelsMode": "manually" } }),
    data: z.union([iDataObjectSchema, z.string()]).optional(),
    output: stringOrExpression.optional(),
    chartOptions: z.object({ backgroundColor: stringOrExpression.optional(), devicePixelRatio: numberOrExpression.optional(), format: z.union([z.literal("png"), z.literal("pdf"), z.literal("svg"), z.literal("webp"), expressionSchema]).optional(), height: numberOrExpression.optional(), horizontal: booleanOrExpression.optional(), width: numberOrExpression.optional() }).optional(),
    datasetOptions: z.object({ backgroundColor: stringOrExpression.optional(), borderColor: stringOrExpression.optional(), fill: booleanOrExpression.optional(), label: stringOrExpression.optional(), pointStyle: z.union([z.literal("circle"), z.literal("cross"), z.literal("crossRot"), z.literal("dash"), z.literal("line"), z.literal("rect"), z.literal("rectRot"), z.literal("rectRounded"), z.literal("star"), z.literal("triangle"), expressionSchema]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
