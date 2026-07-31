var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_message/operation_send.schema.js
var require_operation_send_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_message/operation_send.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("send"),
          messagingProduct: z.unknown().optional(),
          phoneNumberId: stringOrExpression.optional(),
          recipientPhoneNumber: stringOrExpression.optional(),
          messageType: z.union([z.literal("audio"), z.literal("contacts"), z.literal("document"), z.literal("image"), z.literal("location"), z.literal("text"), z.literal("video")]).optional(),
          name: resolveSchema({ parameters, schema: z.object({ data: z.object({ formatted_name: stringOrExpression.optional(), first_name: stringOrExpression.optional(), last_name: stringOrExpression.optional(), middle_name: stringOrExpression.optional(), suffix: stringOrExpression.optional(), prefix: stringOrExpression.optional() }).optional() }), required: false, displayOptions: { "show": { "messageType": ["contacts"] } }, defaults: { "messageType": "text" } }),
          additionalFields: resolveSchema({ parameters, schema: z.object({ addresses: z.unknown().optional(), birthday: stringOrExpression.optional(), emails: z.unknown().optional(), organization: z.unknown().optional(), phones: z.unknown().optional(), urls: z.unknown().optional(), mediaFilename: stringOrExpression.optional(), mediaCaption: stringOrExpression.optional(), previewUrl: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "messageType": ["contacts", "location", "image", "video", "audio", "sticker", "document", "text"] } }, defaults: { "messageType": "text" } }),
          longitude: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "messageType": ["location"] } }, defaults: { "messageType": "text" } }),
          latitude: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "messageType": ["location"] } }, defaults: { "messageType": "text" } }),
          textBody: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "messageType": ["text"] } }, defaults: { "messageType": "text" } }),
          mediaPath: resolveSchema({ parameters, schema: z.union([z.literal("useMediaLink"), z.literal("useMediaId"), z.literal("useMedian8n"), expressionSchema]), required: false, displayOptions: { "show": { "messageType": ["audio", "document", "image", "video"] } }, defaults: { "messageType": "text" } }),
          mediaLink: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "messageType": ["image", "video", "audio", "sticker", "document"], "mediaPath": ["useMediaLink"] } }, defaults: { "messageType": "text", "mediaPath": "useMediaLink" } }),
          mediaId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "messageType": ["image", "video", "audio", "sticker", "document"], "mediaPath": ["useMediaId"] } }, defaults: { "messageType": "text", "mediaPath": "useMediaLink" } }),
          mediaPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "messageType": ["image", "video", "audio", "sticker", "document"], "mediaPath": ["useMedian8n"] } }, defaults: { "messageType": "text", "mediaPath": "useMediaLink" } }),
          mediaFilename: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "messageType": ["document"], "mediaPath": ["useMediaId"] } }, defaults: { "messageType": "text", "mediaPath": "useMediaLink" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_message/operation_send_and_wait.schema.js
var require_operation_send_and_wait_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_message/operation_send_and_wait.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendAndWait"),
          messagingProduct: z.unknown().optional(),
          phoneNumberId: stringOrExpression.optional(),
          recipientPhoneNumber: stringOrExpression.optional(),
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_message/operation_send_template.schema.js
var require_operation_send_template_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_message/operation_send_template.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("sendTemplate").default("sendTemplate"),
          messagingProduct: z.unknown().optional(),
          phoneNumberId: stringOrExpression.optional(),
          recipientPhoneNumber: stringOrExpression.optional(),
          template: stringOrExpression.optional(),
          components: z.object({ component: z.array(z.object({ type: z.union([z.literal("body"), z.literal("button"), z.literal("header"), expressionSchema]).optional(), bodyParameters: z.unknown().optional(), sub_type: z.union([z.literal("quick_reply"), z.literal("url"), expressionSchema]).optional(), index: numberOrExpression.optional(), buttonParameters: z.unknown().optional(), headerParameters: z.unknown().optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_message/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_message/index.schema.js"(exports2, module2) {
    var getSendSchema = require_operation_send_schema();
    var getSendAndWaitSchema = require_operation_send_and_wait_schema();
    var getSendTemplateSchema = require_operation_send_template_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "sendTemplate" } : parameters;
      return z.union([
        getSendSchema({ ...helpers, parameters: effectiveParams }),
        getSendAndWaitSchema({ ...helpers, parameters: effectiveParams }),
        getSendTemplateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_media/operation_media_delete.schema.js
var require_operation_media_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_media/operation_media_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("media"),
          operation: z.literal("mediaDelete"),
          mediaDeleteId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_media/operation_media_upload.schema.js
var require_operation_media_upload_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_media/operation_media_upload.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("media"),
          operation: z.literal("mediaUpload"),
          phoneNumberId: stringOrExpression.optional(),
          mediaPropertyName: stringOrExpression.optional(),
          additionalFields: z.object({ mediaFileName: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_media/operation_media_url_get.schema.js
var require_operation_media_url_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_media/operation_media_url_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("media"),
          operation: z.literal("mediaUrlGet"),
          mediaGetId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_media/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/resource_media/index.schema.js"(exports2, module2) {
    var getMediaDeleteSchema = require_operation_media_delete_schema();
    var getMediaUploadSchema = require_operation_media_upload_schema();
    var getMediaUrlGetSchema = require_operation_media_url_get_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "sendTemplate" } : parameters;
      return z.union([
        getMediaDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getMediaUploadSchema({ ...helpers, parameters: effectiveParams }),
        getMediaUrlGetSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/whatsApp/v11/index.schema.js
var getMessageSchema = require_index_schema();
var getMediaSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "message" } : parameters;
  return z.union([
    getMessageSchema({ ...helpers, parameters: effectiveParams }),
    getMediaSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
