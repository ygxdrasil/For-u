var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_analyzer/operation_execute.schema.js
var require_operation_execute_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_analyzer/operation_execute.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("analyzer").default("analyzer"),
          operation: z.literal("execute").default("execute"),
          analyzer: stringOrExpression.optional(),
          observableType: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "analyzer": [""] } }, defaults: { "analyzer": "" } }),
          observableValue: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "observableType": ["file"], "analyzer": [""] } }, defaults: { "observableType": "", "analyzer": "" } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "observableType": ["file"] } }, defaults: { "observableType": "" } }),
          tlp: resolveSchema({ parameters, schema: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), expressionSchema]), required: false, displayOptions: { "hide": { "observableType": [""], "analyzer": [""] } }, defaults: { "observableType": "", "analyzer": "" } }),
          additionalFields: z.object({ force: booleanOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_analyzer/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_analyzer/index.schema.js"(exports2, module2) {
    var getExecuteSchema = require_operation_execute_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "execute" } : parameters;
      return getExecuteSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_job/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_job/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("job"),
          operation: z.literal("get"),
          jobId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_job/operation_report.schema.js
var require_operation_report_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_job/operation_report.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("job"),
          operation: z.literal("report"),
          jobId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_job/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_job/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema();
    var getReportSchema = require_operation_report_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "execute" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getReportSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_responder/operation_execute.schema.js
var require_operation_execute_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_responder/operation_execute.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("responder"),
          operation: z.literal("execute").default("execute"),
          responder: stringOrExpression.optional(),
          entityType: stringOrExpression.optional(),
          jsonObject: booleanOrExpression.optional(),
          objectData: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "jsonObject": [true] } }, defaults: { "jsonObject": false } }),
          parameters: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "jsonObject": [false], "entityType": ["case", "alert", "case_artifact", "case_task", "case_task_log"] }, "hide": { "entityType": ["", "alert", "case_artifact", "case_task", "case_task_log", "case"], "responder": [""] } }, defaults: { "jsonObject": false, "entityType": "", "responder": "" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_responder/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/resource_responder/index.schema.js"(exports2, module2) {
    var getExecuteSchema = require_operation_execute_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "execute" } : parameters;
      return getExecuteSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/cortex/v1/index.schema.js
var getAnalyzerSchema = require_index_schema();
var getJobSchema = require_index_schema2();
var getResponderSchema = require_index_schema3();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "analyzer" } : parameters;
  return z.union([
    getAnalyzerSchema({ ...helpers, parameters: effectiveParams }),
    getJobSchema({ ...helpers, parameters: effectiveParams }),
    getResponderSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
