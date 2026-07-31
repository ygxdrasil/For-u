var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailjet/v1/resource_email/operation_send.schema.js
var require_operation_send_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailjet/v1/resource_email/operation_send.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("email").default("email"),
          operation: z.literal("send").default("send"),
          fromEmail: stringOrExpression.optional(),
          toEmail: stringOrExpression.optional(),
          subject: stringOrExpression.optional(),
          text: stringOrExpression.optional(),
          html: stringOrExpression.optional(),
          jsonParameters: booleanOrExpression.optional(),
          additionalFields: z.object({ bccEmail: stringOrExpression.optional(), ccAddresses: stringOrExpression.optional(), fromName: stringOrExpression.optional(), priority: numberOrExpression.optional(), replyTo: stringOrExpression.optional(), templateLanguage: booleanOrExpression.optional(), trackClicks: z.union([z.literal("account_default"), z.literal("disabled"), z.literal("enabled"), expressionSchema]).optional(), trackOpens: z.union([z.literal("account_default"), z.literal("disabled"), z.literal("enabled"), expressionSchema]).optional(), customCampaign: stringOrExpression.optional(), deduplicateCampaign: booleanOrExpression.optional() }).optional(),
          variablesJson: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          variablesUi: resolveSchema({ parameters, schema: z.object({ variablesValues: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailjet/v1/resource_email/operation_send_template.schema.js
var require_operation_send_template_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailjet/v1/resource_email/operation_send_template.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("email").default("email"),
          operation: z.literal("sendTemplate"),
          subject: stringOrExpression.optional(),
          fromEmail: stringOrExpression.optional(),
          toEmail: stringOrExpression.optional(),
          templateId: stringOrExpression.optional(),
          jsonParameters: booleanOrExpression.optional(),
          additionalFields: z.object({ bccEmail: stringOrExpression.optional(), ccEmail: stringOrExpression.optional(), fromName: stringOrExpression.optional(), priority: numberOrExpression.optional(), replyTo: stringOrExpression.optional(), subject: stringOrExpression.optional(), templateLanguage: booleanOrExpression.optional(), trackClicks: stringOrExpression.optional(), trackOpens: stringOrExpression.optional(), customCampaign: stringOrExpression.optional(), deduplicateCampaign: booleanOrExpression.optional() }).optional(),
          variablesUi: resolveSchema({ parameters, schema: z.object({ variablesValues: z.array(z.object({ name: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          variablesJson: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailjet/v1/resource_email/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailjet/v1/resource_email/index.schema.js"(exports2, module2) {
    var getSendSchema = require_operation_send_schema();
    var getSendTemplateSchema = require_operation_send_template_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "send" } : parameters;
      return z.union([
        getSendSchema({ ...helpers, parameters: effectiveParams }),
        getSendTemplateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailjet/v1/resource_sms/operation_send.schema.js
var require_operation_send_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailjet/v1/resource_sms/operation_send.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("sms"),
          operation: z.literal("send").default("send"),
          subject: stringOrExpression.optional(),
          from: stringOrExpression.optional(),
          to: stringOrExpression.optional(),
          text: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailjet/v1/resource_sms/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailjet/v1/resource_sms/index.schema.js"(exports2, module2) {
    var getSendSchema = require_operation_send_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "send" } : parameters;
      return getSendSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/mailjet/v1/index.schema.js
var getEmailSchema = require_index_schema();
var getSmsSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "email" } : parameters;
  return z.union([
    getEmailSchema({ ...helpers, parameters: effectiveParams }),
    getSmsSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
