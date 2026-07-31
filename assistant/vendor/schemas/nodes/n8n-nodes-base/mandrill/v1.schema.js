var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mandrill/v1/resource_message/operation_send_html.schema.js
var require_operation_send_html_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mandrill/v1/resource_message/operation_send_html.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendHtml"),
          fromEmail: stringOrExpression.optional(),
          toEmail: stringOrExpression.optional(),
          jsonParameters: booleanOrExpression.optional(),
          options: z.object({ async: booleanOrExpression.optional(), autoText: booleanOrExpression.optional(), autoHtml: booleanOrExpression.optional(), bccAddress: stringOrExpression.optional(), fromName: stringOrExpression.optional(), googleAnalyticsCampaign: stringOrExpression.optional(), googleAnalyticsDomains: stringOrExpression.optional(), html: stringOrExpression.optional(), important: booleanOrExpression.optional(), inlineCss: booleanOrExpression.optional(), ipPool: stringOrExpression.optional(), preserveRecipients: booleanOrExpression.optional(), returnPathDomain: stringOrExpression.optional(), sendAt: stringOrExpression.optional(), signingDomain: stringOrExpression.optional(), subAccount: stringOrExpression.optional(), subject: stringOrExpression.optional(), tags: stringOrExpression.optional(), text: stringOrExpression.optional(), trackClicks: booleanOrExpression.optional(), trackOpens: booleanOrExpression.optional(), trackingDomain: stringOrExpression.optional(), urlStripQs: booleanOrExpression.optional(), viewContentLink: booleanOrExpression.optional() }).optional(),
          mergeVarsJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          mergeVarsUi: resolveSchema({ parameters, schema: z.object({ mergeVarsValues: z.array(z.object({ name: stringOrExpression.optional(), content: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          metadataUi: resolveSchema({ parameters, schema: z.object({ metadataValues: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          metadataJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          attachmentsJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          attachmentsUi: resolveSchema({ parameters, schema: z.object({ attachmentsValues: z.array(z.object({ type: stringOrExpression.optional(), name: stringOrExpression.optional(), content: stringOrExpression.optional() })).optional(), attachmentsBinary: z.array(z.object({ property: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          headersJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          headersUi: resolveSchema({ parameters, schema: z.object({ headersValues: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mandrill/v1/resource_message/operation_send_template.schema.js
var require_operation_send_template_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mandrill/v1/resource_message/operation_send_template.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendTemplate").default("sendTemplate"),
          template: stringOrExpression.optional(),
          fromEmail: stringOrExpression.optional(),
          toEmail: stringOrExpression.optional(),
          jsonParameters: booleanOrExpression.optional(),
          options: z.object({ async: booleanOrExpression.optional(), autoText: booleanOrExpression.optional(), autoHtml: booleanOrExpression.optional(), bccAddress: stringOrExpression.optional(), fromName: stringOrExpression.optional(), googleAnalyticsCampaign: stringOrExpression.optional(), googleAnalyticsDomains: stringOrExpression.optional(), html: stringOrExpression.optional(), important: booleanOrExpression.optional(), inlineCss: booleanOrExpression.optional(), ipPool: stringOrExpression.optional(), preserveRecipients: booleanOrExpression.optional(), returnPathDomain: stringOrExpression.optional(), sendAt: stringOrExpression.optional(), signingDomain: stringOrExpression.optional(), subAccount: stringOrExpression.optional(), subject: stringOrExpression.optional(), tags: stringOrExpression.optional(), text: stringOrExpression.optional(), trackClicks: booleanOrExpression.optional(), trackOpens: booleanOrExpression.optional(), trackingDomain: stringOrExpression.optional(), urlStripQs: booleanOrExpression.optional(), viewContentLink: booleanOrExpression.optional() }).optional(),
          mergeVarsJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          mergeVarsUi: resolveSchema({ parameters, schema: z.object({ mergeVarsValues: z.array(z.object({ name: stringOrExpression.optional(), content: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          metadataUi: resolveSchema({ parameters, schema: z.object({ metadataValues: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          metadataJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          attachmentsJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          attachmentsUi: resolveSchema({ parameters, schema: z.object({ attachmentsValues: z.array(z.object({ type: stringOrExpression.optional(), name: stringOrExpression.optional(), content: stringOrExpression.optional() })).optional(), attachmentsBinary: z.array(z.object({ property: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          headersJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          headersUi: resolveSchema({ parameters, schema: z.object({ headersValues: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mandrill/v1/resource_message/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mandrill/v1/resource_message/index.schema.js"(exports2, module2) {
    var getSendHtmlSchema = require_operation_send_html_schema();
    var getSendTemplateSchema = require_operation_send_template_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "sendTemplate" } : parameters;
      return z.union([
        getSendHtmlSchema({ ...helpers, parameters: effectiveParams }),
        getSendTemplateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mandrill/v1/index.schema.js
var getMessageSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "message" } : parameters;
  return getMessageSchema({ ...helpers, parameters: effectiveParams });
};
