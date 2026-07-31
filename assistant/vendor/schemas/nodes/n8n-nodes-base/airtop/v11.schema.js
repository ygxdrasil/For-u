var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_agent/operation_run.schema.js
var require_operation_run_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_agent/operation_run.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("agent"),
          operation: z.literal("run").default("run"),
          agentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          agentParameters: resolveSchema({ parameters, schema: resourceMapperValueSchema, required: false, displayOptions: { "hide": { "agentId": [""] } }, defaults: { "agentId": { "mode": "list", "value": "" } } }),
          awaitExecution: booleanOrExpression.optional(),
          timeout: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "awaitExecution": [true] } }, defaults: { "awaitExecution": true } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_agent/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_agent/index.schema.js"(exports2, module2) {
    var getRunSchema = require_operation_run_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "run" } : parameters;
      return getRunSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_extraction/operation_get_paginated.schema.js
var require_operation_get_paginated_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_extraction/operation_get_paginated.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("extraction"),
          operation: z.literal("getPaginated"),
          sessionMode: z.union([z.literal("new"), z.literal("existing"), expressionSchema]).optional(),
          sessionId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["existing"] } }, defaults: { "sessionMode": "existing" } }),
          windowId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["existing"] } }, defaults: { "sessionMode": "existing" } }),
          url: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["new"] } }, defaults: { "sessionMode": "existing" } }),
          profileName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["new"] } }, defaults: { "sessionMode": "existing" } }),
          autoTerminateSession: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["new"] } }, defaults: { "sessionMode": "existing" } }),
          prompt: stringOrExpression.optional(),
          additionalFields: z.object({ outputSchema: z.union([iDataObjectSchema, z.string()]).optional(), parseJsonOutput: booleanOrExpression.optional(), interactionMode: z.union([z.literal("auto"), z.literal("accurate"), z.literal("cost-efficient"), expressionSchema]).optional(), paginationMode: z.union([z.literal("auto"), z.literal("paginated"), z.literal("infinite-scroll"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_extraction/operation_query.schema.js
var require_operation_query_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_extraction/operation_query.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("extraction"),
          operation: z.literal("query"),
          sessionMode: z.union([z.literal("new"), z.literal("existing"), expressionSchema]).optional(),
          sessionId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["existing"] } }, defaults: { "sessionMode": "existing" } }),
          windowId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["existing"] } }, defaults: { "sessionMode": "existing" } }),
          url: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["new"] } }, defaults: { "sessionMode": "existing" } }),
          profileName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["new"] } }, defaults: { "sessionMode": "existing" } }),
          autoTerminateSession: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["new"] } }, defaults: { "sessionMode": "existing" } }),
          prompt: stringOrExpression.optional(),
          additionalFields: z.object({ outputSchema: z.union([iDataObjectSchema, z.string()]).optional(), parseJsonOutput: booleanOrExpression.optional(), includeVisualAnalysis: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_extraction/operation_scrape.schema.js
var require_operation_scrape_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_extraction/operation_scrape.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("extraction"),
          operation: z.literal("scrape"),
          sessionMode: z.union([z.literal("new"), z.literal("existing"), expressionSchema]).optional(),
          sessionId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["existing"] } }, defaults: { "sessionMode": "existing" } }),
          windowId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["existing"] } }, defaults: { "sessionMode": "existing" } }),
          url: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["new"] } }, defaults: { "sessionMode": "existing" } }),
          profileName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["new"] } }, defaults: { "sessionMode": "existing" } }),
          autoTerminateSession: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "sessionMode": ["new"] } }, defaults: { "sessionMode": "existing" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_extraction/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_extraction/index.schema.js"(exports2, module2) {
    var getGetPaginatedSchema = require_operation_get_paginated_schema();
    var getQuerySchema = require_operation_query_schema();
    var getScrapeSchema = require_operation_scrape_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "run" } : parameters;
      return z.union([
        getGetPaginatedSchema({ ...helpers, parameters: effectiveParams }),
        getQuerySchema({ ...helpers, parameters: effectiveParams }),
        getScrapeSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/operation_delete_file.schema.js
var require_operation_delete_file_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/operation_delete_file.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("deleteFile"),
          fileId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("get"),
          fileId: stringOrExpression.optional(),
          outputBinaryFile: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/operation_get_many.schema.js
var require_operation_get_many_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/operation_get_many.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("getMany"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          sessionIds: stringOrExpression.optional(),
          outputSingleItem: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/operation_load.schema.js
var require_operation_load_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/operation_load.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("load"),
          sessionId: stringOrExpression.optional(),
          windowId: stringOrExpression.optional(),
          fileId: stringOrExpression.optional(),
          elementDescription: stringOrExpression.optional(),
          includeHiddenElements: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/operation_upload.schema.js
var require_operation_upload_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/operation_upload.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("upload"),
          sessionId: stringOrExpression.optional(),
          windowId: stringOrExpression.optional(),
          fileName: stringOrExpression.optional(),
          fileType: z.union([z.literal("browser_download"), z.literal("screenshot"), z.literal("video"), z.literal("customer_upload"), expressionSchema]).optional(),
          source: z.union([z.literal("url"), z.literal("binary"), expressionSchema]).optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["binary"] } }, defaults: { "source": "url" } }),
          url: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "source": ["url"] } }, defaults: { "source": "url" } }),
          triggerFileInputParameter: booleanOrExpression.optional(),
          elementDescription: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "triggerFileInputParameter": [true] } }, defaults: { "triggerFileInputParameter": true } }),
          includeHiddenElements: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "triggerFileInputParameter": [true] } }, defaults: { "triggerFileInputParameter": true } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_file/index.schema.js"(exports2, module2) {
    var getDeleteFileSchema = require_operation_delete_file_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetManySchema = require_operation_get_many_schema();
    var getLoadSchema = require_operation_load_schema();
    var getUploadSchema = require_operation_upload_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "run" } : parameters;
      return z.union([
        getDeleteFileSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetManySchema({ ...helpers, parameters: effectiveParams }),
        getLoadSchema({ ...helpers, parameters: effectiveParams }),
        getUploadSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/operation_click.schema.js
var require_operation_click_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/operation_click.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("interaction"),
          operation: z.literal("click"),
          sessionId: stringOrExpression.optional(),
          windowId: stringOrExpression.optional(),
          elementDescription: stringOrExpression.optional(),
          clickType: z.union([z.literal("click"), z.literal("doubleClick"), z.literal("rightClick"), expressionSchema]).optional(),
          additionalFields: z.object({ visualScope: z.union([z.literal("auto"), z.literal("viewport"), z.literal("page"), z.literal("scan"), expressionSchema]).optional(), waitForNavigation: z.union([z.literal("load"), z.literal("domcontentloaded"), z.literal("networkidle0"), z.literal("networkidle2"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/operation_fill.schema.js
var require_operation_fill_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/operation_fill.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("interaction"),
          operation: z.literal("fill"),
          sessionId: stringOrExpression.optional(),
          windowId: stringOrExpression.optional(),
          formData: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/operation_hover.schema.js
var require_operation_hover_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/operation_hover.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("interaction"),
          operation: z.literal("hover"),
          sessionId: stringOrExpression.optional(),
          windowId: stringOrExpression.optional(),
          elementDescription: stringOrExpression.optional(),
          additionalFields: z.object({ visualScope: z.union([z.literal("auto"), z.literal("viewport"), z.literal("page"), z.literal("scan"), expressionSchema]).optional(), waitForNavigation: z.union([z.literal("load"), z.literal("domcontentloaded"), z.literal("networkidle0"), z.literal("networkidle2"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/operation_scroll.schema.js
var require_operation_scroll_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/operation_scroll.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("interaction"),
          operation: z.literal("scroll"),
          sessionId: stringOrExpression.optional(),
          windowId: stringOrExpression.optional(),
          scrollingMode: z.union([z.literal("automatic"), z.literal("manual"), expressionSchema]).optional(),
          scrollToElement: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "scrollingMode": ["automatic"] } }, defaults: { "scrollingMode": "automatic" } }),
          scrollToEdge: resolveSchema({ parameters, schema: z.object({ edgeValues: z.object({ yAxis: z.union([z.literal(""), z.literal("top"), z.literal("bottom"), expressionSchema]).optional(), xAxis: z.union([z.literal(""), z.literal("left"), z.literal("right"), expressionSchema]).optional() }).optional() }), required: false, displayOptions: { "show": { "scrollingMode": ["manual"] } }, defaults: { "scrollingMode": "automatic" } }),
          scrollBy: resolveSchema({ parameters, schema: z.object({ scrollValues: z.object({ yAxis: stringOrExpression.optional(), xAxis: stringOrExpression.optional() }).optional() }), required: false, displayOptions: { "show": { "scrollingMode": ["manual"] } }, defaults: { "scrollingMode": "automatic" } }),
          scrollWithin: stringOrExpression.optional(),
          additionalFields: z.object({ visualScope: z.union([z.literal("auto"), z.literal("viewport"), z.literal("page"), z.literal("scan"), expressionSchema]).optional(), waitForNavigation: z.union([z.literal("load"), z.literal("domcontentloaded"), z.literal("networkidle0"), z.literal("networkidle2"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/operation_type.schema.js
var require_operation_type_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/operation_type.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("interaction"),
          operation: z.literal("type"),
          sessionId: stringOrExpression.optional(),
          windowId: stringOrExpression.optional(),
          text: stringOrExpression.optional(),
          pressEnterKey: booleanOrExpression.optional(),
          elementDescription: stringOrExpression.optional(),
          additionalFields: z.object({ visualScope: z.union([z.literal("auto"), z.literal("viewport"), z.literal("page"), z.literal("scan"), expressionSchema]).optional(), waitForNavigation: z.union([z.literal("load"), z.literal("domcontentloaded"), z.literal("networkidle0"), z.literal("networkidle2"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_interaction/index.schema.js"(exports2, module2) {
    var getClickSchema = require_operation_click_schema();
    var getFillSchema = require_operation_fill_schema();
    var getHoverSchema = require_operation_hover_schema();
    var getScrollSchema = require_operation_scroll_schema();
    var getTypeSchema = require_operation_type_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "run" } : parameters;
      return z.union([
        getClickSchema({ ...helpers, parameters: effectiveParams }),
        getFillSchema({ ...helpers, parameters: effectiveParams }),
        getHoverSchema({ ...helpers, parameters: effectiveParams }),
        getScrollSchema({ ...helpers, parameters: effectiveParams }),
        getTypeSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_session/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_session/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("session").default("session"),
          operation: z.literal("create"),
          profileName: stringOrExpression.optional(),
          saveProfileOnTermination: booleanOrExpression.optional(),
          record: booleanOrExpression.optional(),
          timeoutMinutes: numberOrExpression.optional(),
          proxy: z.union([z.literal("none"), z.literal("integrated"), z.literal("proxyUrl"), expressionSchema]).optional(),
          proxyConfig: resolveSchema({ parameters, schema: z.object({ country: z.union([z.literal("AF"), z.literal("AX"), z.literal("AL"), z.literal("DZ"), z.literal("AS"), z.literal("AD"), z.literal("AO"), z.literal("AI"), z.literal("AQ"), z.literal("AG"), z.literal("AR"), z.literal("AM"), z.literal("AW"), z.literal("AU"), z.literal("AT"), z.literal("AZ"), z.literal("BS"), z.literal("BH"), z.literal("BD"), z.literal("BB"), z.literal("BY"), z.literal("BE"), z.literal("BZ"), z.literal("BJ"), z.literal("BM"), z.literal("BT"), z.literal("BO"), z.literal("BQ"), z.literal("BA"), z.literal("BW"), z.literal("BV"), z.literal("BR"), z.literal("IO"), z.literal("BN"), z.literal("BG"), z.literal("BF"), z.literal("BI"), z.literal("CV"), z.literal("KH"), z.literal("CM"), z.literal("CA"), z.literal("KY"), z.literal("CF"), z.literal("TD"), z.literal("CL"), z.literal("CN"), z.literal("CX"), z.literal("CC"), z.literal("CO"), z.literal("KM"), z.literal("CG"), z.literal("CD"), z.literal("CK"), z.literal("CR"), z.literal("CI"), z.literal("HR"), z.literal("CU"), z.literal("CW"), z.literal("CY"), z.literal("CZ"), z.literal("DK"), z.literal("DJ"), z.literal("DM"), z.literal("DO"), z.literal("EC"), z.literal("EG"), z.literal("SV"), z.literal("GQ"), z.literal("ER"), z.literal("EE"), z.literal("SZ"), z.literal("ET"), z.literal("FK"), z.literal("FO"), z.literal("FJ"), z.literal("FI"), z.literal("FR"), z.literal("GF"), z.literal("PF"), z.literal("TF"), z.literal("GA"), z.literal("GM"), z.literal("GE"), z.literal("DE"), z.literal("GH"), z.literal("GI"), z.literal("GR"), z.literal("GL"), z.literal("GD"), z.literal("GP"), z.literal("GU"), z.literal("GT"), z.literal("GG"), z.literal("GN"), z.literal("GW"), z.literal("GY"), z.literal("HT"), z.literal("HM"), z.literal("VA"), z.literal("HN"), z.literal("HK"), z.literal("HU"), z.literal("IS"), z.literal("IN"), z.literal("ID"), z.literal("IR"), z.literal("IQ"), z.literal("IE"), z.literal("IM"), z.literal("IL"), z.literal("IT"), z.literal("JM"), z.literal("JP"), z.literal("JE"), z.literal("JO"), z.literal("KZ"), z.literal("KE"), z.literal("KI"), z.literal("KP"), z.literal("KR"), z.literal("KW"), z.literal("KG"), z.literal("LA"), z.literal("LV"), z.literal("LB"), z.literal("LS"), z.literal("LR"), z.literal("LY"), z.literal("LI"), z.literal("LT"), z.literal("LU"), z.literal("MO"), z.literal("MG"), z.literal("MW"), z.literal("MY"), z.literal("MV"), z.literal("ML"), z.literal("MT"), z.literal("MH"), z.literal("MQ"), z.literal("MR"), z.literal("MU"), z.literal("YT"), z.literal("MX"), z.literal("FM"), z.literal("MD"), z.literal("MC"), z.literal("MN"), z.literal("ME"), z.literal("MS"), z.literal("MA"), z.literal("MZ"), z.literal("MM"), z.literal("NA"), z.literal("NR"), z.literal("NP"), z.literal("NL"), z.literal("NC"), z.literal("NZ"), z.literal("NI"), z.literal("NE"), z.literal("NG"), z.literal("NU"), z.literal("NF"), z.literal("MK"), z.literal("MP"), z.literal("NO"), z.literal("OM"), z.literal("PK"), z.literal("PW"), z.literal("PS"), z.literal("PA"), z.literal("PG"), z.literal("PY"), z.literal("PE"), z.literal("PH"), z.literal("PN"), z.literal("PL"), z.literal("PT"), z.literal("PR"), z.literal("QA"), z.literal("RE"), z.literal("RO"), z.literal("RU"), z.literal("RW"), z.literal("BL"), z.literal("SH"), z.literal("KN"), z.literal("LC"), z.literal("MF"), z.literal("PM"), z.literal("VC"), z.literal("WS"), z.literal("SM"), z.literal("ST"), z.literal("SA"), z.literal("SN"), z.literal("RS"), z.literal("SC"), z.literal("SL"), z.literal("SG"), z.literal("SX"), z.literal("SK"), z.literal("SI"), z.literal("SB"), z.literal("SO"), z.literal("ZA"), z.literal("GS"), z.literal("SS"), z.literal("ES"), z.literal("LK"), z.literal("SD"), z.literal("SR"), z.literal("SJ"), z.literal("SE"), z.literal("CH"), z.literal("SY"), z.literal("TW"), z.literal("TJ"), z.literal("TZ"), z.literal("TH"), z.literal("TL"), z.literal("TG"), z.literal("TK"), z.literal("TO"), z.literal("TT"), z.literal("TN"), z.literal("TR"), z.literal("TM"), z.literal("TC"), z.literal("TV"), z.literal("UG"), z.literal("UA"), z.literal("AE"), z.literal("GB"), z.literal("UM"), z.literal("US"), z.literal("UY"), z.literal("UZ"), z.literal("VU"), z.literal("VE"), z.literal("VN"), z.literal("VG"), z.literal("VI"), z.literal("WF"), z.literal("EH"), z.literal("YE"), z.literal("ZM"), z.literal("ZW"), expressionSchema]).optional(), sticky: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "proxy": ["integrated"] } }, defaults: { "proxy": "none" } }),
          proxyUrl: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "proxy": ["proxyUrl"] } }, defaults: { "proxy": "none" } }),
          additionalFields: z.object({ solveCaptcha: booleanOrExpression.optional(), extensionIds: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_session/operation_save.schema.js
var require_operation_save_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_session/operation_save.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("session").default("session"),
          operation: z.literal("save"),
          sessionId: stringOrExpression.optional(),
          profileName: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_session/operation_terminate.schema.js
var require_operation_terminate_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_session/operation_terminate.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("session").default("session"),
          operation: z.literal("terminate"),
          sessionId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_session/operation_wait_for_download.schema.js
var require_operation_wait_for_download_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_session/operation_wait_for_download.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("session").default("session"),
          operation: z.literal("waitForDownload"),
          sessionId: stringOrExpression.optional(),
          additionalFields: z.object({ timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_session/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_session/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getSaveSchema = require_operation_save_schema();
    var getTerminateSchema = require_operation_terminate_schema();
    var getWaitForDownloadSchema = require_operation_wait_for_download_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "run" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getSaveSchema({ ...helpers, parameters: effectiveParams }),
        getTerminateSchema({ ...helpers, parameters: effectiveParams }),
        getWaitForDownloadSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_close.schema.js
var require_operation_close_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_close.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("window"),
          operation: z.literal("close"),
          sessionId: stringOrExpression.optional(),
          windowId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("window"),
          operation: z.literal("create"),
          sessionId: stringOrExpression.optional(),
          url: stringOrExpression.optional(),
          getLiveView: booleanOrExpression.optional(),
          includeNavigationBar: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "getLiveView": [true] } }, defaults: { "getLiveView": false } }),
          screenResolution: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "getLiveView": [true] } }, defaults: { "getLiveView": false } }),
          disableResize: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "getLiveView": [true] } }, defaults: { "getLiveView": false } }),
          additionalFields: z.object({ waitUntil: z.union([z.literal("load"), z.literal("domContentLoaded"), z.literal("complete"), z.literal("noWait"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_get_live_view.schema.js
var require_operation_get_live_view_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_get_live_view.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("window"),
          operation: z.literal("getLiveView"),
          sessionId: stringOrExpression.optional(),
          windowId: stringOrExpression.optional(),
          additionalFields: z.object({ includeNavigationBar: booleanOrExpression.optional(), screenResolution: stringOrExpression.optional(), disableResize: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_list.schema.js
var require_operation_list_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_list.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("window"),
          operation: z.literal("list"),
          sessionId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_load.schema.js
var require_operation_load_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_load.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("window"),
          operation: z.literal("load"),
          sessionId: stringOrExpression.optional(),
          windowId: stringOrExpression.optional(),
          url: stringOrExpression.optional(),
          additionalFields: z.object({ waitUntil: z.union([z.literal("complete"), z.literal("domContentLoaded"), z.literal("load"), z.literal("noWait"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_take_screenshot.schema.js
var require_operation_take_screenshot_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/operation_take_screenshot.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("window"),
          operation: z.literal("takeScreenshot"),
          sessionId: stringOrExpression.optional(),
          windowId: stringOrExpression.optional(),
          outputImageAsBinary: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/resource_window/index.schema.js"(exports2, module2) {
    var getCloseSchema = require_operation_close_schema();
    var getCreateSchema = require_operation_create_schema2();
    var getGetLiveViewSchema = require_operation_get_live_view_schema();
    var getListSchema = require_operation_list_schema();
    var getLoadSchema = require_operation_load_schema2();
    var getTakeScreenshotSchema = require_operation_take_screenshot_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "run" } : parameters;
      return z.union([
        getCloseSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getGetLiveViewSchema({ ...helpers, parameters: effectiveParams }),
        getListSchema({ ...helpers, parameters: effectiveParams }),
        getLoadSchema({ ...helpers, parameters: effectiveParams }),
        getTakeScreenshotSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/airtop/v11/index.schema.js
var getAgentSchema = require_index_schema();
var getExtractionSchema = require_index_schema2();
var getFileSchema = require_index_schema3();
var getInteractionSchema = require_index_schema4();
var getSessionSchema = require_index_schema5();
var getWindowSchema = require_index_schema6();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "session" } : parameters;
  return z.union([
    getAgentSchema({ ...helpers, parameters: effectiveParams }),
    getExtractionSchema({ ...helpers, parameters: effectiveParams }),
    getFileSchema({ ...helpers, parameters: effectiveParams }),
    getInteractionSchema({ ...helpers, parameters: effectiveParams }),
    getSessionSchema({ ...helpers, parameters: effectiveParams }),
    getWindowSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
