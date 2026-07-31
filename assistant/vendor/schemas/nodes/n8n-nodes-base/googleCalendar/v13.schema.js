var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_calendar/operation_availability.schema.js
var require_operation_availability_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_calendar/operation_availability.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("calendar"),
          operation: z.literal("availability").default("availability"),
          calendar: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          timeMin: stringOrExpression.optional(),
          timeMax: stringOrExpression.optional(),
          options: z.object({ outputFormat: z.union([z.literal("availability"), z.literal("bookedSlots"), z.literal("raw"), expressionSchema]).optional(), timezone: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_calendar/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_calendar/index.schema.js"(exports2, module2) {
    var getAvailabilitySchema = require_operation_availability_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "availability" } : parameters;
      return getAvailabilitySchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("event").default("event"),
          operation: z.literal("create"),
          calendar: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          start: stringOrExpression.optional(),
          end: stringOrExpression.optional(),
          useDefaultReminders: booleanOrExpression.optional(),
          additionalFields: z.object({ allday: z.union([z.literal("yes"), z.literal("no"), expressionSchema]).optional(), attendees: stringOrExpression.optional(), color: stringOrExpression.optional(), conferenceDataUi: z.unknown().optional(), description: stringOrExpression.optional(), guestsCanInviteOthers: booleanOrExpression.optional(), guestsCanModify: booleanOrExpression.optional(), guestsCanSeeOtherGuests: booleanOrExpression.optional(), id: stringOrExpression.optional(), location: stringOrExpression.optional(), maxAttendees: numberOrExpression.optional(), repeatFrecuency: z.union([z.literal("Daily"), z.literal("weekly"), z.literal("monthly"), z.literal("yearly"), expressionSchema]).optional(), repeatHowManyTimes: numberOrExpression.optional(), repeatUntil: stringOrExpression.optional(), rrule: stringOrExpression.optional(), sendUpdates: z.union([z.literal("all"), z.literal("externalOnly"), z.literal("none"), expressionSchema]).optional(), showMeAs: z.union([z.literal("transparent"), z.literal("opaque"), expressionSchema]).optional(), summary: stringOrExpression.optional(), visibility: z.union([z.literal("confidential"), z.literal("default"), z.literal("private"), z.literal("public"), expressionSchema]).optional() }).optional(),
          remindersUi: resolveSchema({ parameters, schema: z.object({ remindersValues: z.array(z.object({ method: z.union([z.literal("email"), z.literal("popup"), expressionSchema]).optional(), minutes: numberOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "useDefaultReminders": [false] } }, defaults: { "useDefaultReminders": true } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("event").default("event"),
          operation: z.literal("delete"),
          calendar: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          eventId: stringOrExpression.optional(),
          options: z.object({ sendUpdates: z.union([z.literal("all"), z.literal("externalOnly"), z.literal("none"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("event").default("event"),
          operation: z.literal("get"),
          calendar: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          eventId: stringOrExpression.optional(),
          options: z.object({ maxAttendees: numberOrExpression.optional(), returnNextInstance: booleanOrExpression.optional(), timeZone: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("event").default("event"),
          operation: z.literal("getAll"),
          calendar: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          timeMin: stringOrExpression.optional(),
          timeMax: stringOrExpression.optional(),
          options: z.object({ timeMin: stringOrExpression.optional(), timeMax: stringOrExpression.optional(), singleEvents: booleanOrExpression.optional(), fields: stringOrExpression.optional(), iCalUID: stringOrExpression.optional(), maxAttendees: numberOrExpression.optional(), orderBy: z.union([z.literal("startTime"), z.literal("updated"), expressionSchema]).optional(), query: stringOrExpression.optional(), recurringEventHandling: z.union([z.literal("expand"), z.literal("first"), z.literal("next"), expressionSchema]).optional(), showDeleted: booleanOrExpression.optional(), showHiddenInvitations: booleanOrExpression.optional(), timeZone: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(), updatedMin: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("event").default("event"),
          operation: z.literal("update"),
          calendar: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          eventId: stringOrExpression.optional(),
          modifyTarget: resolveSchema({ parameters, schema: z.union([z.literal("instance"), z.literal("event"), expressionSchema]), required: false, displayOptions: { "show": { "@tool": [false], "eventId": [{ "_cnd": { "includes": "_" } }] } }, defaults: { "eventId": "" } }),
          useDefaultReminders: booleanOrExpression.optional(),
          updateFields: z.object({ allday: z.union([z.literal("yes"), z.literal("no"), expressionSchema]).optional(), attendeesUi: z.unknown().optional(), attendees: stringOrExpression.optional(), color: stringOrExpression.optional(), description: stringOrExpression.optional(), end: stringOrExpression.optional(), guestsCanInviteOthers: booleanOrExpression.optional(), guestsCanModify: booleanOrExpression.optional(), guestsCanSeeOtherGuests: booleanOrExpression.optional(), id: stringOrExpression.optional(), location: stringOrExpression.optional(), maxAttendees: numberOrExpression.optional(), repeatFrecuency: z.union([z.literal("Daily"), z.literal("weekly"), z.literal("monthly"), z.literal("yearly"), expressionSchema]).optional(), repeatHowManyTimes: numberOrExpression.optional(), repeatUntil: stringOrExpression.optional(), rrule: stringOrExpression.optional(), sendUpdates: z.union([z.literal("all"), z.literal("externalOnly"), z.literal("none"), expressionSchema]).optional(), showMeAs: z.union([z.literal("transparent"), z.literal("opaque"), expressionSchema]).optional(), start: stringOrExpression.optional(), summary: stringOrExpression.optional(), visibility: z.union([z.literal("confidential"), z.literal("default"), z.literal("public"), z.literal("private"), expressionSchema]).optional() }).optional(),
          remindersUi: resolveSchema({ parameters, schema: z.object({ remindersValues: z.array(z.object({ method: z.union([z.literal("email"), z.literal("popup"), expressionSchema]).optional(), minutes: numberOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "useDefaultReminders": [false] } }, defaults: { "useDefaultReminders": true } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/resource_event/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "availability" } : parameters;
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleCalendar/v13/index.schema.js
var getCalendarSchema = require_index_schema();
var getEventSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "event" } : parameters;
  return z.union([
    getCalendarSchema({ ...helpers, parameters: effectiveParams }),
    getEventSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
