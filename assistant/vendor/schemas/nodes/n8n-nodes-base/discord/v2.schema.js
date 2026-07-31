var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("channel").default("channel"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          name: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          type: resolveSchema({ parameters, schema: z.union([z.literal("0"), z.literal("2"), z.literal("4"), expressionSchema]), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          options: resolveSchema({ parameters, schema: z.object({ nsfw: booleanOrExpression.optional(), bitrate: numberOrExpression.optional(), categoryId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(), position: numberOrExpression.optional(), rate_limit_per_user: numberOrExpression.optional(), topic: stringOrExpression.optional(), user_limit: numberOrExpression.optional() }), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/operation_delete_channel.schema.js
var require_operation_delete_channel_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/operation_delete_channel.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("channel").default("channel"),
          operation: z.literal("deleteChannel"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          channelId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("channel").default("channel"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          channelId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("channel").default("channel"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] }, "hide": { "authentication": ["webhook"] } }, defaults: { "returnAll": false, "authentication": "botToken" } }),
          options: resolveSchema({ parameters, schema: z.object({ filter: z.array(z.union([z.literal(0), z.literal(2), z.literal(4)])).optional() }), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("channel").default("channel"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          channelId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          name: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          options: resolveSchema({ parameters, schema: z.object({ nsfw: booleanOrExpression.optional(), bitrate: numberOrExpression.optional(), categoryId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(), position: numberOrExpression.optional(), rate_limit_per_user: numberOrExpression.optional(), topic: stringOrExpression.optional(), user_limit: numberOrExpression.optional() }), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_channel/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteChannelSchema = require_operation_delete_channel_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "send" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteChannelSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_delete_message.schema.js
var require_operation_delete_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_delete_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message"),
          operation: z.literal("deleteMessage"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          channelId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          messageId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          channelId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          messageId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          options: resolveSchema({ parameters, schema: z.object({ simplify: booleanOrExpression.optional() }), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          channelId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] }, "hide": { "authentication": ["webhook"] } }, defaults: { "returnAll": false, "authentication": "botToken" } }),
          options: resolveSchema({ parameters, schema: z.object({ simplify: booleanOrExpression.optional() }), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_react.schema.js
var require_operation_react_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_react.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message"),
          operation: z.literal("react"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          channelId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          messageId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          emoji: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_send.schema.js
var require_operation_send_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_send.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message"),
          operation: z.literal("send").default("send"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          sendTo: resolveSchema({ parameters, schema: z.union([z.literal("user"), z.literal("channel"), expressionSchema]), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          userId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "sendTo": ["user"] }, "hide": { "authentication": ["webhook"] } }, defaults: { "sendTo": "channel", "authentication": "botToken" } }),
          channelId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "sendTo": ["channel"] }, "hide": { "authentication": ["webhook"] } }, defaults: { "sendTo": "channel", "authentication": "botToken" } }),
          content: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          options: resolveSchema({ parameters, schema: z.object({ flags: z.array(z.union([z.literal("SUPPRESS_EMBEDS"), z.literal("SUPPRESS_NOTIFICATIONS")])).optional(), message_reference: stringOrExpression.optional(), tts: booleanOrExpression.optional() }), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          embeds: resolveSchema({ parameters, schema: z.object({ values: z.array(z.object({ inputMethod: z.union([z.literal("fields"), z.literal("json"), expressionSchema]).optional(), json: z.union([iDataObjectSchema, z.string()]).optional(), description: stringOrExpression.optional(), author: stringOrExpression.optional(), color: stringOrExpression.optional(), timestamp: stringOrExpression.optional(), title: stringOrExpression.optional(), url: stringOrExpression.optional(), image: stringOrExpression.optional(), thumbnail: stringOrExpression.optional(), video: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          files: resolveSchema({ parameters, schema: z.object({ values: z.array(z.object({ inputFieldName: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_send_and_wait.schema.js
var require_operation_send_and_wait_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/operation_send_and_wait.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message"),
          operation: z.literal("sendAndWait"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          sendTo: z.union([z.literal("user"), z.literal("channel"), expressionSchema]).optional(),
          userId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "sendTo": ["user"] } }, defaults: { "sendTo": "channel" } }),
          channelId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "sendTo": ["channel"] } }, defaults: { "sendTo": "channel" } }),
          message: stringOrExpression.optional(),
          responseType: z.union([z.literal("approval"), z.literal("freeText"), z.literal("customForm"), expressionSchema]).optional(),
          defineForm: resolveSchema({ parameters, schema: z.union([z.literal("fields"), z.literal("json")]), required: false, displayOptions: { "show": { "responseType": ["customForm"] } }, defaults: { "responseType": "approval" } }),
          jsonOutput: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "defineForm": ["json"], "responseType": ["customForm"] } }, defaults: { "defineForm": "fields", "responseType": "approval" } }),
          formFields: resolveSchema({ parameters, schema: z.object({ values: z.array(z.object({ fieldName: stringOrExpression.optional(), fieldLabel: stringOrExpression.optional(), fieldLabel: stringOrExpression.optional(), fieldName: stringOrExpression.optional(), fieldType: z.union([z.literal("checkbox"), z.literal("html"), z.literal("date"), z.literal("dropdown"), z.literal("email"), z.literal("file"), z.literal("hiddenField"), z.literal("number"), z.literal("password"), z.literal("radio"), z.literal("text"), z.literal("textarea"), expressionSchema]).optional(), elementName: stringOrExpression.optional(), fieldName: stringOrExpression.optional(), placeholder: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), fieldValue: stringOrExpression.optional(), fieldOptions: z.unknown().optional(), fieldOptions: z.unknown().optional(), fieldOptions: z.unknown().optional(), multiselect: booleanOrExpression.optional(), limitSelection: z.union([z.literal("exact"), z.literal("range"), z.literal("unlimited"), expressionSchema]).optional(), numberOfSelections: numberOrExpression.optional(), minSelections: numberOrExpression.optional(), maxSelections: numberOrExpression.optional(), html: z.string().optional(), multipleFiles: booleanOrExpression.optional(), acceptFileTypes: stringOrExpression.optional(), requiredField: booleanOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "defineForm": ["fields"], "responseType": ["customForm"] } }, defaults: { "defineForm": "fields", "responseType": "approval" } }),
          approvalOptions: resolveSchema({ parameters, schema: z.object({ values: z.object({ approvalType: z.union([z.literal("single"), z.literal("double"), expressionSchema]).optional(), approveLabel: stringOrExpression.optional(), disapproveLabel: stringOrExpression.optional() }).optional() }), required: false, displayOptions: { "show": { "responseType": ["approval"] } }, defaults: { "responseType": "approval" } }),
          options: resolveSchema({ parameters, schema: z.object({ limitWaitTime: z.unknown().optional(), appendAttribution: booleanOrExpression.optional(), messageButtonLabel: stringOrExpression.optional(), responseFormTitle: stringOrExpression.optional(), responseFormDescription: stringOrExpression.optional(), responseFormButtonLabel: stringOrExpression.optional(), responseFormCustomCss: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "responseType": ["approval", "freeText", "customForm"] } }, defaults: { "responseType": "approval" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_message/index.schema.js"(exports2, module2) {
    var getDeleteMessageSchema = require_operation_delete_message_schema();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getReactSchema = require_operation_react_schema();
    var getSendSchema = require_operation_send_schema();
    var getSendAndWaitSchema = require_operation_send_and_wait_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "send" } : parameters;
      return z.union([
        getDeleteMessageSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getReactSchema({ ...helpers, parameters: effectiveParams }),
        getSendSchema({ ...helpers, parameters: effectiveParams }),
        getSendAndWaitSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_member/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_member/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("member"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] }, "hide": { "authentication": ["webhook"] } }, defaults: { "returnAll": false, "authentication": "botToken" } }),
          after: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          options: resolveSchema({ parameters, schema: z.object({ simplify: booleanOrExpression.optional() }), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_member/operation_role_add.schema.js
var require_operation_role_add_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_member/operation_role_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("member"),
          operation: z.literal("roleAdd"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          userId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          role: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_member/operation_role_remove.schema.js
var require_operation_role_remove_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_member/operation_role_remove.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("member"),
          operation: z.literal("roleRemove"),
          authentication: z.union([z.literal("botToken"), z.literal("oAuth2"), z.literal("webhook"), expressionSchema]).optional(),
          guildId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "authentication": ["botToken", "oAuth2"] } }, defaults: { "authentication": "botToken" } }),
          userId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } }),
          role: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "hide": { "authentication": ["webhook"] } }, defaults: { "authentication": "botToken" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_member/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/resource_member/index.schema.js"(exports2, module2) {
    var getGetAllSchema = require_operation_get_all_schema3();
    var getRoleAddSchema = require_operation_role_add_schema();
    var getRoleRemoveSchema = require_operation_role_remove_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "send" } : parameters;
      return z.union([
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getRoleAddSchema({ ...helpers, parameters: effectiveParams }),
        getRoleRemoveSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/discord/v2/index.schema.js
var getChannelSchema = require_index_schema();
var getMessageSchema = require_index_schema2();
var getMemberSchema = require_index_schema3();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "channel" } : parameters;
  return z.union([
    getChannelSchema({ ...helpers, parameters: effectiveParams }),
    getMessageSchema({ ...helpers, parameters: effectiveParams }),
    getMemberSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
