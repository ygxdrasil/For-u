var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_customer/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_customer/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customer").default("customer"),
          operation: z.literal("delete"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_customer/operation_upsert.schema.js
var require_operation_upsert_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_customer/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customer").default("customer"),
          operation: z.literal("upsert"),
          id: stringOrExpression.optional(),
          jsonParameters: booleanOrExpression.optional(),
          additionalFieldsJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          additionalFields: resolveSchema({ parameters, schema: z.object({ customProperties: z.unknown().optional(), email: stringOrExpression.optional(), createdAt: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_customer/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_customer/index.schema.js"(exports2, module2) {
    var getDeleteSchema = require_operation_delete_schema();
    var getUpsertSchema = require_operation_upsert_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return z.union([
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_event/operation_track.schema.js
var require_operation_track_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_event/operation_track.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("event"),
          operation: z.literal("track"),
          customerId: stringOrExpression.optional(),
          eventName: stringOrExpression.optional(),
          jsonParameters: booleanOrExpression.optional(),
          additionalFieldsJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          additionalFields: resolveSchema({ parameters, schema: z.object({ customAttributes: z.unknown().optional(), type: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_event/operation_track_anonymous.schema.js
var require_operation_track_anonymous_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_event/operation_track_anonymous.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("event"),
          operation: z.literal("trackAnonymous"),
          eventName: stringOrExpression.optional(),
          jsonParameters: booleanOrExpression.optional(),
          additionalFieldsJson: resolveSchema({ parameters, schema: z.union([iDataObjectSchema, z.string()]), required: false, displayOptions: { "show": { "jsonParameters": [true] } }, defaults: { "jsonParameters": false } }),
          additionalFields: resolveSchema({ parameters, schema: z.object({ customAttributes: z.unknown().optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_event/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_event/index.schema.js"(exports2, module2) {
    var getTrackSchema = require_operation_track_schema();
    var getTrackAnonymousSchema = require_operation_track_anonymous_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return z.union([
        getTrackSchema({ ...helpers, parameters: effectiveParams }),
        getTrackAnonymousSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_campaign/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_campaign/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("campaign"),
          operation: z.literal("get").default("get"),
          campaignId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_campaign/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_campaign/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("campaign"),
          operation: z.literal("getAll")
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_campaign/operation_get_metrics.schema.js
var require_operation_get_metrics_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_campaign/operation_get_metrics.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("campaign"),
          operation: z.literal("getMetrics"),
          campaignId: numberOrExpression.optional(),
          period: z.union([z.literal("hours"), z.literal("days"), z.literal("weeks"), z.literal("months"), expressionSchema]).optional(),
          jsonParameters: booleanOrExpression.optional(),
          additionalFields: resolveSchema({ parameters, schema: z.object({ steps: numberOrExpression.optional(), type: z.union([z.literal("email"), z.literal("empty"), z.literal("push"), z.literal("slack"), z.literal("twilio"), z.literal("urbanAirship"), z.literal("webhook"), expressionSchema]).optional() }), required: false, displayOptions: { "show": { "jsonParameters": [false] } }, defaults: { "jsonParameters": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_campaign/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_campaign/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getGetMetricsSchema = require_operation_get_metrics_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetMetricsSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_segment/operation_add.schema.js
var require_operation_add_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_segment/operation_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("segment"),
          operation: z.literal("add"),
          segmentId: numberOrExpression.optional(),
          customerIds: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_segment/operation_remove.schema.js
var require_operation_remove_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_segment/operation_remove.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("segment"),
          operation: z.literal("remove"),
          segmentId: numberOrExpression.optional(),
          customerIds: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_segment/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/resource_segment/index.schema.js"(exports2, module2) {
    var getAddSchema = require_operation_add_schema();
    var getRemoveSchema = require_operation_remove_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return z.union([
        getAddSchema({ ...helpers, parameters: effectiveParams }),
        getRemoveSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/customerIo/v1/index.schema.js
var getCustomerSchema = require_index_schema();
var getEventSchema = require_index_schema2();
var getCampaignSchema = require_index_schema3();
var getSegmentSchema = require_index_schema4();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "customer" } : parameters;
  return z.union([
    getCustomerSchema({ ...helpers, parameters: effectiveParams }),
    getEventSchema({ ...helpers, parameters: effectiveParams }),
    getCampaignSchema({ ...helpers, parameters: effectiveParams }),
    getSegmentSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
