var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alert").default("alert"),
          operation: z.literal("create").default("create"),
          alertFields: resourceMapperValueSchema.optional(),
          observableUi: z.object({ values: z.array(z.object({ dataType: stringOrExpression.optional(), data: stringOrExpression.optional(), binaryProperty: stringOrExpression.optional(), message: stringOrExpression.optional(), tags: stringOrExpression.optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_delete_alert.schema.js
var require_operation_delete_alert_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_delete_alert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alert").default("alert"),
          operation: z.literal("deleteAlert"),
          alertId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_execute_responder.schema.js
var require_operation_execute_responder_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_execute_responder.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alert").default("alert"),
          operation: z.literal("executeResponder"),
          id: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          responder: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "id": [""] } }, defaults: { "id": { "mode": "list", "value": "" } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alert").default("alert"),
          operation: z.literal("get"),
          alertId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          options: z.object({ includeSimilarAlerts: booleanOrExpression.optional(), includeSimilarCases: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_merge.schema.js
var require_operation_merge_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_merge.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alert").default("alert"),
          operation: z.literal("merge"),
          alertId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          caseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_promote.schema.js
var require_operation_promote_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_promote.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alert").default("alert"),
          operation: z.literal("promote"),
          alertId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          options: z.object({ caseTemplate: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_search.schema.js
var require_operation_search_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alert").default("alert"),
          operation: z.literal("search"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ values: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), operator: z.union([z.literal("_between"), z.literal("_like"), z.literal("_endsWith"), z.literal("_eq"), z.literal("_gt"), z.literal("_gte"), z.literal("_in"), z.literal("_lt"), z.literal("_lte"), z.literal("_match"), z.literal("_ne"), z.literal("_startsWith"), expressionSchema]).optional(), value: stringOrExpression.optional(), values: stringOrExpression.optional(), from: stringOrExpression.optional(), to: stringOrExpression.optional() })).optional() }).optional(),
          sort: z.object({ fields: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), direction: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() })).optional() }).optional(),
          options: z.object({ returnCount: booleanOrExpression.optional(), extraData: z.array(z.union([z.literal("isOwner"), z.literal("links"), z.literal("permissions"), z.literal("seen"), z.literal("shareCount"), z.literal("shares")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("actionRequiredMap"), z.literal("case"), z.literal("caseId"), z.literal("caseTemplate"), z.literal("caseTemplateId"), z.literal("shareCount")])).optional(), extraData: z.array(z.union([z.literal("caseNumber"), z.literal("importDate"), z.literal("procedureCount"), z.literal("status")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("alertCount"), z.literal("alerts"), z.literal("attachmentCount"), z.literal("contributors"), z.literal("computed.handlingDuration"), z.literal("computed.handlingDurationInDays"), z.literal("computed.handlingDurationInHours"), z.literal("computed.handlingDurationInMinutes"), z.literal("computed.handlingDurationInSeconds"), z.literal("isOwner"), z.literal("observableStats"), z.literal("permissions"), z.literal("procedureCount"), z.literal("shareCount"), z.literal("similarAlerts"), z.literal("status"), z.literal("taskStats")])).optional(), extraData: z.array(z.union([z.literal("links")])).optional(), extraData: z.array(z.union([z.literal("actionCount"), z.literal("case"), z.literal("task"), z.literal("taskId")])).optional(), extraData: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_status.schema.js
var require_operation_status_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_status.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alert").default("alert"),
          operation: z.literal("status"),
          alertId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          status: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alert").default("alert"),
          operation: z.literal("update"),
          alertUpdateFields: resourceMapperValueSchema.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_alert/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteAlertSchema = require_operation_delete_alert_schema();
    var getExecuteResponderSchema = require_operation_execute_responder_schema();
    var getGetSchema = require_operation_get_schema();
    var getMergeSchema = require_operation_merge_schema();
    var getPromoteSchema = require_operation_promote_schema();
    var getSearchSchema = require_operation_search_schema();
    var getStatusSchema = require_operation_status_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteAlertSchema({ ...helpers, parameters: effectiveParams }),
        getExecuteResponderSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getMergeSchema({ ...helpers, parameters: effectiveParams }),
        getPromoteSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams }),
        getStatusSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_add_attachment.schema.js
