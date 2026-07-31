var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/pushover/v1/resource_message/operation_push.schema.js
var require_operation_push_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/pushover/v1/resource_message/operation_push.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("push").default("push"),
          userKey: stringOrExpression.optional(),
          message: stringOrExpression.optional(),
          priority: z.union([z.literal(-2), z.literal(-1), z.literal(0), z.literal(1), z.literal(2), expressionSchema]).optional(),
          retry: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "priority": [2] } }, defaults: { "priority": -2 } }),
          expire: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "priority": [2] } }, defaults: { "priority": -2 } }),
          additionalFields: z.object({ attachmentsUi: z.unknown().optional(), device: stringOrExpression.optional(), html: booleanOrExpression.optional(), sound: stringOrExpression.optional(), timestamp: stringOrExpression.optional(), title: stringOrExpression.optional(), timestamp: stringOrExpression.optional(), url: stringOrExpression.optional(), url_title: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/pushover/v1/resource_message/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/pushover/v1/resource_message/index.schema.js"(exports2, module2) {
    var getPushSchema = require_operation_push_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "push" } : parameters;
      return getPushSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/pushover/v1/index.schema.js
var getMessageSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "message" } : parameters;
  return getMessageSchema({ ...helpers, parameters: effectiveParams });
};
