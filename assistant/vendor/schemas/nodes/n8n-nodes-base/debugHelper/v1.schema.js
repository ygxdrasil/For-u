// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/debugHelper/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    category: z.union([z.literal("doNothing"), z.literal("throwError"), z.literal("oom"), z.literal("randomData")]).optional(),
    throwErrorType: resolveSchema({ parameters, schema: z.union([z.literal("NodeApiError"), z.literal("NodeOperationError"), z.literal("Error")]), required: false, displayOptions: { "show": { "category": ["throwError"] } }, defaults: { "category": "throwError" } }),
    throwErrorMessage: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "category": ["throwError"] } }, defaults: { "category": "throwError" } }),
    memorySizeValue: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "category": ["oom"] } }, defaults: { "category": "throwError" } }),
    randomDataType: resolveSchema({ parameters, schema: z.union([z.literal("address"), z.literal("latLong"), z.literal("creditCard"), z.literal("email"), z.literal("ipv4"), z.literal("ipv6"), z.literal("macAddress"), z.literal("nanoid"), z.literal("url"), z.literal("user"), z.literal("uuid"), z.literal("semver")]), required: false, displayOptions: { "show": { "category": ["randomData"] } }, defaults: { "category": "throwError" } }),
    nanoidAlphabet: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "category": ["randomData"], "randomDataType": ["nanoid"] } }, defaults: { "category": "throwError", "randomDataType": "user" } }),
    nanoidLength: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "category": ["randomData"], "randomDataType": ["nanoid"] } }, defaults: { "category": "throwError", "randomDataType": "user" } }),
    randomDataSeed: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "category": ["randomData"] } }, defaults: { "category": "throwError" } }),
    randomDataCount: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "category": ["randomData"] } }, defaults: { "category": "throwError" } }),
    randomDataSingleArray: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "category": ["randomData"] } }, defaults: { "category": "throwError" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