var require_operation_add_attachment_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_add_attachment.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("addAttachment"),
          caseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          attachmentsUi: z.object({ values: z.array(z.object({ field: stringOrExpression.optional() })).optional() }).optional(),
          options: z.object({ canRename: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("create").default("create"),
          caseFields: resourceMapperValueSchema.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_delete_attachment.schema.js
var require_operation_delete_attachment_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_delete_attachment.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("deleteAttachment"),
          caseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          attachmentId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_delete_case.schema.js
var require_operation_delete_case_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_delete_case.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("deleteCase"),
          caseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_execute_responder.schema.js
var require_operation_execute_responder_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_execute_responder.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("executeResponder"),
          id: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          responder: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "id": [""] } }, defaults: { "id": { "mode": "list", "value": "" } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("get"),
          caseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_get_attachment.schema.js
var require_operation_get_attachment_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_get_attachment.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("getAttachment"),
          caseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          attachmentId: stringOrExpression.optional(),
          options: z.object({ fileName: stringOrExpression.optional(), dataPropertyName: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_get_timeline.schema.js
var require_operation_get_timeline_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_get_timeline.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("getTimeline"),
          caseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_search.schema.js
var require_operation_search_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("search"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ values: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), operator: z.union([z.literal("_between"), z.literal("_like"), z.literal("_endsWith"), z.literal("_eq"), z.literal("_gt"), z.literal("_gte"), z.literal("_in"), z.literal("_lt"), z.literal("_lte"), z.literal("_match"), z.literal("_ne"), z.literal("_startsWith"), expressionSchema]).optional(), value: stringOrExpression.optional(), values: stringOrExpression.optional(), from: stringOrExpression.optional(), to: stringOrExpression.optional() })).optional() }).optional(),
          sort: z.object({ fields: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), direction: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() })).optional() }).optional(),
          options: z.object({ returnCount: booleanOrExpression.optional(), extraData: z.array(z.union([z.literal("isOwner"), z.literal("links"), z.literal("permissions"), z.literal("seen"), z.literal("shareCount"), z.literal("shares")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("actionRequiredMap"), z.literal("case"), z.literal("caseId"), z.literal("caseTemplate"), z.literal("caseTemplateId"), z.literal("shareCount")])).optional(), extraData: z.array(z.union([z.literal("caseNumber"), z.literal("importDate"), z.literal("procedureCount"), z.literal("status")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("alertCount"), z.literal("alerts"), z.literal("attachmentCount"), z.literal("contributors"), z.literal("computed.handlingDuration"), z.literal("computed.handlingDurationInDays"), z.literal("computed.handlingDurationInHours"), z.literal("computed.handlingDurationInMinutes"), z.literal("computed.handlingDurationInSeconds"), z.literal("isOwner"), z.literal("observableStats"), z.literal("permissions"), z.literal("procedureCount"), z.literal("shareCount"), z.literal("similarAlerts"), z.literal("status"), z.literal("taskStats")])).optional(), extraData: z.array(z.union([z.literal("links")])).optional(), extraData: z.array(z.union([z.literal("actionCount"), z.literal("case"), z.literal("task"), z.literal("taskId")])).optional(), extraData: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("case"),
          operation: z.literal("update"),
          caseUpdateFields: resourceMapperValueSchema.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_case/index.schema.js"(exports2, module2) {
    var getAddAttachmentSchema = require_operation_add_attachment_schema();
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteAttachmentSchema = require_operation_delete_attachment_schema();
    var getDeleteCaseSchema = require_operation_delete_case_schema();
    var getExecuteResponderSchema = require_operation_execute_responder_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getGetAttachmentSchema = require_operation_get_attachment_schema();
    var getGetTimelineSchema = require_operation_get_timeline_schema();
    var getSearchSchema = require_operation_search_schema2();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddAttachmentSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteAttachmentSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteCaseSchema({ ...helpers, parameters: effectiveParams }),
        getExecuteResponderSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAttachmentSchema({ ...helpers, parameters: effectiveParams }),
        getGetTimelineSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_comment/operation_add.schema.js
var require_operation_add_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_comment/operation_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("comment"),
          operation: z.literal("add"),
          addTo: z.union([z.literal("alert"), z.literal("case"), expressionSchema]).optional(),
          id: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "addTo": ["case", "alert"] } }, defaults: { "addTo": "alert" } }),
          message: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_comment/operation_delete_comment.schema.js
