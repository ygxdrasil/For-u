var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_add_labels.schema.js
var require_operation_add_labels_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_add_labels.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("addLabels"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          messageId: stringOrExpression.optional(),
          labelIds: z.array(z.string()).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          messageId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          messageId: stringOrExpression.optional(),
          simple: booleanOrExpression.optional(),
          options: resolveSchema({ parameters, schema: z.object({ dataPropertyAttachmentsPrefixName: stringOrExpression.optional(), downloadAttachments: booleanOrExpression.optional() }), required: false, displayOptions: { "hide": { "simple": [true] } }, defaults: { "simple": true } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional(),
          filters: z.object({ includeSpamTrash: booleanOrExpression.optional(), labelIds: z.array(z.string()).optional(), q: stringOrExpression.optional(), readStatus: z.union([z.literal("both"), z.literal("unread"), z.literal("read"), expressionSchema]).optional(), receivedAfter: stringOrExpression.optional(), receivedBefore: stringOrExpression.optional(), sender: stringOrExpression.optional() }).optional(),
          options: resolveSchema({ parameters, schema: z.object({ dataPropertyAttachmentsPrefixName: stringOrExpression.optional(), downloadAttachments: booleanOrExpression.optional() }), required: false, displayOptions: { "hide": { "simple": [true] } }, defaults: { "simple": true } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_mark_as_read.schema.js
var require_operation_mark_as_read_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_mark_as_read.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("markAsRead"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          messageId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_mark_as_unread.schema.js
var require_operation_mark_as_unread_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_mark_as_unread.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("markAsUnread"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          messageId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_remove_labels.schema.js
var require_operation_remove_labels_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_remove_labels.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("removeLabels"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          messageId: stringOrExpression.optional(),
          labelIds: z.array(z.string()).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_reply.schema.js
var require_operation_reply_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_reply.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("reply"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          messageId: stringOrExpression.optional(),
          emailType: z.union([z.literal("text"), z.literal("html")]).optional(),
          message: stringOrExpression.optional(),
          options: z.object({ appendAttribution: booleanOrExpression.optional(), attachmentsUi: z.unknown().optional(), bccList: stringOrExpression.optional(), ccList: stringOrExpression.optional(), senderName: stringOrExpression.optional(), replyTo: stringOrExpression.optional(), replyToSenderOnly: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_send.schema.js
var require_operation_send_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_send.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("send"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          sendTo: stringOrExpression.optional(),
          subject: stringOrExpression.optional(),
          emailType: z.union([z.literal("text"), z.literal("html")]).optional(),
          message: stringOrExpression.optional(),
          options: z.object({ appendAttribution: booleanOrExpression.optional(), attachmentsUi: z.unknown().optional(), bccList: stringOrExpression.optional(), ccList: stringOrExpression.optional(), senderName: stringOrExpression.optional(), replyTo: stringOrExpression.optional(), replyToSenderOnly: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_send_and_wait.schema.js
var require_operation_send_and_wait_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/operation_send_and_wait.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendAndWait"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          sendTo: stringOrExpression.optional(),
          subject: stringOrExpression.optional(),
          message: stringOrExpression.optional(),
          responseType: z.union([z.literal("approval"), z.literal("freeText"), z.literal("customForm"), expressionSchema]).optional(),
          defineForm: resolveSchema({ parameters, schema: z.union([z.literal("fields"), z.literal("json")]), required: false, displayOptions: { "show": { "responseType": ["customForm"] } }, defaults: { "responseType": "approval" } }),
          jsonOutput: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "defineForm": ["json"], "responseType": ["customForm"] } }, defaults: { "defineForm": "fields", "responseType": "approval" } }),
          formFields: resolveSchema({ parameters, schema: z.object({ values: z.array(z.object({ fieldName: stringOrExpression.optional(), fieldLabel: stringOrExpression.optional(), fieldLabel: stringOrExpression.optional(), fieldName: stringOrExpression.optional(), fieldType: z.union([z.literal("checkbox"), z.literal("html"), z.literal("date"), z.literal("dropdown"), z.literal("email"), z.literal("file"), z.literal("hiddenField"), z.literal("number"), z.literal("password"), z.literal("radio"), z.literal("text"), z.literal("textarea"), expressionSchema]).optional(), elementName: stringOrExpression.optional(), fieldName: stringOrExpression.optional(), placeholder: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), defaultValue: stringOrExpression.optional(), fieldValue: stringOrExpression.optional(), fieldOptions: z.unknown().optional(), fieldOptions: z.unknown().optional(), fieldOptions: z.unknown().optional(), multiselect: booleanOrExpression.optional(), limitSelection: z.union([z.literal("exact"), z.literal("range"), z.literal("unlimited"), expressionSchema]).optional(), numberOfSelections: numberOrExpression.optional(), minSelections: numberOrExpression.optional(), maxSelections: numberOrExpression.optional(), html: z.string().optional(), multipleFiles: booleanOrExpression.optional(), acceptFileTypes: stringOrExpression.optional(), requiredField: booleanOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "defineForm": ["fields"], "responseType": ["customForm"] } }, defaults: { "defineForm": "fields", "responseType": "approval" } }),
          approvalOptions: resolveSchema({ parameters, schema: z.object({ values: z.object({ approvalType: z.union([z.literal("single"), z.literal("double"), expressionSchema]).optional(), approveLabel: stringOrExpression.optional(), buttonApprovalStyle: z.union([z.literal("primary"), z.literal("secondary"), expressionSchema]).optional(), disapproveLabel: stringOrExpression.optional(), buttonDisapprovalStyle: z.union([z.literal("primary"), z.literal("secondary"), expressionSchema]).optional() }).optional() }), required: false, displayOptions: { "show": { "responseType": ["approval"] } }, defaults: { "responseType": "approval" } }),
          options: resolveSchema({ parameters, schema: z.object({ limitWaitTime: z.unknown().optional(), appendAttribution: booleanOrExpression.optional(), messageButtonLabel: stringOrExpression.optional(), responseFormTitle: stringOrExpression.optional(), responseFormDescription: stringOrExpression.optional(), responseFormButtonLabel: stringOrExpression.optional(), responseFormCustomCss: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "responseType": ["approval", "freeText", "customForm"] } }, defaults: { "responseType": "approval" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_message/index.schema.js"(exports2, module2) {
    var getAddLabelsSchema = require_operation_add_labels_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getMarkAsReadSchema = require_operation_mark_as_read_schema();
    var getMarkAsUnreadSchema = require_operation_mark_as_unread_schema();
    var getRemoveLabelsSchema = require_operation_remove_labels_schema();
    var getReplySchema = require_operation_reply_schema();
    var getSendSchema = require_operation_send_schema();
    var getSendAndWaitSchema = require_operation_send_and_wait_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddLabelsSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getMarkAsReadSchema({ ...helpers, parameters: effectiveParams }),
        getMarkAsUnreadSchema({ ...helpers, parameters: effectiveParams }),
        getRemoveLabelsSchema({ ...helpers, parameters: effectiveParams }),
        getReplySchema({ ...helpers, parameters: effectiveParams }),
        getSendSchema({ ...helpers, parameters: effectiveParams }),
        getSendAndWaitSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_label/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_label/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("label"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          name: stringOrExpression.optional(),
          options: z.object({ labelListVisibility: z.union([z.literal("labelHide"), z.literal("labelShow"), z.literal("labelShowIfUnread"), expressionSchema]).optional(), messageListVisibility: z.union([z.literal("hide"), z.literal("show"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_label/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_label/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("label"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          labelId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_label/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_label/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("label"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          labelId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_label/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_label/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("label"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_label/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_label/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_draft/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_draft/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("draft"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          subject: stringOrExpression.optional(),
          emailType: z.union([z.literal("html"), z.literal("text")]).optional(),
          message: stringOrExpression.optional(),
          options: z.object({ attachmentsUi: z.unknown().optional(), bccList: stringOrExpression.optional(), ccList: stringOrExpression.optional(), fromAlias: stringOrExpression.optional(), replyTo: stringOrExpression.optional(), threadId: stringOrExpression.optional(), sendTo: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_draft/operation_delete.schema.js
var require_operation_delete_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_draft/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("draft"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          messageId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_draft/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_draft/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("draft"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          messageId: stringOrExpression.optional(),
          options: z.object({ dataPropertyAttachmentsPrefixName: stringOrExpression.optional(), downloadAttachments: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_draft/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_draft/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("draft"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ dataPropertyAttachmentsPrefixName: stringOrExpression.optional(), downloadAttachments: booleanOrExpression.optional(), includeSpamTrash: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_draft/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_draft/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema3();
    var getGetSchema = require_operation_get_schema3();
    var getGetAllSchema = require_operation_get_all_schema3();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_add_labels.schema.js
var require_operation_add_labels_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_add_labels.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("thread"),
          operation: z.literal("addLabels"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          threadId: stringOrExpression.optional(),
          labelIds: z.array(z.string()).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_delete.schema.js
var require_operation_delete_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("thread"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          threadId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("thread"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          threadId: stringOrExpression.optional(),
          simple: booleanOrExpression.optional(),
          options: z.object({ returnOnlyMessages: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_get_all.schema.js
var require_operation_get_all_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("thread"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ includeSpamTrash: booleanOrExpression.optional(), labelIds: z.array(z.string()).optional(), q: stringOrExpression.optional(), readStatus: z.union([z.literal("both"), z.literal("unread"), z.literal("read"), expressionSchema]).optional(), receivedAfter: stringOrExpression.optional(), receivedBefore: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_remove_labels.schema.js
var require_operation_remove_labels_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_remove_labels.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("thread"),
          operation: z.literal("removeLabels"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          threadId: stringOrExpression.optional(),
          labelIds: z.array(z.string()).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_reply.schema.js
var require_operation_reply_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_reply.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("thread"),
          operation: z.literal("reply"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          threadId: stringOrExpression.optional(),
          messageId: stringOrExpression.optional(),
          emailType: z.union([z.literal("text"), z.literal("html")]).optional(),
          message: stringOrExpression.optional(),
          options: z.object({ attachmentsUi: z.unknown().optional(), bccList: stringOrExpression.optional(), ccList: stringOrExpression.optional(), senderName: stringOrExpression.optional(), replyToSenderOnly: booleanOrExpression.optional(), replyToRecipientsOnly: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_trash.schema.js
var require_operation_trash_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_trash.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("thread"),
          operation: z.literal("trash"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          threadId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_untrash.schema.js
var require_operation_untrash_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/operation_untrash.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("thread"),
          operation: z.literal("untrash"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          threadId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/resource_thread/index.schema.js"(exports2, module2) {
    var getAddLabelsSchema = require_operation_add_labels_schema2();
    var getDeleteSchema = require_operation_delete_schema4();
    var getGetSchema = require_operation_get_schema4();
    var getGetAllSchema = require_operation_get_all_schema4();
    var getRemoveLabelsSchema = require_operation_remove_labels_schema2();
    var getReplySchema = require_operation_reply_schema2();
    var getTrashSchema = require_operation_trash_schema();
    var getUntrashSchema = require_operation_untrash_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddLabelsSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getRemoveLabelsSchema({ ...helpers, parameters: effectiveParams }),
        getReplySchema({ ...helpers, parameters: effectiveParams }),
        getTrashSchema({ ...helpers, parameters: effectiveParams }),
        getUntrashSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gmail/v22/index.schema.js
var getMessageSchema = require_index_schema();
var getLabelSchema = require_index_schema2();
var getDraftSchema = require_index_schema3();
var getThreadSchema = require_index_schema4();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "message" } : parameters;
  return z.union([
    getMessageSchema({ ...helpers, parameters: effectiveParams }),
    getLabelSchema({ ...helpers, parameters: effectiveParams }),
    getDraftSchema({ ...helpers, parameters: effectiveParams }),
    getThreadSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
