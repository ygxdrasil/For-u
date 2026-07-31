var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_account/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_account/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("get").default("get")
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_account/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_account/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return getGetSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alertContact"),
          operation: z.literal("create"),
          friendlyName: stringOrExpression.optional(),
          type: z.union([z.literal(4), z.literal(2), z.literal(6), z.literal(9), z.literal(1), z.literal(3), z.literal(5), expressionSchema]).optional(),
          value: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alertContact"),
          operation: z.literal("delete"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alertContact"),
          operation: z.literal("get").default("get"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alertContact"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ alert_contacts: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("alertContact"),
          operation: z.literal("update"),
          id: stringOrExpression.optional(),
          updateFields: z.object({ friendly_name: stringOrExpression.optional(), value: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_alert_contact/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("maintenanceWindow"),
          operation: z.literal("create"),
          duration: numberOrExpression.optional(),
          friendlyName: stringOrExpression.optional(),
          type: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), expressionSchema]).optional(),
          weekDay: resolveSchema({ parameters, schema: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), expressionSchema]), required: false, displayOptions: { "show": { "type": [3] } }, defaults: { "type": "" } }),
          monthDay: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "type": [4] } }, defaults: { "type": "" } }),
          start_time: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("maintenanceWindow"),
          operation: z.literal("delete"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("maintenanceWindow"),
          operation: z.literal("get").default("get"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("maintenanceWindow"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ mwindow: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("maintenanceWindow"),
          operation: z.literal("update"),
          id: stringOrExpression.optional(),
          duration: numberOrExpression.optional(),
          updateFields: z.object({ friendly_name: stringOrExpression.optional(), start_time: stringOrExpression.optional(), type: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), expressionSchema]).optional(), weekDay: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), expressionSchema]).optional(), monthDay: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_maintenance_window/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema2();
    var getGetSchema = require_operation_get_schema3();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_create.schema.js
var require_operation_create_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("monitor"),
          operation: z.literal("create"),
          friendlyName: stringOrExpression.optional(),
          type: z.union([z.literal(5), z.literal(1), z.literal(2), z.literal(3), z.literal(4), expressionSchema]).optional(),
          url: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_delete.schema.js
var require_operation_delete_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("monitor"),
          operation: z.literal("delete"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("monitor"),
          operation: z.literal("get").default("get"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("monitor"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ alert_contacts: booleanOrExpression.optional(), logs: booleanOrExpression.optional(), mwindow: booleanOrExpression.optional(), monitors: stringOrExpression.optional(), response_times: booleanOrExpression.optional(), search: stringOrExpression.optional(), statuses: z.array(z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(8), z.literal(9)])).optional(), types: z.array(z.union([z.literal(5), z.literal(1), z.literal(2), z.literal(3), z.literal(4)])).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_reset.schema.js
var require_operation_reset_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_reset.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("monitor"),
          operation: z.literal("reset"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_update.schema.js
var require_operation_update_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("monitor"),
          operation: z.literal("update"),
          id: stringOrExpression.optional(),
          updateFields: z.object({ friendly_name: stringOrExpression.optional(), http_auth_type: z.union([z.literal(1), z.literal(2), expressionSchema]).optional(), http_method: z.union([z.literal(6), z.literal(2), z.literal(1), z.literal(7), z.literal(5), z.literal(3), z.literal(4), expressionSchema]).optional(), http_password: stringOrExpression.optional(), http_username: stringOrExpression.optional(), interval: numberOrExpression.optional(), port: numberOrExpression.optional(), status: z.union([z.literal(0), z.literal(1), expressionSchema]).optional(), sub_type: z.union([z.literal(99), z.literal(3), z.literal(1), z.literal(2), z.literal(6), z.literal(5), z.literal(4), expressionSchema]).optional(), url: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_monitor/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema3();
    var getDeleteSchema = require_operation_delete_schema3();
    var getGetSchema = require_operation_get_schema4();
    var getGetAllSchema = require_operation_get_all_schema3();
    var getResetSchema = require_operation_reset_schema();
    var getUpdateSchema = require_operation_update_schema3();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getResetSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_public_status_page/operation_create.schema.js
var require_operation_create_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_public_status_page/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("publicStatusPage"),
          operation: z.literal("create"),
          friendlyName: stringOrExpression.optional(),
          monitors: stringOrExpression.optional(),
          additionalFields: z.object({ custom_domain: stringOrExpression.optional(), password: stringOrExpression.optional(), sort: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_public_status_page/operation_delete.schema.js
var require_operation_delete_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_public_status_page/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("publicStatusPage"),
          operation: z.literal("delete"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_public_status_page/operation_get.schema.js
var require_operation_get_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_public_status_page/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("publicStatusPage"),
          operation: z.literal("get").default("get"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_public_status_page/operation_get_all.schema.js
var require_operation_get_all_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_public_status_page/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("publicStatusPage"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ psps: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_public_status_page/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/resource_public_status_page/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema4();
    var getDeleteSchema = require_operation_delete_schema4();
    var getGetSchema = require_operation_get_schema5();
    var getGetAllSchema = require_operation_get_all_schema4();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/uptimeRobot/v1/index.schema.js
var getAccountSchema = require_index_schema();
var getAlertContactSchema = require_index_schema2();
var getMaintenanceWindowSchema = require_index_schema3();
var getMonitorSchema = require_index_schema4();
var getPublicStatusPageSchema = require_index_schema5();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "account" } : parameters;
  return z.union([
    getAccountSchema({ ...helpers, parameters: effectiveParams }),
    getAlertContactSchema({ ...helpers, parameters: effectiveParams }),
    getMaintenanceWindowSchema({ ...helpers, parameters: effectiveParams }),
    getMonitorSchema({ ...helpers, parameters: effectiveParams }),
    getPublicStatusPageSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