var require_operation_delete_comment_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_comment/operation_delete_comment.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("comment"),
          operation: z.literal("deleteComment"),
          commentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_comment/operation_search.schema.js
var require_operation_search_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_comment/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("comment"),
          operation: z.literal("search"),
          searchIn: z.union([z.literal("all"), z.literal("alert"), z.literal("case"), expressionSchema]).optional(),
          caseId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "searchIn": ["case"] } }, defaults: { "searchIn": "all" } }),
          alertId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "searchIn": ["alert"] } }, defaults: { "searchIn": "all" } }),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ values: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), operator: z.union([z.literal("_between"), z.literal("_like"), z.literal("_endsWith"), z.literal("_eq"), z.literal("_gt"), z.literal("_gte"), z.literal("_in"), z.literal("_lt"), z.literal("_lte"), z.literal("_match"), z.literal("_ne"), z.literal("_startsWith"), expressionSchema]).optional(), value: stringOrExpression.optional(), values: stringOrExpression.optional(), from: stringOrExpression.optional(), to: stringOrExpression.optional() })).optional() }).optional(),
          sort: z.object({ fields: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), direction: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() })).optional() }).optional(),
          options: z.object({ returnCount: booleanOrExpression.optional(), extraData: z.array(z.union([z.literal("isOwner"), z.literal("links"), z.literal("permissions"), z.literal("seen"), z.literal("shareCount"), z.literal("shares")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("actionRequiredMap"), z.literal("case"), z.literal("caseId"), z.literal("caseTemplate"), z.literal("caseTemplateId"), z.literal("shareCount")])).optional(), extraData: z.array(z.union([z.literal("caseNumber"), z.literal("importDate"), z.literal("procedureCount"), z.literal("status")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("alertCount"), z.literal("alerts"), z.literal("attachmentCount"), z.literal("contributors"), z.literal("computed.handlingDuration"), z.literal("computed.handlingDurationInDays"), z.literal("computed.handlingDurationInHours"), z.literal("computed.handlingDurationInMinutes"), z.literal("computed.handlingDurationInSeconds"), z.literal("isOwner"), z.literal("observableStats"), z.literal("permissions"), z.literal("procedureCount"), z.literal("shareCount"), z.literal("similarAlerts"), z.literal("status"), z.literal("taskStats")])).optional(), extraData: z.array(z.union([z.literal("links")])).optional(), extraData: z.array(z.union([z.literal("actionCount"), z.literal("case"), z.literal("task"), z.literal("taskId")])).optional(), extraData: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_comment/operation_update.schema.js
var require_operation_update_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_comment/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("comment"),
          operation: z.literal("update"),
          commentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          message: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_comment/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_comment/index.schema.js"(exports2, module2) {
    var getAddSchema = require_operation_add_schema();
    var getDeleteCommentSchema = require_operation_delete_comment_schema();
    var getSearchSchema = require_operation_search_schema3();
    var getUpdateSchema = require_operation_update_schema3();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteCommentSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_create.schema.js
var require_operation_create_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("observable"),
          operation: z.literal("create").default("create"),
          createIn: z.union([z.literal("case"), z.literal("alert"), expressionSchema]).optional(),
          id: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "createIn": ["case", "alert"] } }, defaults: { "createIn": "case" } }),
          dataType: stringOrExpression.optional(),
          data: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "dataType": ["file"] } }, defaults: { "dataType": "file" } }),
          attachmentsUi: resolveSchema({ parameters, schema: z.object({ values: z.array(z.object({ field: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "dataType": ["file"] } }, defaults: { "dataType": "file" } }),
          observableFields: resourceMapperValueSchema.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_delete_observable.schema.js
var require_operation_delete_observable_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_delete_observable.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("observable"),
          operation: z.literal("deleteObservable"),
          observableId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_execute_analyzer.schema.js
var require_operation_execute_analyzer_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_execute_analyzer.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("observable"),
          operation: z.literal("executeAnalyzer"),
          observableId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          dataType: stringOrExpression.optional(),
          analyzers: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "hide": { "id": [""] } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_execute_responder.schema.js
var require_operation_execute_responder_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_execute_responder.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("observable"),
          operation: z.literal("executeResponder"),
          id: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          responder: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "id": [""] } }, defaults: { "id": { "mode": "list", "value": "" } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("observable"),
          operation: z.literal("get"),
          observableId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_search.schema.js
var require_operation_search_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("observable"),
          operation: z.literal("search"),
          searchIn: z.union([z.literal("all"), z.literal("alert"), z.literal("case"), expressionSchema]).optional(),
          caseId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "searchIn": ["case"] } }, defaults: { "searchIn": "all" } }),
          alertId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "searchIn": ["alert"] } }, defaults: { "searchIn": "all" } }),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ values: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), operator: z.union([z.literal("_between"), z.literal("_like"), z.literal("_endsWith"), z.literal("_eq"), z.literal("_gt"), z.literal("_gte"), z.literal("_in"), z.literal("_lt"), z.literal("_lte"), z.literal("_match"), z.literal("_ne"), z.literal("_startsWith"), expressionSchema]).optional(), value: stringOrExpression.optional(), values: stringOrExpression.optional(), from: stringOrExpression.optional(), to: stringOrExpression.optional() })).optional() }).optional(),
          sort: z.object({ fields: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), direction: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() })).optional() }).optional(),
          options: z.object({ returnCount: booleanOrExpression.optional(), extraData: z.array(z.union([z.literal("isOwner"), z.literal("links"), z.literal("permissions"), z.literal("seen"), z.literal("shareCount"), z.literal("shares")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("actionRequiredMap"), z.literal("case"), z.literal("caseId"), z.literal("caseTemplate"), z.literal("caseTemplateId"), z.literal("shareCount")])).optional(), extraData: z.array(z.union([z.literal("caseNumber"), z.literal("importDate"), z.literal("procedureCount"), z.literal("status")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("alertCount"), z.literal("alerts"), z.literal("attachmentCount"), z.literal("contributors"), z.literal("computed.handlingDuration"), z.literal("computed.handlingDurationInDays"), z.literal("computed.handlingDurationInHours"), z.literal("computed.handlingDurationInMinutes"), z.literal("computed.handlingDurationInSeconds"), z.literal("isOwner"), z.literal("observableStats"), z.literal("permissions"), z.literal("procedureCount"), z.literal("shareCount"), z.literal("similarAlerts"), z.literal("status"), z.literal("taskStats")])).optional(), extraData: z.array(z.union([z.literal("links")])).optional(), extraData: z.array(z.union([z.literal("actionCount"), z.literal("case"), z.literal("task"), z.literal("taskId")])).optional(), extraData: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_update.schema.js
var require_operation_update_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("observable"),
          operation: z.literal("update"),
          observableUpdateFields: resourceMapperValueSchema.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_observable/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema3();
    var getDeleteObservableSchema = require_operation_delete_observable_schema();
    var getExecuteAnalyzerSchema = require_operation_execute_analyzer_schema();
    var getExecuteResponderSchema = require_operation_execute_responder_schema3();
    var getGetSchema = require_operation_get_schema3();
    var getSearchSchema = require_operation_search_schema4();
    var getUpdateSchema = require_operation_update_schema4();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteObservableSchema({ ...helpers, parameters: effectiveParams }),
        getExecuteAnalyzerSchema({ ...helpers, parameters: effectiveParams }),
        getExecuteResponderSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_page/operation_create.schema.js
var require_operation_create_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_page/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("page"),
          operation: z.literal("create").default("create"),
          location: z.union([z.literal("case"), z.literal("knowledgeBase"), expressionSchema]).optional(),
          caseId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "location": ["case"] } }, defaults: { "location": "case" } }),
          title: stringOrExpression.optional(),
          category: stringOrExpression.optional(),
          content: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_page/operation_delete_page.schema.js
