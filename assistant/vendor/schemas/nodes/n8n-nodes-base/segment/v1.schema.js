var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_group/operation_add.schema.js
var require_operation_add_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_group/operation_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("group"),
          operation: z.literal("add").default("add"),
          userId: stringOrExpression.optional(),
          groupId: stringOrExpression.optional(),
          traits: z.object({ traitsUi: z.array(z.object({ key: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional(),
          context: z.object({ contextUi: z.object({ active: booleanOrExpression.optional(), ip: stringOrExpression.optional(), locate: stringOrExpression.optional(), page: stringOrExpression.optional(), timezone: stringOrExpression.optional(), app: z.unknown().optional(), campaign: z.unknown().optional(), device: z.unknown().optional() }).optional() }).optional(),
          integrations: z.object({ integrationsUi: z.object({ all: booleanOrExpression.optional(), salesforce: booleanOrExpression.optional() }).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_group/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_group/index.schema.js"(exports2, module2) {
    var getAddSchema = require_operation_add_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "add" } : parameters;
      return getAddSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_identify/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_identify/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("identify").default("identify"),
          operation: z.literal("create"),
          userId: stringOrExpression.optional(),
          traits: z.object({ traitsUi: z.array(z.object({ key: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional(),
          context: z.object({ contextUi: z.object({ active: booleanOrExpression.optional(), ip: stringOrExpression.optional(), locate: stringOrExpression.optional(), page: stringOrExpression.optional(), timezone: stringOrExpression.optional(), app: z.unknown().optional(), campaign: z.unknown().optional(), device: z.unknown().optional() }).optional() }).optional(),
          integrations: z.object({ integrationsUi: z.object({ all: booleanOrExpression.optional(), salesforce: booleanOrExpression.optional() }).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_identify/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_identify/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "add" } : parameters;
      return getCreateSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_track/operation_event.schema.js
var require_operation_event_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_track/operation_event.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("track"),
          operation: z.literal("event"),
          userId: stringOrExpression.optional(),
          event: stringOrExpression.optional(),
          context: z.object({ contextUi: z.object({ active: booleanOrExpression.optional(), ip: stringOrExpression.optional(), locate: stringOrExpression.optional(), page: stringOrExpression.optional(), timezone: stringOrExpression.optional(), app: z.unknown().optional(), campaign: z.unknown().optional(), device: z.unknown().optional() }).optional() }).optional(),
          integrations: z.object({ integrationsUi: z.object({ all: booleanOrExpression.optional(), salesforce: booleanOrExpression.optional() }).optional() }).optional(),
          properties: z.object({ propertiesUi: z.array(z.object({ key: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_track/operation_page.schema.js
var require_operation_page_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_track/operation_page.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("track"),
          operation: z.literal("page"),
          userId: stringOrExpression.optional(),
          name: stringOrExpression.optional(),
          context: z.object({ contextUi: z.object({ active: booleanOrExpression.optional(), ip: stringOrExpression.optional(), locate: stringOrExpression.optional(), page: stringOrExpression.optional(), timezone: stringOrExpression.optional(), app: z.unknown().optional(), campaign: z.unknown().optional(), device: z.unknown().optional() }).optional() }).optional(),
          integrations: z.object({ integrationsUi: z.object({ all: booleanOrExpression.optional(), salesforce: booleanOrExpression.optional() }).optional() }).optional(),
          properties: z.object({ propertiesUi: z.array(z.object({ key: stringOrExpression.optional(), value: stringOrExpression.optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_track/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/resource_track/index.schema.js"(exports2, module2) {
    var getEventSchema = require_operation_event_schema();
    var getPageSchema = require_operation_page_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "add" } : parameters;
      return z.union([
        getEventSchema({ ...helpers, parameters: effectiveParams }),
        getPageSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/segment/v1/index.schema.js
var getGroupSchema = require_index_schema();
var getIdentifySchema = require_index_schema2();
var getTrackSchema = require_index_schema3();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "identify" } : parameters;
  return z.union([
    getGroupSchema({ ...helpers, parameters: effectiveParams }),
    getIdentifySchema({ ...helpers, parameters: effectiveParams }),
    getTrackSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
