var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("order").default("order"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), z.literal("apiKey"), expressionSchema]).optional(),
          additionalFields: z.object({ billingAddressUi: z.unknown().optional(), discountCodesUi: z.unknown().optional(), email: stringOrExpression.optional(), fulfillmentStatus: z.union([z.literal("fulfilled"), z.literal("null"), z.literal("partial"), z.literal("restocked"), expressionSchema]).optional(), inventoryBehaviour: z.union([z.literal("bypass"), z.literal("decrementIgnoringPolicy"), z.literal("decrementObeyingPolicy"), expressionSchema]).optional(), locationId: stringOrExpression.optional(), note: stringOrExpression.optional(), sendFulfillmentReceipt: booleanOrExpression.optional(), sendReceipt: booleanOrExpression.optional(), shippingAddressUi: z.unknown().optional(), sourceName: stringOrExpression.optional(), tags: stringOrExpression.optional(), test: booleanOrExpression.optional() }).optional(),
          limeItemsUi: z.object({ lineItemValues: z.array(z.object({ productId: stringOrExpression.optional(), variantId: stringOrExpression.optional(), title: stringOrExpression.optional(), grams: stringOrExpression.optional(), quantity: numberOrExpression.optional(), price: stringOrExpression.optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("order").default("order"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), z.literal("apiKey"), expressionSchema]).optional(),
          orderId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("order").default("order"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), z.literal("apiKey"), expressionSchema]).optional(),
          orderId: stringOrExpression.optional(),
          options: z.object({ fields: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("order").default("order"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), z.literal("apiKey"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ attributionAppId: stringOrExpression.optional(), createdAtMin: stringOrExpression.optional(), createdAtMax: stringOrExpression.optional(), financialStatus: z.union([z.literal("any"), z.literal("authorized"), z.literal("paid"), z.literal("partiallyPaid"), z.literal("partiallyRefunded"), z.literal("pending"), z.literal("refunded"), z.literal("unpaid"), z.literal("voided"), expressionSchema]).optional(), fulfillmentStatus: z.union([z.literal("any"), z.literal("partial"), z.literal("shipped"), z.literal("unfulfilled"), z.literal("unshipped"), expressionSchema]).optional(), fields: stringOrExpression.optional(), ids: stringOrExpression.optional(), processedAtMax: stringOrExpression.optional(), processedAtMin: stringOrExpression.optional(), status: z.union([z.literal("any"), z.literal("Cancelled"), z.literal("closed"), z.literal("open"), expressionSchema]).optional(), sinceId: stringOrExpression.optional(), updatedAtMax: stringOrExpression.optional(), updatedAtMin: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("order").default("order"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), z.literal("apiKey"), expressionSchema]).optional(),
          orderId: stringOrExpression.optional(),
          updateFields: z.object({ email: stringOrExpression.optional(), locationId: stringOrExpression.optional(), note: stringOrExpression.optional(), shippingAddressUi: z.unknown().optional(), sourceName: stringOrExpression.optional(), tags: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_order/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), z.literal("apiKey"), expressionSchema]).optional(),
          title: stringOrExpression.optional(),
          additionalFields: z.object({ body_html: stringOrExpression.optional(), handle: stringOrExpression.optional(), images: z.unknown().optional(), productOptions: z.unknown().optional(), product_type: stringOrExpression.optional(), published_at: stringOrExpression.optional(), published_scope: z.union([z.literal("global"), z.literal("web"), expressionSchema]).optional(), tags: stringOrExpression.optional(), template_suffix: stringOrExpression.optional(), vendor: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), z.literal("apiKey"), expressionSchema]).optional(),
          productId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), z.literal("apiKey"), expressionSchema]).optional(),
          productId: stringOrExpression.optional(),
          additionalFields: z.object({ fields: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), z.literal("apiKey"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          additionalFields: z.object({ collection_id: stringOrExpression.optional(), created_at_max: stringOrExpression.optional(), created_at_min: stringOrExpression.optional(), fields: stringOrExpression.optional(), handle: stringOrExpression.optional(), ids: stringOrExpression.optional(), presentment_currencies: stringOrExpression.optional(), product_type: stringOrExpression.optional(), published_at_max: stringOrExpression.optional(), published_at_min: stringOrExpression.optional(), published_status: z.union([z.literal("any"), z.literal("published"), z.literal("unpublished"), expressionSchema]).optional(), title: stringOrExpression.optional(), updated_at_max: stringOrExpression.optional(), updated_at_min: stringOrExpression.optional(), vendor: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), z.literal("apiKey"), expressionSchema]).optional(),
          productId: stringOrExpression.optional(),
          updateFields: z.object({ body_html: stringOrExpression.optional(), handle: stringOrExpression.optional(), images: z.unknown().optional(), productOptions: z.unknown().optional(), product_type: stringOrExpression.optional(), published_at: stringOrExpression.optional(), published_scope: z.union([z.literal("global"), z.literal("web"), expressionSchema]).optional(), tags: stringOrExpression.optional(), template_suffix: stringOrExpression.optional(), title: stringOrExpression.optional(), vendor: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/resource_product/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/shopify/v1/index.schema.js
var getOrderSchema = require_index_schema();
var getProductSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "order" } : parameters;
  return z.union([
    getOrderSchema({ ...helpers, parameters: effectiveParams }),
    getProductSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