var require_operation_delete_page_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_page/operation_delete_page.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("page"),
          operation: z.literal("deletePage"),
          location: z.union([z.literal("case"), z.literal("knowledgeBase"), expressionSchema]).optional(),
          caseId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "location": ["case"] } }, defaults: { "location": "knowledgeBase" } }),
          pageId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_page/operation_search.schema.js
var require_operation_search_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_page/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("page"),
          operation: z.literal("search"),
          searchInKnowledgeBase: booleanOrExpression.optional(),
          caseId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "searchInKnowledgeBase": [false] } }, defaults: { "searchInKnowledgeBase": true } }),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ values: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), operator: z.union([z.literal("_between"), z.literal("_like"), z.literal("_endsWith"), z.literal("_eq"), z.literal("_gt"), z.literal("_gte"), z.literal("_in"), z.literal("_lt"), z.literal("_lte"), z.literal("_match"), z.literal("_ne"), z.literal("_startsWith"), expressionSchema]).optional(), value: stringOrExpression.optional(), values: stringOrExpression.optional(), from: stringOrExpression.optional(), to: stringOrExpression.optional() })).optional() }).optional(),
          sort: z.object({ fields: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), direction: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() })).optional() }).optional(),
          options: resolveSchema({ parameters, schema: z.object({ returnCount: booleanOrExpression.optional(), extraData: z.array(z.union([z.literal("isOwner"), z.literal("links"), z.literal("permissions"), z.literal("seen"), z.literal("shareCount"), z.literal("shares")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("actionRequiredMap"), z.literal("case"), z.literal("caseId"), z.literal("caseTemplate"), z.literal("caseTemplateId"), z.literal("shareCount")])).optional(), extraData: z.array(z.union([z.literal("caseNumber"), z.literal("importDate"), z.literal("procedureCount"), z.literal("status")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("alertCount"), z.literal("alerts"), z.literal("attachmentCount"), z.literal("contributors"), z.literal("computed.handlingDuration"), z.literal("computed.handlingDurationInDays"), z.literal("computed.handlingDurationInHours"), z.literal("computed.handlingDurationInMinutes"), z.literal("computed.handlingDurationInSeconds"), z.literal("isOwner"), z.literal("observableStats"), z.literal("permissions"), z.literal("procedureCount"), z.literal("shareCount"), z.literal("similarAlerts"), z.literal("status"), z.literal("taskStats")])).optional(), extraData: z.array(z.union([z.literal("links")])).optional(), extraData: z.array(z.union([z.literal("actionCount"), z.literal("case"), z.literal("task"), z.literal("taskId")])).optional(), extraData: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "returnAll": [true] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_page/operation_update.schema.js
var require_operation_update_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_page/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("page"),
          operation: z.literal("update"),
          location: z.union([z.literal("case"), z.literal("knowledgeBase"), expressionSchema]).optional(),
          caseId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "location": ["case"] } }, defaults: { "location": "case" } }),
          pageId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          content: stringOrExpression.optional(),
          options: z.object({ category: stringOrExpression.optional(), title: stringOrExpression.optional(), order: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_page/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_page/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema4();
    var getDeletePageSchema = require_operation_delete_page_schema();
    var getSearchSchema = require_operation_search_schema5();
    var getUpdateSchema = require_operation_update_schema5();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeletePageSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_query/operation_execute_query.schema.js
var require_operation_execute_query_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_query/operation_execute_query.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("query"),
          operation: z.literal("executeQuery"),
          queryJson: z.union([iDataObjectSchema, z.string()]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_query/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_query/index.schema.js"(exports2, module2) {
    var getExecuteQuerySchema = require_operation_execute_query_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getExecuteQuerySchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_create.schema.js
var require_operation_create_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("create").default("create"),
          caseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          taskFields: resourceMapperValueSchema.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_delete_task.schema.js
var require_operation_delete_task_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_delete_task.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("deleteTask"),
          taskId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_execute_responder.schema.js
var require_operation_execute_responder_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_execute_responder.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("executeResponder"),
          id: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          responder: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "id": [""] } }, defaults: { "id": { "mode": "list", "value": "" } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("get"),
          taskId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_search.schema.js
var require_operation_search_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("search"),
          allCases: booleanOrExpression.optional(),
          caseId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "allCases": [false] } }, defaults: { "allCases": true } }),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ values: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), operator: z.union([z.literal("_between"), z.literal("_like"), z.literal("_endsWith"), z.literal("_eq"), z.literal("_gt"), z.literal("_gte"), z.literal("_in"), z.literal("_lt"), z.literal("_lte"), z.literal("_match"), z.literal("_ne"), z.literal("_startsWith"), expressionSchema]).optional(), value: stringOrExpression.optional(), values: stringOrExpression.optional(), from: stringOrExpression.optional(), to: stringOrExpression.optional() })).optional() }).optional(),
          sort: z.object({ fields: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), direction: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() })).optional() }).optional(),
          options: z.object({ returnCount: booleanOrExpression.optional(), extraData: z.array(z.union([z.literal("isOwner"), z.literal("links"), z.literal("permissions"), z.literal("seen"), z.literal("shareCount"), z.literal("shares")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("actionRequiredMap"), z.literal("case"), z.literal("caseId"), z.literal("caseTemplate"), z.literal("caseTemplateId"), z.literal("shareCount")])).optional(), extraData: z.array(z.union([z.literal("caseNumber"), z.literal("importDate"), z.literal("procedureCount"), z.literal("status")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("alertCount"), z.literal("alerts"), z.literal("attachmentCount"), z.literal("contributors"), z.literal("computed.handlingDuration"), z.literal("computed.handlingDurationInDays"), z.literal("computed.handlingDurationInHours"), z.literal("computed.handlingDurationInMinutes"), z.literal("computed.handlingDurationInSeconds"), z.literal("isOwner"), z.literal("observableStats"), z.literal("permissions"), z.literal("procedureCount"), z.literal("shareCount"), z.literal("similarAlerts"), z.literal("status"), z.literal("taskStats")])).optional(), extraData: z.array(z.union([z.literal("links")])).optional(), extraData: z.array(z.union([z.literal("actionCount"), z.literal("case"), z.literal("task"), z.literal("taskId")])).optional(), extraData: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_update.schema.js
var require_operation_update_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("update"),
          taskUpdateFields: resourceMapperValueSchema.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/index.schema.js
var require_index_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_task/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema5();
    var getDeleteTaskSchema = require_operation_delete_task_schema();
    var getExecuteResponderSchema = require_operation_execute_responder_schema4();
    var getGetSchema = require_operation_get_schema4();
    var getSearchSchema = require_operation_search_schema6();
    var getUpdateSchema = require_operation_update_schema6();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteTaskSchema({ ...helpers, parameters: effectiveParams }),
        getExecuteResponderSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_add_attachment.schema.js
var require_operation_add_attachment_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_add_attachment.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("log"),
          operation: z.literal("addAttachment"),
          logId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          attachmentsUi: z.object({ values: z.array(z.object({ field: stringOrExpression.optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_create.schema.js
var require_operation_create_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("log"),
          operation: z.literal("create").default("create"),
          taskId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          logFields: resourceMapperValueSchema.optional(),
          attachmentsUi: z.object({ values: z.array(z.object({ field: stringOrExpression.optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_delete_attachment.schema.js
var require_operation_delete_attachment_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_delete_attachment.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("log"),
          operation: z.literal("deleteAttachment"),
          logId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          attachmentId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_delete_log.schema.js
var require_operation_delete_log_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_delete_log.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("log"),
          operation: z.literal("deleteLog"),
          logId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_execute_responder.schema.js
var require_operation_execute_responder_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_execute_responder.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("log"),
          operation: z.literal("executeResponder"),
          id: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          responder: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "id": [""] } }, defaults: { "id": { "mode": "list", "value": "" } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_get.schema.js
var require_operation_get_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("log"),
          operation: z.literal("get"),
          logId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_search.schema.js
var require_operation_search_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("log"),
          operation: z.literal("search"),
          allTasks: booleanOrExpression.optional(),
          taskId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "allTasks": [false] } }, defaults: { "allTasks": true } }),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ values: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), operator: z.union([z.literal("_between"), z.literal("_like"), z.literal("_endsWith"), z.literal("_eq"), z.literal("_gt"), z.literal("_gte"), z.literal("_in"), z.literal("_lt"), z.literal("_lte"), z.literal("_match"), z.literal("_ne"), z.literal("_startsWith"), expressionSchema]).optional(), value: stringOrExpression.optional(), values: stringOrExpression.optional(), from: stringOrExpression.optional(), to: stringOrExpression.optional() })).optional() }).optional(),
          sort: z.object({ fields: z.array(z.object({ field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: stringOrExpression.optional(), field: z.union([z.literal("message"), z.literal("date"), expressionSchema]).optional(), field: z.union([z.literal("message"), expressionSchema]).optional(), field: z.union([z.literal("category"), z.literal("content"), z.literal("title"), expressionSchema]).optional(), direction: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() })).optional() }).optional(),
          options: z.object({ returnCount: booleanOrExpression.optional(), extraData: z.array(z.union([z.literal("isOwner"), z.literal("links"), z.literal("permissions"), z.literal("seen"), z.literal("shareCount"), z.literal("shares")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("actionRequiredMap"), z.literal("case"), z.literal("caseId"), z.literal("caseTemplate"), z.literal("caseTemplateId"), z.literal("shareCount")])).optional(), extraData: z.array(z.union([z.literal("caseNumber"), z.literal("importDate"), z.literal("procedureCount"), z.literal("status")])).optional(), extraData: z.array(z.union([z.literal("actionRequired"), z.literal("alertCount"), z.literal("alerts"), z.literal("attachmentCount"), z.literal("contributors"), z.literal("computed.handlingDuration"), z.literal("computed.handlingDurationInDays"), z.literal("computed.handlingDurationInHours"), z.literal("computed.handlingDurationInMinutes"), z.literal("computed.handlingDurationInSeconds"), z.literal("isOwner"), z.literal("observableStats"), z.literal("permissions"), z.literal("procedureCount"), z.literal("shareCount"), z.literal("similarAlerts"), z.literal("status"), z.literal("taskStats")])).optional(), extraData: z.array(z.union([z.literal("links")])).optional(), extraData: z.array(z.union([z.literal("actionCount"), z.literal("case"), z.literal("task"), z.literal("taskId")])).optional(), extraData: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/index.schema.js
var require_index_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/resource_log/index.schema.js"(exports2, module2) {
    var getAddAttachmentSchema = require_operation_add_attachment_schema2();
    var getCreateSchema = require_operation_create_schema6();
    var getDeleteAttachmentSchema = require_operation_delete_attachment_schema2();
    var getDeleteLogSchema = require_operation_delete_log_schema();
    var getExecuteResponderSchema = require_operation_execute_responder_schema5();
    var getGetSchema = require_operation_get_schema5();
    var getSearchSchema = require_operation_search_schema7();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getAddAttachmentSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteAttachmentSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteLogSchema({ ...helpers, parameters: effectiveParams }),
        getExecuteResponderSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/theHiveProject/v1/index.schema.js
var getAlertSchema = require_index_schema();
var getCaseSchema = require_index_schema2();
var getCommentSchema = require_index_schema3();
var getObservableSchema = require_index_schema4();
var getPageSchema = require_index_schema5();
var getQuerySchema = require_index_schema6();
var getTaskSchema = require_index_schema7();
var getLogSchema = require_index_schema8();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "alert" } : parameters;
  return z.union([
    getAlertSchema({ ...helpers, parameters: effectiveParams }),
    getCaseSchema({ ...helpers, parameters: effectiveParams }),
    getCommentSchema({ ...helpers, parameters: effectiveParams }),
    getObservableSchema({ ...helpers, parameters: effectiveParams }),
    getPageSchema({ ...helpers, parameters: effectiveParams }),
    getQuerySchema({ ...helpers, parameters: effectiveParams }),
    getTaskSchema({ ...helpers, parameters: effectiveParams }),
    getLogSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
