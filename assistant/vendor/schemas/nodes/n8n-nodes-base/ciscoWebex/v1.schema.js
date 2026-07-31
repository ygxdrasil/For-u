var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("meeting"),
          operation: z.literal("create").default("create"),
          title: stringOrExpression.optional(),
          start: stringOrExpression.optional(),
          end: stringOrExpression.optional(),
          additionalFields: z.object({ agenda: stringOrExpression.optional(), allowAnyUserToBeCoHost: booleanOrExpression.optional(), allowAuthenticatedDevices: booleanOrExpression.optional(), allowFirstUserToBeCoHost: booleanOrExpression.optional(), autoAcceptRequest: booleanOrExpression.optional(), enableConnectAudioBeforeHost: booleanOrExpression.optional(), enabledAutoRecordMeeting: booleanOrExpression.optional(), enabledJoinBeforeHost: booleanOrExpression.optional(), excludePassword: booleanOrExpression.optional(), hostEmail: stringOrExpression.optional(), integrationTags: stringOrExpression.optional(), inviteesUi: z.unknown().optional(), joinBeforeHostMinutes: z.union([z.literal(0), z.literal(5), z.literal(10), z.literal(15), expressionSchema]).optional(), publicMeeting: booleanOrExpression.optional(), recurrence: stringOrExpression.optional(), requireRegistrationInfo: z.array(z.union([z.literal("requireFirstName"), z.literal("requireLastName"), z.literal("requireEmail"), z.literal("requireJobTitle"), z.literal("requireCompanyName"), z.literal("requireAddress1"), z.literal("requireAddress2"), z.literal("requireCity"), z.literal("requireState"), z.literal("requireZipCode"), z.literal("requireCountryRegion"), z.literal("requireWorkPhone"), z.literal("requireFax")])).optional(), reminderTime: numberOrExpression.optional(), sendEmail: booleanOrExpression.optional(), siteUrl: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("meeting"),
          operation: z.literal("delete"),
          meetingId: stringOrExpression.optional(),
          options: z.object({ hostEmail: stringOrExpression.optional(), sendEmail: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("meeting"),
          operation: z.literal("get"),
          meetingId: stringOrExpression.optional(),
          options: z.object({ hostEmail: stringOrExpression.optional(), password: stringOrExpression.optional(), sendEmail: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("meeting"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ from: stringOrExpression.optional(), hostEmail: stringOrExpression.optional(), integrationTag: stringOrExpression.optional(), current: booleanOrExpression.optional(), meetingNumber: stringOrExpression.optional(), meetingType: z.union([z.literal("meetingSeries"), z.literal("scheduledMeeting"), z.literal("meeting"), expressionSchema]).optional(), participantEmail: stringOrExpression.optional(), siteUrl: stringOrExpression.optional(), state: z.union([z.literal("active"), z.literal("ended"), z.literal("expired"), z.literal("inProgress"), z.literal("lobby"), z.literal("missed"), z.literal("ready"), z.literal("scheduled"), expressionSchema]).optional(), to: stringOrExpression.optional(), webLink: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("meeting"),
          operation: z.literal("update"),
          meetingId: stringOrExpression.optional(),
          updateFields: z.object({ agenda: stringOrExpression.optional(), allowAnyUserToBeCoHost: booleanOrExpression.optional(), allowAuthenticatedDevices: booleanOrExpression.optional(), allowFirstUserToBeCoHost: booleanOrExpression.optional(), enableConnectAudioBeforeHost: booleanOrExpression.optional(), enabledAutoRecordMeeting: booleanOrExpression.optional(), enabledJoinBeforeHost: booleanOrExpression.optional(), end: stringOrExpression.optional(), excludePassword: booleanOrExpression.optional(), hostEmail: stringOrExpression.optional(), inviteesUi: z.unknown().optional(), joinBeforeHostMinutes: z.union([z.literal(0), z.literal(5), z.literal(10), z.literal(15), expressionSchema]).optional(), password: stringOrExpression.optional(), publicMeeting: booleanOrExpression.optional(), recurrence: stringOrExpression.optional(), requireRegistrationInfo: z.array(z.union([z.literal("requireFirstName"), z.literal("requireLastName"), z.literal("requireEmail"), z.literal("requireJobTitle"), z.literal("requireCompanyName"), z.literal("requireAddress1"), z.literal("requireAddress2"), z.literal("requireCity"), z.literal("requireState"), z.literal("requireZipCode"), z.literal("requireCountryRegion"), z.literal("requireWorkPhone"), z.literal("requireFax")])).optional(), reminderTime: numberOrExpression.optional(), sendEmail: booleanOrExpression.optional(), siteUrl: stringOrExpression.optional(), start: stringOrExpression.optional(), title: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_meeting/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("create").default("create"),
          destination: z.union([z.literal("room"), z.literal("person"), expressionSchema]).optional(),
          roomId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "destination": ["room"] } }, defaults: { "destination": "room" } }),
          specifyPersonBy: resolveSchema({ parameters, schema: z.union([z.literal("email"), z.literal("id"), expressionSchema]), required: false, displayOptions: { "show": { "destination": ["person"] } }, defaults: { "destination": "room" } }),
          toPersonId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "specifyPersonBy": ["id"] } }, defaults: { "specifyPersonBy": "email" } }),
          toPersonEmail: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "specifyPersonBy": ["email"] } }, defaults: { "specifyPersonBy": "email" } }),
          text: stringOrExpression.optional(),
          additionalFields: z.object({ attachmentsUi: z.unknown().optional(), fileUi: z.unknown().optional(), markdown: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("delete"),
          messageId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("get"),
          messageId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("getAll"),
          roomId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ before: stringOrExpression.optional(), beforeMessage: stringOrExpression.optional(), parentId: stringOrExpression.optional(), mentionedPeople: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("message").default("message"),
          operation: z.literal("update"),
          messageId: stringOrExpression.optional(),
          markdown: booleanOrExpression.optional(),
          text: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "markdown": [false] } }, defaults: { "markdown": false } }),
          markdownText: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "markdown": [true] } }, defaults: { "markdown": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/resource_message/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/ciscoWebex/v1/index.schema.js
var getMeetingSchema = require_index_schema();
var getMessageSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "message" } : parameters;
  return z.union([
    getMeetingSchema({ ...helpers, parameters: effectiveParams }),
    getMessageSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
