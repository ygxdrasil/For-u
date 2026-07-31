var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("activity").default("activity"),
          operation: z.literal("create").default("create"),
          name: stringOrExpression.optional(),
          sport_type: z.union([z.literal("AlpineSki"), z.literal("BackcountrySki"), z.literal("Badminton"), z.literal("Canoeing"), z.literal("Crossfit"), z.literal("EBikeRide"), z.literal("Elliptical"), z.literal("EMountainBikeRide"), z.literal("Golf"), z.literal("GravelRide"), z.literal("Handcycle"), z.literal("HighIntensityIntervalTraining"), z.literal("Hike"), z.literal("IceSkate"), z.literal("InlineSkate"), z.literal("Kayaking"), z.literal("Kitesurf"), z.literal("MountainBikeRide"), z.literal("NordicSki"), z.literal("Pickleball"), z.literal("Pilates"), z.literal("Racquetball"), z.literal("Ride"), z.literal("RockClimbing"), z.literal("RollerSki"), z.literal("Rowing"), z.literal("Run"), z.literal("Sail"), z.literal("Skateboard"), z.literal("Snowboard"), z.literal("Snowshoe"), z.literal("Soccer"), z.literal("Squash"), z.literal("StairStepper"), z.literal("StandUpPaddling"), z.literal("Surfing"), z.literal("Swim"), z.literal("TableTennis"), z.literal("Tennis"), z.literal("TrailRun"), z.literal("Velomobile"), z.literal("VirtualRide"), z.literal("VirtualRow"), z.literal("VirtualRun"), z.literal("Walk"), z.literal("WeightTraining"), z.literal("Wheelchair"), z.literal("Windsurf"), z.literal("Workout"), z.literal("Yoga"), expressionSchema]).optional(),
          startDate: stringOrExpression.optional(),
          elapsedTime: numberOrExpression.optional(),
          additionalFields: z.object({ commute: booleanOrExpression.optional(), description: stringOrExpression.optional(), distance: numberOrExpression.optional(), trainer: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("activity").default("activity"),
          operation: z.literal("get"),
          activityId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("activity").default("activity"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_comments.schema.js
var require_operation_get_comments_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_comments.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("activity").default("activity"),
          operation: z.literal("getComments"),
          activityId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_kudos.schema.js
var require_operation_get_kudos_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_kudos.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("activity").default("activity"),
          operation: z.literal("getKudos"),
          activityId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_laps.schema.js
var require_operation_get_laps_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_laps.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("activity").default("activity"),
          operation: z.literal("getLaps"),
          activityId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_streams.schema.js
var require_operation_get_streams_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_streams.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("activity").default("activity"),
          operation: z.literal("getStreams"),
          activityId: stringOrExpression.optional(),
          keys: z.array(z.union([z.literal("altitude"), z.literal("cadence"), z.literal("distance"), z.literal("grade_smooth"), z.literal("heartrate"), z.literal("latlng"), z.literal("moving"), z.literal("temp"), z.literal("time"), z.literal("velocity_smooth"), z.literal("watts")])).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_zones.schema.js
var require_operation_get_zones_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_get_zones.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("activity").default("activity"),
          operation: z.literal("getZones"),
          activityId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("activity").default("activity"),
          operation: z.literal("update"),
          activityId: stringOrExpression.optional(),
          updateFields: z.object({ commute: booleanOrExpression.optional(), description: stringOrExpression.optional(), gear_id: stringOrExpression.optional(), hide_from_home: booleanOrExpression.optional(), name: stringOrExpression.optional(), type: stringOrExpression.optional(), sport_type: z.union([z.literal("AlpineSki"), z.literal("BackcountrySki"), z.literal("Badminton"), z.literal("Canoeing"), z.literal("Crossfit"), z.literal("EBikeRide"), z.literal("Elliptical"), z.literal("EMountainBikeRide"), z.literal("Golf"), z.literal("GravelRide"), z.literal("Handcycle"), z.literal("HighIntensityIntervalTraining"), z.literal("Hike"), z.literal("IceSkate"), z.literal("InlineSkate"), z.literal("Kayaking"), z.literal("Kitesurf"), z.literal("MountainBikeRide"), z.literal("NordicSki"), z.literal("Pickleball"), z.literal("Pilates"), z.literal("Racquetball"), z.literal("Ride"), z.literal("RockClimbing"), z.literal("RollerSki"), z.literal("Rowing"), z.literal("Run"), z.literal("Sail"), z.literal("Skateboard"), z.literal("Snowboard"), z.literal("Snowshoe"), z.literal("Soccer"), z.literal("Squash"), z.literal("StairStepper"), z.literal("StandUpPaddling"), z.literal("Surfing"), z.literal("Swim"), z.literal("TableTennis"), z.literal("Tennis"), z.literal("TrailRun"), z.literal("Velomobile"), z.literal("VirtualRide"), z.literal("VirtualRow"), z.literal("VirtualRun"), z.literal("Walk"), z.literal("WeightTraining"), z.literal("Wheelchair"), z.literal("Windsurf"), z.literal("Workout"), z.literal("Yoga"), expressionSchema]).optional(), trainer: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/resource_activity/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getGetCommentsSchema = require_operation_get_comments_schema();
    var getGetKudosSchema = require_operation_get_kudos_schema();
    var getGetLapsSchema = require_operation_get_laps_schema();
    var getGetStreamsSchema = require_operation_get_streams_schema();
    var getGetZonesSchema = require_operation_get_zones_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetCommentsSchema({ ...helpers, parameters: effectiveParams }),
        getGetKudosSchema({ ...helpers, parameters: effectiveParams }),
        getGetLapsSchema({ ...helpers, parameters: effectiveParams }),
        getGetStreamsSchema({ ...helpers, parameters: effectiveParams }),
        getGetZonesSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/strava/v11/index.schema.js
var getActivitySchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "activity" } : parameters;
  return getActivitySchema({ ...helpers, parameters: effectiveParams });
};
