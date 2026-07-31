var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customer"),
          operation: z.literal("create").default("create"),
          email: stringOrExpression.optional(),
          additionalFields: z.object({ billing: z.unknown().optional(), first_name: stringOrExpression.optional(), last_name: stringOrExpression.optional(), meta_data: z.unknown().optional(), password: stringOrExpression.optional(), shipping: z.unknown().optional(), username: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customer"),
          operation: z.literal("delete"),
          customerId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customer"),
          operation: z.literal("get"),
          customerId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customer"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ email: stringOrExpression.optional(), order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), orderby: z.union([z.literal("id"), z.literal("include"), z.literal("name"), z.literal("registered_date"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("customer"),
          operation: z.literal("update"),
          customerId: stringOrExpression.optional(),
          updateFields: z.object({ billing: z.unknown().optional(), first_name: stringOrExpression.optional(), last_name: stringOrExpression.optional(), meta_data: z.unknown().optional(), password: stringOrExpression.optional(), shipping: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_customer/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("order"),
          operation: z.literal("create").default("create"),
          additionalFields: z.object({ currency: stringOrExpression.optional(), customerId: stringOrExpression.optional(), customerNote: stringOrExpression.optional(), parentId: stringOrExpression.optional(), paymentMethodId: stringOrExpression.optional(), paymentMethodTitle: stringOrExpression.optional(), setPaid: booleanOrExpression.optional(), status: z.union([z.literal("cancelled"), z.literal("completed"), z.literal("failed"), z.literal("on-hold"), z.literal("pending"), z.literal("processing"), z.literal("refunded"), z.literal("trash"), expressionSchema]).optional(), transactionID: stringOrExpression.optional() }).optional(),
          billingUi: z.object({ billingValues: z.object({ firstName: stringOrExpression.optional(), lastName: stringOrExpression.optional(), company: stringOrExpression.optional(), address_1: stringOrExpression.optional(), address_2: stringOrExpression.optional(), city: stringOrExpression.optional(), postcode: stringOrExpression.optional(), country: stringOrExpression.optional(), email: stringOrExpression.optional(), phone: stringOrExpression.optional() }).optional() }).optional(),
          couponLinesUi: z.object({ couponLinesValues: z.array(z.object({ code: stringOrExpression.optional(), metadataUi: z.unknown().optional() })).optional() }).optional(),
          feeLinesUi: z.object({ feeLinesValues: z.array(z.object({ name: stringOrExpression.optional(), taxClass: stringOrExpression.optional(), taxStatus: z.union([z.literal("taxable"), z.literal("none"), expressionSchema]).optional(), total: stringOrExpression.optional(), metadataUi: z.unknown().optional() })).optional() }).optional(),
          lineItemsUi: z.object({ lineItemsValues: z.array(z.object({ name: stringOrExpression.optional(), productId: numberOrExpression.optional(), variationId: numberOrExpression.optional(), quantity: numberOrExpression.optional(), taxClass: stringOrExpression.optional(), subtotal: stringOrExpression.optional(), total: stringOrExpression.optional(), metadataUi: z.unknown().optional() })).optional() }).optional(),
          metadataUi: z.object({ metadataValues: z.array(z.object({ key: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional(),
          shippingUi: z.object({ shippingValues: z.object({ firstName: stringOrExpression.optional(), lastName: stringOrExpression.optional(), company: stringOrExpression.optional(), address_1: stringOrExpression.optional(), address_2: stringOrExpression.optional(), city: stringOrExpression.optional(), postcode: stringOrExpression.optional(), country: stringOrExpression.optional() }).optional() }).optional(),
          shippingLinesUi: z.object({ shippingLinesValues: z.array(z.object({ methodTitle: stringOrExpression.optional(), "method ID": stringOrExpression.optional(), total: stringOrExpression.optional(), metadataUi: z.unknown().optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("order"),
          operation: z.literal("delete"),
          orderId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("order"),
          operation: z.literal("get"),
          orderId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("order"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ after: stringOrExpression.optional(), before: stringOrExpression.optional(), customer: stringOrExpression.optional(), decimalPoints: numberOrExpression.optional(), order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), product: stringOrExpression.optional(), orderBy: z.union([z.literal("date"), z.literal("id"), z.literal("include"), z.literal("slug"), z.literal("title"), expressionSchema]).optional(), search: stringOrExpression.optional(), status: z.union([z.literal("any"), z.literal("cancelled"), z.literal("completed"), z.literal("failed"), z.literal("on-hold"), z.literal("pending"), z.literal("processing"), z.literal("refunded"), z.literal("trash"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("order"),
          operation: z.literal("update"),
          orderId: stringOrExpression.optional(),
          updateFields: z.object({ currency: stringOrExpression.optional(), customerId: stringOrExpression.optional(), customerNote: stringOrExpression.optional(), parentId: stringOrExpression.optional(), paymentMethodId: stringOrExpression.optional(), paymentMethodTitle: stringOrExpression.optional(), status: z.union([z.literal("cancelled"), z.literal("completed"), z.literal("failed"), z.literal("on-hold"), z.literal("pending"), z.literal("processing"), z.literal("refunded"), z.literal("trash"), expressionSchema]).optional(), transactionID: stringOrExpression.optional() }).optional(),
          billingUi: z.object({ billingValues: z.object({ firstName: stringOrExpression.optional(), lastName: stringOrExpression.optional(), company: stringOrExpression.optional(), address_1: stringOrExpression.optional(), address_2: stringOrExpression.optional(), city: stringOrExpression.optional(), postalCode: stringOrExpression.optional(), country: stringOrExpression.optional(), email: stringOrExpression.optional(), phone: stringOrExpression.optional() }).optional() }).optional(),
          couponLinesUi: z.object({ couponLinesValues: z.array(z.object({ code: stringOrExpression.optional(), metadataUi: z.unknown().optional() })).optional() }).optional(),
          feeLinesUi: z.object({ feeLinesValues: z.array(z.object({ name: stringOrExpression.optional(), taxClass: stringOrExpression.optional(), taxStatus: z.union([z.literal("taxable"), z.literal("none"), expressionSchema]).optional(), total: stringOrExpression.optional(), metadataUi: z.unknown().optional() })).optional() }).optional(),
          lineItemsUi: z.object({ lineItemsValues: z.array(z.object({ name: stringOrExpression.optional(), productId: numberOrExpression.optional(), variationId: numberOrExpression.optional(), quantity: numberOrExpression.optional(), taxClass: stringOrExpression.optional(), subtotal: stringOrExpression.optional(), total: stringOrExpression.optional(), metadataUi: z.unknown().optional() })).optional() }).optional(),
          metadataUi: z.object({ metadataValues: z.array(z.object({ key: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional(),
          shippingUi: z.object({ shippingValues: z.object({ firstName: stringOrExpression.optional(), lastName: stringOrExpression.optional(), company: stringOrExpression.optional(), address_1: stringOrExpression.optional(), address_2: stringOrExpression.optional(), city: stringOrExpression.optional(), postalCode: stringOrExpression.optional(), country: stringOrExpression.optional() }).optional() }).optional(),
          shippingLinesUi: z.object({ shippingLinesValues: z.array(z.object({ methodTitle: stringOrExpression.optional(), "method ID": stringOrExpression.optional(), total: stringOrExpression.optional(), metadataUi: z.unknown().optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_order/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/operation_create.schema.js
var require_operation_create_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product").default("product"),
          operation: z.literal("create").default("create"),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ backorders: z.union([z.literal("no"), z.literal("notify"), z.literal("yes"), expressionSchema]).optional(), buttonText: stringOrExpression.optional(), catalogVisibility: z.union([z.literal("catalog"), z.literal("hidden"), z.literal("search"), z.literal("visible"), expressionSchema]).optional(), categories: z.array(z.string()).optional(), crossSellIds: stringOrExpression.optional(), dateOnSaleFrom: stringOrExpression.optional(), dateOnSaleTo: stringOrExpression.optional(), description: stringOrExpression.optional(), downloadable: booleanOrExpression.optional(), externalUrl: stringOrExpression.optional(), featured: booleanOrExpression.optional(), manageStock: booleanOrExpression.optional(), menuOrder: numberOrExpression.optional(), parentId: stringOrExpression.optional(), purchaseNote: stringOrExpression.optional(), regularPrice: stringOrExpression.optional(), reviewsAllowed: booleanOrExpression.optional(), salePrice: stringOrExpression.optional(), shippingClass: stringOrExpression.optional(), shortDescription: stringOrExpression.optional(), sku: stringOrExpression.optional(), slug: stringOrExpression.optional(), soldIndividually: booleanOrExpression.optional(), status: z.union([z.literal("draft"), z.literal("pending"), z.literal("private"), z.literal("publish"), expressionSchema]).optional(), stockQuantity: numberOrExpression.optional(), stockStatus: z.union([z.literal("instock"), z.literal("outofstock"), z.literal("onbackorder"), expressionSchema]).optional(), tags: z.array(z.string()).optional(), taxClass: stringOrExpression.optional(), taxStatus: z.union([z.literal("taxable"), z.literal("shipping"), z.literal("none"), expressionSchema]).optional(), type: z.union([z.literal("simple"), z.literal("grouped"), z.literal("external"), z.literal("variable"), expressionSchema]).optional(), upsellIds: stringOrExpression.optional(), virtual: booleanOrExpression.optional(), weight: stringOrExpression.optional() }).optional(),
          dimensionsUi: z.object({ dimensionsValues: z.object({ height: stringOrExpression.optional(), length: stringOrExpression.optional(), width: stringOrExpression.optional() }).optional() }).optional(),
          imagesUi: z.object({ imagesValues: z.array(z.object({ alt: stringOrExpression.optional(), src: stringOrExpression.optional(), name: stringOrExpression.optional() })).optional() }).optional(),
          metadataUi: z.object({ metadataValues: z.array(z.object({ key: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/operation_delete.schema.js
var require_operation_delete_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product").default("product"),
          operation: z.literal("delete"),
          productId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product").default("product"),
          operation: z.literal("get"),
          productId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product").default("product"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ after: stringOrExpression.optional(), before: stringOrExpression.optional(), category: stringOrExpression.optional(), context: z.union([z.literal("view"), z.literal("embed"), z.literal("edit"), expressionSchema]).optional(), featured: booleanOrExpression.optional(), maxPrice: stringOrExpression.optional(), minPrice: stringOrExpression.optional(), order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), orderBy: z.union([z.literal("date"), z.literal("id"), z.literal("include"), z.literal("slug"), z.literal("title"), expressionSchema]).optional(), search: stringOrExpression.optional(), sku: stringOrExpression.optional(), slug: stringOrExpression.optional(), status: z.union([z.literal("any"), z.literal("draft"), z.literal("pending"), z.literal("private"), z.literal("publish"), expressionSchema]).optional(), stockStatus: z.union([z.literal("instock"), z.literal("outofstock"), z.literal("onbackorder"), expressionSchema]).optional(), tag: stringOrExpression.optional(), taxClass: z.union([z.literal("standard"), z.literal("reduced-rate"), z.literal("zero-rate."), expressionSchema]).optional(), type: z.union([z.literal("simple"), z.literal("grouped"), z.literal("external"), z.literal("variable"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/operation_update.schema.js
var require_operation_update_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("product").default("product"),
          operation: z.literal("update"),
          productId: stringOrExpression.optional(),
          updateFields: z.object({ backorders: z.union([z.literal("no"), z.literal("notify"), z.literal("yes"), expressionSchema]).optional(), buttonText: stringOrExpression.optional(), catalogVisibility: z.union([z.literal("visible"), z.literal("catalog"), z.literal("search"), z.literal("hidden"), expressionSchema]).optional(), categories: z.array(z.string()).optional(), crossSellIds: stringOrExpression.optional(), dateOnSaleFrom: stringOrExpression.optional(), dateOnSaleTo: stringOrExpression.optional(), description: stringOrExpression.optional(), downloadable: booleanOrExpression.optional(), externalUrl: stringOrExpression.optional(), featured: booleanOrExpression.optional(), manageStock: booleanOrExpression.optional(), menuOrder: numberOrExpression.optional(), name: stringOrExpression.optional(), parentId: stringOrExpression.optional(), purchaseNote: stringOrExpression.optional(), regularPrice: stringOrExpression.optional(), reviewsAllowed: booleanOrExpression.optional(), salePrice: stringOrExpression.optional(), shippingClass: stringOrExpression.optional(), shortDescription: stringOrExpression.optional(), sku: stringOrExpression.optional(), slug: stringOrExpression.optional(), soldIndividually: booleanOrExpression.optional(), status: z.union([z.literal("draft"), z.literal("pending"), z.literal("private"), z.literal("publish"), expressionSchema]).optional(), stockQuantity: numberOrExpression.optional(), stockStatus: z.union([z.literal("instock"), z.literal("outofstock"), z.literal("onbackorder"), expressionSchema]).optional(), tags: z.array(z.string()).optional(), taxClass: stringOrExpression.optional(), taxStatus: z.union([z.literal("taxable"), z.literal("shipping"), z.literal("none"), expressionSchema]).optional(), type: z.union([z.literal("simple"), z.literal("grouped"), z.literal("external"), z.literal("variable"), expressionSchema]).optional(), upsellIds: stringOrExpression.optional(), virtual: booleanOrExpression.optional(), weight: stringOrExpression.optional() }).optional(),
          dimensionsUi: z.object({ dimensionsValues: z.object({ height: stringOrExpression.optional(), length: stringOrExpression.optional(), width: stringOrExpression.optional() }).optional() }).optional(),
          imagesUi: z.object({ imagesValues: z.array(z.object({ alt: stringOrExpression.optional(), src: stringOrExpression.optional(), name: stringOrExpression.optional() })).optional() }).optional(),
          metadataUi: z.object({ metadataValues: z.array(z.object({ key: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/resource_product/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema3();
    var getDeleteSchema = require_operation_delete_schema3();
    var getGetSchema = require_operation_get_schema3();
    var getGetAllSchema = require_operation_get_all_schema3();
    var getUpdateSchema = require_operation_update_schema3();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wooCommerce/v1/index.schema.js
var getCustomerSchema = require_index_schema();
var getOrderSchema = require_index_schema2();
var getProductSchema = require_index_schema3();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "product" } : parameters;
  return z.union([
    getCustomerSchema({ ...helpers, parameters: effectiveParams }),
    getOrderSchema({ ...helpers, parameters: effectiveParams }),
    getProductSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
