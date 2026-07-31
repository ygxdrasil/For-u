var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/profitWell/v1/resource_company/operation_get_setting.schema.js
var require_operation_get_setting_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/profitWell/v1/resource_company/operation_get_setting.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("getSetting").default("getSetting")
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/profitWell/v1/resource_company/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/profitWell/v1/resource_company/index.schema.js"(exports2, module2) {
    var getGetSettingSchema = require_operation_get_setting_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getSetting" } : parameters;
      return getGetSettingSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/profitWell/v1/resource_metric/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/profitWell/v1/resource_metric/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("metric").default("metric"),
          operation: z.literal("get"),
          type: z.union([z.literal("daily"), z.literal("monthly"), expressionSchema]).optional(),
          month: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "type": ["daily"] } }, defaults: { "type": "" } }),
          simple: booleanOrExpression.optional(),
          options: z.object({ plan_id: stringOrExpression.optional(), dailyMetrics: z.array(z.union([z.literal("active_customers"), z.literal("churned_customers"), z.literal("churned_recurring_revenue"), z.literal("cumulative_net_new_mrr"), z.literal("cumulative_new_trialing_customers"), z.literal("downgraded_customers"), z.literal("downgraded_recurring_revenue"), z.literal("future_churn_mrr"), z.literal("new_customers"), z.literal("new_recurring_revenue"), z.literal("reactivated_customers"), z.literal("reactivated_recurring_revenue"), z.literal("recurring_revenue"), z.literal("upgraded_customers"), z.literal("upgraded_recurring_revenue")])).optional(), monthlyMetrics: z.array(z.union([z.literal("active_customers"), z.literal("active_trialing_customers"), z.literal("average_revenue_per_user"), z.literal("churned_customers"), z.literal("churned_customers_cancellations"), z.literal("churned_customers_delinquent"), z.literal("churned_recurring_revenue"), z.literal("churned_recurring_revenue_cancellations"), z.literal("churned_recurring_revenue_delinquent"), z.literal("churned_trialing_customers"), z.literal("converted_customers"), z.literal("converted_recurring_revenue"), z.literal("customers_churn_cancellations_rate"), z.literal("customers_churn_delinquent_rate"), z.literal("customers_churn_rate"), z.literal("customer_conversion_rate"), z.literal("customers_retention_rate"), z.literal("downgraded_customers"), z.literal("downgrade_rate"), z.literal("downgraded_recurring_revenue"), z.literal("existing_customers"), z.literal("existing_recurring_revenue"), z.literal("existing_trialing_customers"), z.literal("growth_rate"), z.literal("lifetime_value"), z.literal("new_customers"), z.literal("new_recurring_revenue"), z.literal("new_trialing_customers"), z.literal("plan_change_rate"), z.literal("plan_changed_recurring_revenue"), z.literal("reactivated_customers"), z.literal("reactivated_recurring_revenue"), z.literal("recurring_revenue"), z.literal("revenue_churn_cancellations_rate"), z.literal("revenue_churn_delinquent_rate"), z.literal("revenue_churn_rate"), z.literal("revenue_retention_rate"), z.literal("upgrade_rate"), z.literal("upgraded_customers"), z.literal("upgraded_recurring_revenue")])).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/profitWell/v1/resource_metric/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/profitWell/v1/resource_metric/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getSetting" } : parameters;
      return getGetSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/profitWell/v1/index.schema.js
var getCompanySchema = require_index_schema();
var getMetricSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "metric" } : parameters;
  return z.union([
    getCompanySchema({ ...helpers, parameters: effectiveParams }),
    getMetricSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
