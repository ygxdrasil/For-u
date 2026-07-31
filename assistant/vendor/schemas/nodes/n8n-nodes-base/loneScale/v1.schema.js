var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/loneScale/v1/resource_list/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/loneScale/v1/resource_list/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("list").default("list"),
          operation: z.literal("create").default("create"),
          name: stringOrExpression.optional(),
          type: z.union([z.literal("COMPANY"), z.literal("PEOPLE")]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/loneScale/v1/resource_list/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/loneScale/v1/resource_list/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getCreateSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/loneScale/v1/resource_item/operation_add.schema.js
var require_operation_add_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/loneScale/v1/resource_item/operation_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("item"),
          operation: z.literal("add"),
          type: z.union([z.literal("COMPANY"), z.literal("PEOPLE")]).optional(),
          list: stringOrExpression.optional(),
          first_name: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "type": ["PEOPLE"] } }, defaults: { "type": "PEOPLE" } }),
          last_name: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "type": ["PEOPLE"] } }, defaults: { "type": "PEOPLE" } }),
          company_name: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "type": ["COMPANY"] } }, defaults: { "type": "PEOPLE" } }),
          peopleAdditionalFields: resolveSchema({ parameters, schema: z.object({ full_name: stringOrExpression.optional(), email: stringOrExpression.optional(), company_name: stringOrExpression.optional(), current_position: stringOrExpression.optional(), domain: stringOrExpression.optional(), linkedin_url: stringOrExpression.optional(), location: stringOrExpression.optional(), contact_id: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "type": ["PEOPLE"] } }, defaults: { "type": "PEOPLE" } }),
          companyAdditionalFields: resolveSchema({ parameters, schema: z.object({ linkedin_url: stringOrExpression.optional(), domain: stringOrExpression.optional(), location: stringOrExpression.optional(), contact_id: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "type": ["COMPANY"] } }, defaults: { "type": "PEOPLE" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/loneScale/v1/resource_item/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/loneScale/v1/resource_item/index.schema.js"(exports2, module2) {
    var getAddSchema = require_operation_add_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getAddSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/loneScale/v1/index.schema.js
var getListSchema = require_index_schema();
var getItemSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "list" } : parameters;
  return z.union([
    getListSchema({ ...helpers, parameters: effectiveParams }),
    getItemSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
