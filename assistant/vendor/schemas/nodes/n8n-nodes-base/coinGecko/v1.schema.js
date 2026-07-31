var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_candlestick.schema.js
var require_operation_candlestick_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_candlestick.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("coin").default("coin"),
          operation: z.literal("candlestick"),
          baseCurrency: stringOrExpression.optional(),
          quoteCurrency: stringOrExpression.optional(),
          days: z.union([z.literal("1"), z.literal("7"), z.literal("14"), z.literal("30"), z.literal("90"), z.literal("180"), z.literal("365"), z.literal("max"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("coin").default("coin"),
          operation: z.literal("get"),
          searchBy: z.union([z.literal("coinId"), z.literal("contractAddress"), expressionSchema]).optional(),
          coinId: stringOrExpression.optional(),
          platformId: resolveSchema({ parameters, schema: z.union([z.literal("ethereum"), expressionSchema]), required: false, displayOptions: { "show": { "searchBy": ["contractAddress"] } }, defaults: { "searchBy": "coinId" } }),
          contractAddress: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "searchBy": ["contractAddress"] } }, defaults: { "searchBy": "coinId" } }),
          options: z.object({ community_data: booleanOrExpression.optional(), developer_data: booleanOrExpression.optional(), localization: booleanOrExpression.optional(), market_data: booleanOrExpression.optional(), sparkline: booleanOrExpression.optional(), tickers: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("coin").default("coin"),
          operation: z.literal("getAll").default("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_history.schema.js
var require_operation_history_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_history.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("coin").default("coin"),
          operation: z.literal("history"),
          coinId: stringOrExpression.optional(),
          date: stringOrExpression.optional(),
          options: z.object({ localization: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_market.schema.js
var require_operation_market_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_market.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("coin").default("coin"),
          operation: z.literal("market"),
          baseCurrency: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ ids: stringOrExpression.optional(), category: z.union([z.literal("decentralized_finance_defi"), expressionSchema]).optional(), order: z.union([z.literal("gecko_asc"), z.literal("gecko_desc"), z.literal("id_asc"), z.literal("id_desc"), z.literal("market_cap_asc"), z.literal("market_cap_desc"), z.literal("volume_asc"), z.literal("volume_desc"), expressionSchema]).optional(), sparkline: booleanOrExpression.optional(), price_change_percentage: z.array(z.union([z.literal("1h"), z.literal("24h"), z.literal("7d"), z.literal("14d"), z.literal("30d"), z.literal("200d"), z.literal("1y")])).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_market_chart.schema.js
var require_operation_market_chart_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_market_chart.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("coin").default("coin"),
          operation: z.literal("marketChart"),
          searchBy: z.union([z.literal("coinId"), z.literal("contractAddress"), expressionSchema]).optional(),
          platformId: resolveSchema({ parameters, schema: z.union([z.literal("ethereum"), expressionSchema]), required: false, displayOptions: { "show": { "searchBy": ["contractAddress"] } }, defaults: { "searchBy": "coinId" } }),
          contractAddress: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "searchBy": ["contractAddress"] } }, defaults: { "searchBy": "coinId" } }),
          baseCurrency: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "searchBy": ["coinId"] }, "hide": { "searchBy": ["contractAddress"] } }, defaults: { "searchBy": "coinId" } }),
          quoteCurrency: stringOrExpression.optional(),
          days: z.union([z.literal("1"), z.literal("7"), z.literal("14"), z.literal("30"), z.literal("90"), z.literal("180"), z.literal("365"), z.literal("max"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_price.schema.js
var require_operation_price_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_price.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("coin").default("coin"),
          operation: z.literal("price"),
          searchBy: z.union([z.literal("coinId"), z.literal("contractAddress"), expressionSchema]).optional(),
          baseCurrencies: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "show": { "searchBy": ["coinId"] } }, defaults: { "searchBy": "coinId" } }),
          platformId: resolveSchema({ parameters, schema: z.union([z.literal("ethereum"), expressionSchema]), required: false, displayOptions: { "show": { "searchBy": ["contractAddress"] } }, defaults: { "searchBy": "coinId" } }),
          contractAddresses: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "searchBy": ["contractAddress"] } }, defaults: { "searchBy": "coinId" } }),
          quoteCurrencies: z.array(z.string()).optional(),
          options: z.object({ include_24hr_change: booleanOrExpression.optional(), include_24hr_vol: booleanOrExpression.optional(), include_last_updated_at: booleanOrExpression.optional(), include_market_cap: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_ticker.schema.js
var require_operation_ticker_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/operation_ticker.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("coin").default("coin"),
          operation: z.literal("ticker"),
          coinId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ exchange_ids: z.array(z.string()).optional(), include_exchange_logo: booleanOrExpression.optional(), order: z.union([z.literal("trust_score_desc"), z.literal("trust_score_asc"), z.literal("volume_desc"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_coin/index.schema.js"(exports2, module2) {
    var getCandlestickSchema = require_operation_candlestick_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getHistorySchema = require_operation_history_schema();
    var getMarketSchema = require_operation_market_schema();
    var getMarketChartSchema = require_operation_market_chart_schema();
    var getPriceSchema = require_operation_price_schema();
    var getTickerSchema = require_operation_ticker_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getAll" } : parameters;
      return z.union([
        getCandlestickSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getHistorySchema({ ...helpers, parameters: effectiveParams }),
        getMarketSchema({ ...helpers, parameters: effectiveParams }),
        getMarketChartSchema({ ...helpers, parameters: effectiveParams }),
        getPriceSchema({ ...helpers, parameters: effectiveParams }),
        getTickerSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_event/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_event/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("event"),
          operation: z.literal("getAll").default("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ country_code: stringOrExpression.optional(), from_date: stringOrExpression.optional(), to_date: stringOrExpression.optional(), type: stringOrExpression.optional(), upcoming_events_only: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_event/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/resource_event/index.schema.js"(exports2, module2) {
    var getGetAllSchema = require_operation_get_all_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getAll" } : parameters;
      return getGetAllSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/coinGecko/v1/index.schema.js
var getCoinSchema = require_index_schema();
var getEventSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "coin" } : parameters;
  return z.union([
    getCoinSchema({ ...helpers, parameters: effectiveParams }),
    getEventSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
