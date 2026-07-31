// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/awsRekognition/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("iam"), z.literal("assumeRole"), expressionSchema]).optional(),
    resource: z.union([z.literal("image")]).optional(),
    operation: z.union([z.literal("analyze")]).optional(),
    type: resolveSchema({ parameters, schema: z.union([z.literal("detectFaces"), z.literal("detectLabels"), z.literal("detectModerationLabels"), z.literal("detectText"), z.literal("recognizeCelebrity"), expressionSchema]), required: false, displayOptions: { "show": { "operation": ["analyze"], "resource": ["image"] } }, defaults: { "operation": "analyze", "resource": "image" } }),
    binaryData: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["analyze"], "resource": ["image"] } }, defaults: { "operation": "analyze", "resource": "image" } }),
    binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["analyze"], "resource": ["image"], "binaryData": [true] } }, defaults: { "operation": "analyze", "resource": "image", "binaryData": false } }),
    bucket: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["analyze"], "resource": ["image"], "binaryData": [false] } }, defaults: { "operation": "analyze", "resource": "image", "binaryData": false } }),
    name: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["analyze"], "resource": ["image"], "binaryData": [false] } }, defaults: { "operation": "analyze", "resource": "image", "binaryData": false } }),
    additionalFields: resolveSchema({ parameters, schema: z.object({ regionsOfInterestUi: z.unknown().optional(), version: stringOrExpression.optional(), wordFilterUi: z.unknown().optional(), maxLabels: numberOrExpression.optional(), minConfidence: numberOrExpression.optional(), attributes: z.array(z.union([z.literal("all"), z.literal("default")])).optional() }), required: false, displayOptions: { "show": { "operation": ["analyze"], "resource": ["image"] } }, defaults: { "operation": "analyze", "resource": "image" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
