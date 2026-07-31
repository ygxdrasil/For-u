// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/emailSend/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    fromEmail: stringOrExpression.optional(),
    toEmail: stringOrExpression.optional(),
    ccEmail: stringOrExpression.optional(),
    bccEmail: stringOrExpression.optional(),
    subject: stringOrExpression.optional(),
    text: stringOrExpression.optional(),
    html: stringOrExpression.optional(),
    attachments: stringOrExpression.optional(),
    options: z.object({ allowUnauthorizedCerts: booleanOrExpression.optional(), replyTo: stringOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
