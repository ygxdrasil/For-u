var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_spreadsheet/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_spreadsheet/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("spreadsheet"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("serviceAccount"), z.literal("oAuth2"), expressionSchema]).optional(),
          title: stringOrExpression.optional(),
          sheetsUi: z.object({ sheetValues: z.array(z.object({ title: stringOrExpression.optional(), hidden: booleanOrExpression.optional() })).optional() }).optional(),
          options: z.object({ locale: stringOrExpression.optional(), autoRecalc: z.union([z.literal(""), z.literal("ON_CHANGE"), z.literal("MINUTE"), z.literal("HOUR"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_spreadsheet/operation_delete_spreadsheet.schema.js
var require_operation_delete_spreadsheet_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_spreadsheet/operation_delete_spreadsheet.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("spreadsheet"),
          operation: z.literal("deleteSpreadsheet"),
          authentication: z.union([z.literal("serviceAccount"), z.literal("oAuth2"), expressionSchema]).optional(),
          documentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_spreadsheet/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_spreadsheet/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSpreadsheetSchema = require_operation_delete_spreadsheet_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "read" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSpreadsheetSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_append.schema.js
var require_operation_append_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_append.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("sheet").default("sheet"),
          operation: z.literal("append"),
          authentication: z.union([z.literal("serviceAccount"), z.literal("oAuth2"), expressionSchema]).optional(),
          documentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          sheetName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          columns: resolveSchema({ parameters, schema: resourceMapperValueSchema, required: false, displayOptions: { "hide": { "sheetName": [""] } }, defaults: { "sheetName": { "mode": "list", "value": "" } } }),
          options: resolveSchema({ parameters, schema: z.object({ cellFormat: z.union([z.literal("USER_ENTERED"), z.literal("RAW"), expressionSchema]).optional(), locationDefine: z.unknown().optional(), handlingExtraData: z.union([z.literal("insertInNewColumn"), z.literal("ignoreIt"), z.literal("error"), expressionSchema]).optional(), handlingExtraData: z.union([z.literal("insertInNewColumn"), z.literal("ignoreIt"), z.literal("error"), expressionSchema]).optional(), useAppend: booleanOrExpression.optional() }), required: false, displayOptions: { "hide": { "sheetName": [""] } }, defaults: { "sheetName": { "mode": "list", "value": "" } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_append_or_update.schema.js
var require_operation_append_or_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_append_or_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("sheet").default("sheet"),
          operation: z.literal("appendOrUpdate"),
          authentication: z.union([z.literal("serviceAccount"), z.literal("oAuth2"), expressionSchema]).optional(),
          documentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          sheetName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          columns: resolveSchema({ parameters, schema: resourceMapperValueSchema, required: false, displayOptions: { "hide": { "sheetName": [""] } }, defaults: { "sheetName": { "mode": "list", "value": "" } } }),
          options: resolveSchema({ parameters, schema: z.object({ cellFormat: z.union([z.literal("USER_ENTERED"), z.literal("RAW"), expressionSchema]).optional(), locationDefine: z.unknown().optional(), handlingExtraData: z.union([z.literal("insertInNewColumn"), z.literal("ignoreIt"), z.literal("error"), expressionSchema]).optional(), handlingExtraData: z.union([z.literal("insertInNewColumn"), z.literal("ignoreIt"), z.literal("error"), expressionSchema]).optional(), useAppend: booleanOrExpression.optional() }), required: false, displayOptions: { "hide": { "sheetName": [""] } }, defaults: { "sheetName": { "mode": "list", "value": "" } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_clear.schema.js
var require_operation_clear_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_clear.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("sheet").default("sheet"),
          operation: z.literal("clear"),
          authentication: z.union([z.literal("serviceAccount"), z.literal("oAuth2"), expressionSchema]).optional(),
          documentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          sheetName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          clear: resolveSchema({ parameters, schema: z.union([z.literal("wholeSheet"), z.literal("specificRows"), z.literal("specificColumns"), z.literal("specificRange"), expressionSchema]), required: false, displayOptions: { "hide": { "sheetName": [""] } }, defaults: { "sheetName": { "mode": "list", "value": "" } } }),
          keepFirstRow: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "clear": ["wholeSheet"] }, "hide": { "sheetName": [""] } }, defaults: { "clear": "wholeSheet", "sheetName": { "mode": "list", "value": "" } } }),
          startIndex: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "clear": ["specificRows", "specificColumns"] }, "hide": { "sheetName": [""] } }, defaults: { "clear": "wholeSheet", "sheetName": { "mode": "list", "value": "" } } }),
          rowsToDelete: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "clear": ["specificRows"] }, "hide": { "sheetName": [""] } }, defaults: { "clear": "wholeSheet", "sheetName": { "mode": "list", "value": "" } } }),
          columnsToDelete: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "clear": ["specificColumns"] }, "hide": { "sheetName": [""] } }, defaults: { "clear": "wholeSheet", "sheetName": { "mode": "list", "value": "" } } }),
          range: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "clear": ["specificRange"] }, "hide": { "sheetName": [""] } }, defaults: { "clear": "wholeSheet", "sheetName": { "mode": "list", "value": "" } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("sheet").default("sheet"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("serviceAccount"), z.literal("oAuth2"), expressionSchema]).optional(),
          documentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          title: stringOrExpression.optional(),
          options: z.object({ hidden: booleanOrExpression.optional(), rightToLeft: booleanOrExpression.optional(), sheetId: numberOrExpression.optional(), index: numberOrExpression.optional(), tabColor: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("sheet").default("sheet"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("serviceAccount"), z.literal("oAuth2"), expressionSchema]).optional(),
          documentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          sheetName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          toDelete: resolveSchema({ parameters, schema: z.union([z.literal("rows"), z.literal("columns"), expressionSchema]), required: false, displayOptions: { "hide": { "sheetName": [""] } }, defaults: { "sheetName": { "mode": "list", "value": "" } } }),
          startIndex: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "toDelete": ["rows", "columns"] }, "hide": { "sheetName": [""] } }, defaults: { "toDelete": "rows", "sheetName": { "mode": "list", "value": "" } } }),
          numberToDelete: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "toDelete": ["rows", "columns"] }, "hide": { "sheetName": [""] } }, defaults: { "toDelete": "rows", "sheetName": { "mode": "list", "value": "" } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_read.schema.js
var require_operation_read_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_read.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("sheet").default("sheet"),
          operation: z.literal("read").default("read"),
          authentication: z.union([z.literal("serviceAccount"), z.literal("oAuth2"), expressionSchema]).optional(),
          documentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          sheetName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          filtersUI: resolveSchema({ parameters, schema: z.object({ values: z.array(z.object({ lookupColumn: stringOrExpression.optional(), lookupValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "hide": { "sheetName": [""] } }, defaults: { "sheetName": { "mode": "list", "value": "" } } }),
          combineFilters: resolveSchema({ parameters, schema: z.union([z.literal("AND"), z.literal("OR"), expressionSchema]), required: false, displayOptions: { "hide": { "sheetName": [""] } }, defaults: { "sheetName": { "mode": "list", "value": "" } } }),
          options: resolveSchema({ parameters, schema: z.object({ dataLocationOnSheet: z.unknown().optional(), outputFormatting: z.unknown().optional(), returnFirstMatch: booleanOrExpression.optional(), returnAllMatches: z.union([z.literal("returnFirstMatch"), z.literal("returnAllMatches"), expressionSchema]).optional() }), required: false, displayOptions: { "hide": { "sheetName": [""] } }, defaults: { "sheetName": { "mode": "list", "value": "" } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_remove.schema.js
var require_operation_remove_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_remove.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("sheet").default("sheet"),
          operation: z.literal("remove"),
          authentication: z.union([z.literal("serviceAccount"), z.literal("oAuth2"), expressionSchema]).optional(),
          documentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          sheetName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("sheet").default("sheet"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("serviceAccount"), z.literal("oAuth2"), expressionSchema]).optional(),
          documentId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          sheetName: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          columns: resolveSchema({ parameters, schema: resourceMapperValueSchema, required: false, displayOptions: { "hide": { "sheetName": [""] } }, defaults: { "sheetName": { "mode": "list", "value": "" } } }),
          options: resolveSchema({ parameters, schema: z.object({ cellFormat: z.union([z.literal("USER_ENTERED"), z.literal("RAW"), expressionSchema]).optional(), locationDefine: z.unknown().optional(), handlingExtraData: z.union([z.literal("insertInNewColumn"), z.literal("ignoreIt"), z.literal("error"), expressionSchema]).optional(), handlingExtraData: z.union([z.literal("insertInNewColumn"), z.literal("ignoreIt"), z.literal("error"), expressionSchema]).optional() }), required: false, displayOptions: { "hide": { "sheetName": [""] } }, defaults: { "sheetName": { "mode": "list", "value": "" } } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/resource_sheet/index.schema.js"(exports2, module2) {
    var getAppendSchema = require_operation_append_schema();
    var getAppendOrUpdateSchema = require_operation_append_or_update_schema();
    var getClearSchema = require_operation_clear_schema();
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema();
    var getReadSchema = require_operation_read_schema();
    var getRemoveSchema = require_operation_remove_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "read" } : parameters;
      return z.union([
        getAppendSchema({ ...helpers, parameters: effectiveParams }),
        getAppendOrUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getClearSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getReadSchema({ ...helpers, parameters: effectiveParams }),
        getRemoveSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleSheets/v47/index.schema.js
var getSpreadsheetSchema = require_index_schema();
var getSheetSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "sheet" } : parameters;
  return z.union([
    getSpreadsheetSchema({ ...helpers, parameters: effectiveParams }),
    getSheetSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
