var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/rocketchat/v1/resource_chat/operation_post_message.schema.js
var require_operation_post_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/rocketchat/v1/resource_chat/operation_post_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("chat").default("chat"),
          operation: z.literal("postMessage").default("postMessage"),
          channel: stringOrExpression.optional(),
          text: stringOrExpression.optional(),
          jsonParameters: booleanOrExpression.optional(),
          options: z.object({ alias: stringOrExpression.optional(), avatar: stringOrExpression.optional(), emoji: stringOrExpression.optional() }).optional(),
          attachments: resolveSchema({ parameters, schema: z.object({ color: stringOrExpression.optional(), text: stringOrExpression.optional(), ts: stringOrExpression.optional(), thumbUrl: stringOrExpression.optional(), messageLink: stringOrExpression.optional(), collapsed: booleanOrExpression.optional(), authorName: stringOrExpression.optional(), authorLink: stringOrExpression.optional(), authorIcon: stringOrExpression.optional(), title: stringOrExpression.optional(), titleLink: stringOrExpression.optional(), titleLinkDownload: booleanOrExpression.optional(), imageUrl: stringOrExpression.optional(), audioUrl: stringOrExpression.optional(), videoUrl: stringOrExpression.optional(), fields: z.unknown().optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } }),
          attachmentsJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/rocketchat/v1/resource_chat/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/rocketchat/v1/resource_chat/index.schema.js"(exports2, module2) {
    var getPostMessageSchema = require_operation_post_message_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "postMessage" } : parameters;
      return getPostMessageSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/rocketchat/v1/index.schema.js
var getChatSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "chat" } : parameters;
  return getChatSchema({ ...helpers, parameters: effectiveParams });
};
