var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleAnalytics/v2/resource_report/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleAnalytics/v2/resource_report/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("report").default("report"),
          operation: z.literal("get").default("get"),
          propertyType: z.union([z.literal("ga4"), z.literal("universal")]).optional(),
          propertyId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "propertyType": ["ga4"] } }, defaults: { "propertyType": "ga4" } }),
          dateRange: resolveSchema({ parameters, schema: z.union([z.literal("last7days"), z.literal("last30days"), z.literal("today"), z.literal("yesterday"), z.literal("lastCalendarWeek"), z.literal("lastCalendarMonth"), z.literal("custom"), expressionSchema]), required: false, displayOptions: { "show": { "propertyType": ["ga4", "universal"] } }, defaults: { "propertyType": "ga4" } }),
          startDate: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dateRange": ["custom"], "propertyType": ["ga4", "universal"] } }, defaults: { "dateRange": "last7days", "propertyType": "ga4" } }),
          endDate: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "dateRange": ["custom"], "propertyType": ["ga4", "universal"] } }, defaults: { "dateRange": "last7days", "propertyType": "ga4" } }),
          metricsGA4: resolveSchema({ parameters, schema: z.object({ metricValues: z.array(z.object({ listName: z.union([z.literal("active1DayUsers"), z.literal("active28DayUsers"), z.literal("active7DayUsers"), z.literal("checkouts"), z.literal("eventCount"), z.literal("screenPageViews"), z.literal("userEngagementDuration"), z.literal("sessions"), z.literal("sessionsPerUser"), z.literal("totalUsers"), z.literal("other"), z.literal("custom"), expressionSchema]).optional(), name: stringOrExpression.optional(), name: stringOrExpression.optional(), expression: stringOrExpression.optional(), invisible: booleanOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "propertyType": ["ga4"] } }, defaults: { "propertyType": "ga4" } }),
          dimensionsGA4: resolveSchema({ parameters, schema: z.object({ dimensionValues: z.array(z.object({ listName: z.union([z.literal("browser"), z.literal("campaignName"), z.literal("city"), z.literal("country"), z.literal("date"), z.literal("deviceCategory"), z.literal("itemName"), z.literal("language"), z.literal("pageLocation"), z.literal("sourceMedium"), z.literal("other"), expressionSchema]).optional(), name: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "propertyType": ["ga4"] } }, defaults: { "propertyType": "ga4" } }),
          returnAll: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "propertyType": ["ga4", "universal"] } }, defaults: { "propertyType": "ga4" } }),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "propertyType": ["ga4", "universal"], "returnAll": [false] } }, defaults: { "propertyType": "ga4", "returnAll": false } }),
          simple: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "propertyType": ["ga4", "universal"] } }, defaults: { "propertyType": "ga4" } }),
          additionalFields: resolveSchema({ parameters, schema: z.object({ currencyCode: stringOrExpression.optional(), dimensionFiltersUI: z.unknown().optional(), metricAggregations: z.array(z.union([z.literal("MAXIMUM"), z.literal("MINIMUM"), z.literal("TOTAL")])).optional(), metricsFiltersUI: z.unknown().optional(), keepEmptyRows: booleanOrExpression.optional(), orderByUI: z.unknown().optional(), returnPropertyQuota: booleanOrExpression.optional(), dimensionFiltersUi: z.unknown().optional(), hideTotals: booleanOrExpression.optional(), hideValueRanges: booleanOrExpression.optional(), includeEmptyRows: booleanOrExpression.optional(), useResourceQuotas: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "propertyType": ["ga4", "universal"] } }, defaults: { "propertyType": "ga4" } }),
          viewId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "propertyType": ["universal"] } }, defaults: { "propertyType": "ga4" } }),
          metricsUA: resolveSchema({ parameters, schema: z.object({ metricValues: z.array(z.object({ listName: z.union([z.literal("ga:productCheckouts"), z.literal("ga:totalEvents"), z.literal("ga:pageviews"), z.literal("ga:sessionDuration"), z.literal("ga:sessions"), z.literal("ga:sessionsPerUser"), z.literal("ga:users"), z.literal("other"), z.literal("custom"), expressionSchema]).optional(), name: stringOrExpression.optional(), name: stringOrExpression.optional(), expression: stringOrExpression.optional(), formattingType: z.union([z.literal("CURRENCY"), z.literal("FLOAT"), z.literal("INTEGER"), z.literal("PERCENT"), z.literal("TIME"), expressionSchema]).optional() })).optional() }), required: false, displayOptions: { "show": { "propertyType": ["universal"] } }, defaults: { "propertyType": "ga4" } }),
          dimensionsUA: resolveSchema({ parameters, schema: z.object({ dimensionValues: z.array(z.object({ listName: z.union([z.literal("ga:browser"), z.literal("ga:campaign"), z.literal("ga:city"), z.literal("ga:country"), z.literal("ga:date"), z.literal("ga:deviceCategory"), z.literal("ga:productName"), z.literal("ga:language"), z.literal("ga:pagePath"), z.literal("ga:sourceMedium"), z.literal("other"), expressionSchema]).optional(), name: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "propertyType": ["universal"] } }, defaults: { "propertyType": "ga4" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleAnalytics/v2/resource_report/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleAnalytics/v2/resource_report/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return getGetSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleAnalytics/v2/resource_user_activity/operation_search.schema.js
var require_operation_search_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleAnalytics/v2/resource_user_activity/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("userActivity"),
          operation: z.literal("search"),
          viewId: stringOrExpression.optional(),
          userId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          additionalFields: z.object({ activityTypes: z.array(z.union([z.literal("ECOMMERCE"), z.literal("EVENT"), z.literal("GOAL"), z.literal("PAGEVIEW"), z.literal("SCREENVIEW")])).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleAnalytics/v2/resource_user_activity/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleAnalytics/v2/resource_user_activity/index.schema.js"(exports2, module2) {
    var getSearchSchema = require_operation_search_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "get" } : parameters;
      return getSearchSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleAnalytics/v2/index.schema.js
var getReportSchema = require_index_schema();
var getUserActivitySchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "report" } : parameters;
  return z.union([
    getReportSchema({ ...helpers, parameters: effectiveParams }),
    getUserActivitySchema({ ...helpers, parameters: effectiveParams })
  ]);
};
