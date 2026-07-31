// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/jwt/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("decode"), z.literal("sign"), z.literal("verify")]).optional(),
    useJson: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "operation": ["sign"] } }, defaults: { "operation": "sign" } }),
    claims: resolveSchema({ parameters, schema: z.object({ audience: stringOrExpression.optional(), expiresIn: numberOrExpression.optional(), issuer: stringOrExpression.optional(), jwtid: stringOrExpression.optional(), notBefore: numberOrExpression.optional(), subject: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "operation": ["sign"], "useJson": [false] } }, defaults: { "operation": "sign", "useJson": false } }),
    claimsJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "operation": ["sign"], "useJson": [true] } }, defaults: { "operation": "sign", "useJson": false } }),
    token: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "operation": ["verify", "decode"] } }, defaults: { "operation": "sign" } }),
    options: z.object({ complete: booleanOrExpression.optional(), ignoreExpiration: booleanOrExpression.optional(), ignoreNotBefore: booleanOrExpression.optional(), clockTolerance: numberOrExpression.optional(), kid: stringOrExpression.optional(), algorithm: z.union([z.literal("ES256"), z.literal("ES384"), z.literal("ES512"), z.literal("HS256"), z.literal("HS384"), z.literal("HS512"), z.literal("PS256"), z.literal("PS384"), z.literal("PS512"), z.literal("RS256"), z.literal("RS384"), z.literal("RS512"), expressionSchema]).optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
