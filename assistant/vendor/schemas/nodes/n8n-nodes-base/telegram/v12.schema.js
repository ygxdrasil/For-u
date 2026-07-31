var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_administrators.schema.js
var require_operation_administrators_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_administrators.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("chat"),
          operation: z.literal("administrators"),
          chatId: stringOrExpression.optional(),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("chat"),
          operation: z.literal("get").default("get"),
          chatId: stringOrExpression.optional(),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_leave.schema.js
var require_operation_leave_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_leave.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("chat"),
          operation: z.literal("leave"),
          chatId: stringOrExpression.optional(),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_member.schema.js
var require_operation_member_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_member.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("chat"),
          operation: z.literal("member"),
          chatId: stringOrExpression.optional(),
          userId: stringOrExpression.optional(),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_set_description.schema.js
var require_operation_set_description_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_set_description.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("chat"),
          operation: z.literal("setDescription"),
          chatId: stringOrExpression.optional(),
          description: stringOrExpression.optional(),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_set_title.schema.js
var require_operation_set_title_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/operation_set_title.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("chat"),
          operation: z.literal("setTitle"),
          chatId: stringOrExpression.optional(),
          title: stringOrExpression.optional(),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_chat/index.schema.js"(exports2, module2) {
    var getAdministratorsSchema = require_operation_administrators_schema();
    var getGetSchema = require_operation_get_schema();
    var getLeaveSchema = require_operation_leave_schema();
    var getMemberSchema = require_operation_member_schema();
    var getSetDescriptionSchema = require_operation_set_description_schema();
    var getSetTitleSchema = require_operation_set_title_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return z.union([
        getAdministratorsSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getLeaveSchema({ ...helpers, parameters: effectiveParams }),
        getMemberSchema({ ...helpers, parameters: effectiveParams }),
        getSetDescriptionSchema({ ...helpers, parameters: effectiveParams }),
        getSetTitleSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_callback/operation_answer_inline_query.schema.js
var require_operation_answer_inline_query_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_callback/operation_answer_inline_query.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("callback"),
          operation: z.literal("answerInlineQuery"),
          queryId: stringOrExpression.optional(),
          results: stringOrExpression.optional(),
          additionalFields: z.object({ cache_time: numberOrExpression.optional(), show_alert: booleanOrExpression.optional(), text: stringOrExpression.optional(), url: stringOrExpression.optional() }).optional(),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_callback/operation_answer_query.schema.js
var require_operation_answer_query_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_callback/operation_answer_query.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("callback"),
          operation: z.literal("answerQuery"),
          queryId: stringOrExpression.optional(),
          additionalFields: z.object({ cache_time: numberOrExpression.optional(), show_alert: booleanOrExpression.optional(), text: stringOrExpression.optional(), url: stringOrExpression.optional() }).optional(),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_callback/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_callback/index.schema.js"(exports2, module2) {
    var getAnswerInlineQuerySchema = require_operation_answer_inline_query_schema();
    var getAnswerQuerySchema = require_operation_answer_query_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return z.union([
        getAnswerInlineQuerySchema({ ...helpers, parameters: effectiveParams }),
        getAnswerQuerySchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_file/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_file/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("get").default("get"),
          fileId: stringOrExpression.optional(),
          download: booleanOrExpression.optional(),
          additionalFields: resolveSchema({ parameters, schema: z.object({ mimeType: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "download": [true] } }, defaults: { "download": true } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_file/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_file/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return getGetSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_delete_message.schema.js
var require_operation_delete_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_delete_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("deleteMessage"),
          chatId: stringOrExpression.optional(),
          messageId: stringOrExpression.optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_edit_message_text.schema.js
var require_operation_edit_message_text_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_edit_message_text.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("editMessageText"),
          messageType: z.union([z.literal("inlineMessage"), z.literal("message"), expressionSchema]).optional(),
          chatId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "messageType": ["message"] } }, defaults: { "messageType": "message" } }),
          messageId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "messageType": ["message"] } }, defaults: { "messageType": "message" } }),
          inlineMessageId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "messageType": ["inlineMessage"] } }, defaults: { "messageType": "message" } }),
          replyMarkup: z.union([z.literal("none"), z.literal("inlineKeyboard"), expressionSchema]).optional(),
          text: stringOrExpression.optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } }, defaults: { "replyMarkup": "none" } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } }, defaults: { "replyMarkup": "none" } }),
          additionalFields: z.object({ appendAttribution: booleanOrExpression.optional(), caption: stringOrExpression.optional(), disable_notification: booleanOrExpression.optional(), disable_web_page_preview: booleanOrExpression.optional(), duration: numberOrExpression.optional(), fileName: stringOrExpression.optional(), height: numberOrExpression.optional(), parse_mode: z.union([z.literal("Markdown"), z.literal("MarkdownV2"), z.literal("HTML"), expressionSchema]).optional(), performer: stringOrExpression.optional(), reply_to_message_id: numberOrExpression.optional(), message_thread_id: numberOrExpression.optional(), title: stringOrExpression.optional(), thumb: stringOrExpression.optional(), width: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_pin_chat_message.schema.js
var require_operation_pin_chat_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_pin_chat_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("pinChatMessage"),
          chatId: stringOrExpression.optional(),
          messageId: stringOrExpression.optional(),
          additionalFields: z.object({ disable_notification: booleanOrExpression.optional() }).optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_and_wait.schema.js
var require_operation_send_and_wait_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_and_wait.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendAndWait"),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } }),
          chatId: stringOrExpression.optional(),
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_animation.schema.js
var require_operation_send_animation_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_animation.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendAnimation"),
          chatId: stringOrExpression.optional(),
          binaryData: booleanOrExpression.optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [true] } }, defaults: { "binaryData": false } }),
          file: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [false] } }, defaults: { "binaryData": false } }),
          replyMarkup: z.union([z.literal("forceReply"), z.literal("inlineKeyboard"), z.literal("none"), z.literal("replyKeyboard"), z.literal("replyKeyboardRemove"), expressionSchema]).optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } }, defaults: { "replyMarkup": "none" } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } }, defaults: { "replyMarkup": "none" } }),
          additionalFields: z.object({ appendAttribution: booleanOrExpression.optional(), caption: stringOrExpression.optional(), disable_notification: booleanOrExpression.optional(), disable_web_page_preview: booleanOrExpression.optional(), duration: numberOrExpression.optional(), fileName: stringOrExpression.optional(), height: numberOrExpression.optional(), parse_mode: z.union([z.literal("Markdown"), z.literal("MarkdownV2"), z.literal("HTML"), expressionSchema]).optional(), performer: stringOrExpression.optional(), reply_to_message_id: numberOrExpression.optional(), message_thread_id: numberOrExpression.optional(), title: stringOrExpression.optional(), thumb: stringOrExpression.optional(), width: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_audio.schema.js
var require_operation_send_audio_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_audio.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendAudio"),
          chatId: stringOrExpression.optional(),
          binaryData: booleanOrExpression.optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [true] } }, defaults: { "binaryData": false } }),
          file: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [false] } }, defaults: { "binaryData": false } }),
          replyMarkup: z.union([z.literal("forceReply"), z.literal("inlineKeyboard"), z.literal("none"), z.literal("replyKeyboard"), z.literal("replyKeyboardRemove"), expressionSchema]).optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } }, defaults: { "replyMarkup": "none" } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } }, defaults: { "replyMarkup": "none" } }),
          additionalFields: z.object({ appendAttribution: booleanOrExpression.optional(), caption: stringOrExpression.optional(), disable_notification: booleanOrExpression.optional(), disable_web_page_preview: booleanOrExpression.optional(), duration: numberOrExpression.optional(), fileName: stringOrExpression.optional(), height: numberOrExpression.optional(), parse_mode: z.union([z.literal("Markdown"), z.literal("MarkdownV2"), z.literal("HTML"), expressionSchema]).optional(), performer: stringOrExpression.optional(), reply_to_message_id: numberOrExpression.optional(), message_thread_id: numberOrExpression.optional(), title: stringOrExpression.optional(), thumb: stringOrExpression.optional(), width: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_chat_action.schema.js
var require_operation_send_chat_action_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_chat_action.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendChatAction"),
          chatId: stringOrExpression.optional(),
          action: z.union([z.literal("find_location"), z.literal("record_audio"), z.literal("record_video"), z.literal("record_video_note"), z.literal("typing"), z.literal("upload_audio"), z.literal("upload_document"), z.literal("upload_photo"), z.literal("upload_video"), z.literal("upload_video_note"), expressionSchema]).optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_document.schema.js
var require_operation_send_document_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_document.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendDocument"),
          chatId: stringOrExpression.optional(),
          binaryData: booleanOrExpression.optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [true] } }, defaults: { "binaryData": false } }),
          file: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [false] } }, defaults: { "binaryData": false } }),
          replyMarkup: z.union([z.literal("forceReply"), z.literal("inlineKeyboard"), z.literal("none"), z.literal("replyKeyboard"), z.literal("replyKeyboardRemove"), expressionSchema]).optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } }, defaults: { "replyMarkup": "none" } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } }, defaults: { "replyMarkup": "none" } }),
          additionalFields: z.object({ appendAttribution: booleanOrExpression.optional(), caption: stringOrExpression.optional(), disable_notification: booleanOrExpression.optional(), disable_web_page_preview: booleanOrExpression.optional(), duration: numberOrExpression.optional(), fileName: stringOrExpression.optional(), height: numberOrExpression.optional(), parse_mode: z.union([z.literal("Markdown"), z.literal("MarkdownV2"), z.literal("HTML"), expressionSchema]).optional(), performer: stringOrExpression.optional(), reply_to_message_id: numberOrExpression.optional(), message_thread_id: numberOrExpression.optional(), title: stringOrExpression.optional(), thumb: stringOrExpression.optional(), width: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_location.schema.js
var require_operation_send_location_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_location.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendLocation"),
          chatId: stringOrExpression.optional(),
          latitude: numberOrExpression.optional(),
          longitude: numberOrExpression.optional(),
          replyMarkup: z.union([z.literal("forceReply"), z.literal("inlineKeyboard"), z.literal("none"), z.literal("replyKeyboard"), z.literal("replyKeyboardRemove"), expressionSchema]).optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } }, defaults: { "replyMarkup": "none" } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } }, defaults: { "replyMarkup": "none" } }),
          additionalFields: z.object({ appendAttribution: booleanOrExpression.optional(), caption: stringOrExpression.optional(), disable_notification: booleanOrExpression.optional(), disable_web_page_preview: booleanOrExpression.optional(), duration: numberOrExpression.optional(), fileName: stringOrExpression.optional(), height: numberOrExpression.optional(), parse_mode: z.union([z.literal("Markdown"), z.literal("MarkdownV2"), z.literal("HTML"), expressionSchema]).optional(), performer: stringOrExpression.optional(), reply_to_message_id: numberOrExpression.optional(), message_thread_id: numberOrExpression.optional(), title: stringOrExpression.optional(), thumb: stringOrExpression.optional(), width: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_media_group.schema.js
var require_operation_send_media_group_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_media_group.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendMediaGroup"),
          chatId: stringOrExpression.optional(),
          media: z.object({ media: z.array(z.object({ type: z.union([z.literal("photo"), z.literal("video"), expressionSchema]).optional(), media: stringOrExpression.optional(), additionalFields: z.unknown().optional() })).optional() }).optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } }),
          additionalFields: z.object({ appendAttribution: booleanOrExpression.optional(), caption: stringOrExpression.optional(), disable_notification: booleanOrExpression.optional(), disable_web_page_preview: booleanOrExpression.optional(), duration: numberOrExpression.optional(), fileName: stringOrExpression.optional(), height: numberOrExpression.optional(), parse_mode: z.union([z.literal("Markdown"), z.literal("MarkdownV2"), z.literal("HTML"), expressionSchema]).optional(), performer: stringOrExpression.optional(), reply_to_message_id: numberOrExpression.optional(), message_thread_id: numberOrExpression.optional(), title: stringOrExpression.optional(), thumb: stringOrExpression.optional(), width: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_message.schema.js
var require_operation_send_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendMessage"),
          chatId: stringOrExpression.optional(),
          text: stringOrExpression.optional(),
          replyMarkup: z.union([z.literal("forceReply"), z.literal("inlineKeyboard"), z.literal("none"), z.literal("replyKeyboard"), z.literal("replyKeyboardRemove"), expressionSchema]).optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } }, defaults: { "replyMarkup": "none" } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } }, defaults: { "replyMarkup": "none" } }),
          additionalFields: z.object({ appendAttribution: booleanOrExpression.optional(), caption: stringOrExpression.optional(), disable_notification: booleanOrExpression.optional(), disable_web_page_preview: booleanOrExpression.optional(), duration: numberOrExpression.optional(), fileName: stringOrExpression.optional(), height: numberOrExpression.optional(), parse_mode: z.union([z.literal("Markdown"), z.literal("MarkdownV2"), z.literal("HTML"), expressionSchema]).optional(), performer: stringOrExpression.optional(), reply_to_message_id: numberOrExpression.optional(), message_thread_id: numberOrExpression.optional(), title: stringOrExpression.optional(), thumb: stringOrExpression.optional(), width: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_photo.schema.js
var require_operation_send_photo_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_photo.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendPhoto"),
          chatId: stringOrExpression.optional(),
          binaryData: booleanOrExpression.optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [true] } }, defaults: { "binaryData": false } }),
          file: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [false] } }, defaults: { "binaryData": false } }),
          replyMarkup: z.union([z.literal("forceReply"), z.literal("inlineKeyboard"), z.literal("none"), z.literal("replyKeyboard"), z.literal("replyKeyboardRemove"), expressionSchema]).optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } }, defaults: { "replyMarkup": "none" } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } }, defaults: { "replyMarkup": "none" } }),
          additionalFields: z.object({ appendAttribution: booleanOrExpression.optional(), caption: stringOrExpression.optional(), disable_notification: booleanOrExpression.optional(), disable_web_page_preview: booleanOrExpression.optional(), duration: numberOrExpression.optional(), fileName: stringOrExpression.optional(), height: numberOrExpression.optional(), parse_mode: z.union([z.literal("Markdown"), z.literal("MarkdownV2"), z.literal("HTML"), expressionSchema]).optional(), performer: stringOrExpression.optional(), reply_to_message_id: numberOrExpression.optional(), message_thread_id: numberOrExpression.optional(), title: stringOrExpression.optional(), thumb: stringOrExpression.optional(), width: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_sticker.schema.js
var require_operation_send_sticker_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_sticker.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendSticker"),
          chatId: stringOrExpression.optional(),
          binaryData: booleanOrExpression.optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [true] } }, defaults: { "binaryData": false } }),
          file: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [false] } }, defaults: { "binaryData": false } }),
          replyMarkup: z.union([z.literal("forceReply"), z.literal("inlineKeyboard"), z.literal("none"), z.literal("replyKeyboard"), z.literal("replyKeyboardRemove"), expressionSchema]).optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } }, defaults: { "replyMarkup": "none" } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } }, defaults: { "replyMarkup": "none" } }),
          additionalFields: z.object({ appendAttribution: booleanOrExpression.optional(), caption: stringOrExpression.optional(), disable_notification: booleanOrExpression.optional(), disable_web_page_preview: booleanOrExpression.optional(), duration: numberOrExpression.optional(), fileName: stringOrExpression.optional(), height: numberOrExpression.optional(), parse_mode: z.union([z.literal("Markdown"), z.literal("MarkdownV2"), z.literal("HTML"), expressionSchema]).optional(), performer: stringOrExpression.optional(), reply_to_message_id: numberOrExpression.optional(), message_thread_id: numberOrExpression.optional(), title: stringOrExpression.optional(), thumb: stringOrExpression.optional(), width: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_video.schema.js
var require_operation_send_video_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_send_video.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendVideo"),
          chatId: stringOrExpression.optional(),
          binaryData: booleanOrExpression.optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [true] } }, defaults: { "binaryData": false } }),
          file: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [false] } }, defaults: { "binaryData": false } }),
          replyMarkup: z.union([z.literal("forceReply"), z.literal("inlineKeyboard"), z.literal("none"), z.literal("replyKeyboard"), z.literal("replyKeyboardRemove"), expressionSchema]).optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } }, defaults: { "replyMarkup": "none" } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } }, defaults: { "replyMarkup": "none" } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } }, defaults: { "replyMarkup": "none" } }),
          additionalFields: z.object({ appendAttribution: booleanOrExpression.optional(), caption: stringOrExpression.optional(), disable_notification: booleanOrExpression.optional(), disable_web_page_preview: booleanOrExpression.optional(), duration: numberOrExpression.optional(), fileName: stringOrExpression.optional(), height: numberOrExpression.optional(), parse_mode: z.union([z.literal("Markdown"), z.literal("MarkdownV2"), z.literal("HTML"), expressionSchema]).optional(), performer: stringOrExpression.optional(), reply_to_message_id: numberOrExpression.optional(), message_thread_id: numberOrExpression.optional(), title: stringOrExpression.optional(), thumb: stringOrExpression.optional(), width: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_unpin_chat_message.schema.js
var require_operation_unpin_chat_message_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/operation_unpin_chat_message.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("unpinChatMessage"),
          chatId: stringOrExpression.optional(),
          messageId: stringOrExpression.optional(),
          forceReply: resolveSchema({ parameters, schema: z.object({ force_reply: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["forceReply"] } } }),
          inlineKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["inlineKeyboard"] } } }),
          replyKeyboard: resolveSchema({ parameters, schema: z.object({ rows: z.array(z.object({ row: z.unknown().optional() })).optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardOptions: resolveSchema({ parameters, schema: z.object({ resize_keyboard: booleanOrExpression.optional(), one_time_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboard"] } } }),
          replyKeyboardRemove: resolveSchema({ parameters, schema: z.object({ remove_keyboard: booleanOrExpression.optional(), selective: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "replyMarkup": ["replyKeyboardRemove"] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/resource_message/index.schema.js"(exports2, module2) {
    var getDeleteMessageSchema = require_operation_delete_message_schema();
    var getEditMessageTextSchema = require_operation_edit_message_text_schema();
    var getPinChatMessageSchema = require_operation_pin_chat_message_schema();
    var getSendAndWaitSchema = require_operation_send_and_wait_schema();
    var getSendAnimationSchema = require_operation_send_animation_schema();
    var getSendAudioSchema = require_operation_send_audio_schema();
    var getSendChatActionSchema = require_operation_send_chat_action_schema();
    var getSendDocumentSchema = require_operation_send_document_schema();
    var getSendLocationSchema = require_operation_send_location_schema();
    var getSendMediaGroupSchema = require_operation_send_media_group_schema();
    var getSendMessageSchema = require_operation_send_message_schema();
    var getSendPhotoSchema = require_operation_send_photo_schema();
    var getSendStickerSchema = require_operation_send_sticker_schema();
    var getSendVideoSchema = require_operation_send_video_schema();
    var getUnpinChatMessageSchema = require_operation_unpin_chat_message_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return z.union([
        getDeleteMessageSchema({ ...helpers, parameters: effectiveParams }),
        getEditMessageTextSchema({ ...helpers, parameters: effectiveParams }),
        getPinChatMessageSchema({ ...helpers, parameters: effectiveParams }),
        getSendAndWaitSchema({ ...helpers, parameters: effectiveParams }),
        getSendAnimationSchema({ ...helpers, parameters: effectiveParams }),
        getSendAudioSchema({ ...helpers, parameters: effectiveParams }),
        getSendChatActionSchema({ ...helpers, parameters: effectiveParams }),
        getSendDocumentSchema({ ...helpers, parameters: effectiveParams }),
        getSendLocationSchema({ ...helpers, parameters: effectiveParams }),
        getSendMediaGroupSchema({ ...helpers, parameters: effectiveParams }),
        getSendMessageSchema({ ...helpers, parameters: effectiveParams }),
        getSendPhotoSchema({ ...helpers, parameters: effectiveParams }),
        getSendStickerSchema({ ...helpers, parameters: effectiveParams }),
        getSendVideoSchema({ ...helpers, parameters: effectiveParams }),
        getUnpinChatMessageSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/telegram/v12/index.schema.js
var getChatSchema = require_index_schema();
var getCallbackSchema = require_index_schema2();
var getFileSchema = require_index_schema3();
var getMessageSchema = require_index_schema4();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "message" } : parameters;
  return z.union([
    getChatSchema({ ...helpers, parameters: effectiveParams }),
    getCallbackSchema({ ...helpers, parameters: effectiveParams }),
    getFileSchema({ ...helpers, parameters: effectiveParams }),
    getMessageSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
