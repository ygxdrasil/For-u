var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_block/operation_append.schema.js
var require_operation_append_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_block/operation_append.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("block"),
          operation: z.literal("append").default("append"),
          blockId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          blockUi: z.object({ blockValues: z.array(z.object({ type: stringOrExpression.optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), checked: booleanOrExpression.optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), title: stringOrExpression.optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), url: stringOrExpression.optional() })).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_block/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_block/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("block"),
          operation: z.literal("getAll"),
          blockId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          fetchNestedBlocks: booleanOrExpression.optional(),
          simplifyOutput: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_block/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_block/index.schema.js"(exports2, module2) {
    var getAppendSchema = require_operation_append_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "append" } : parameters;
      return z.union([
        getAppendSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("database"),
          operation: z.literal("get"),
          databaseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("database"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database/operation_search.schema.js
var require_operation_search_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("database"),
          operation: z.literal("search"),
          text: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional(),
          options: z.object({ sort: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getSearchSchema = require_operation_search_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "append" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database_page/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database_page/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("databasePage"),
          operation: z.literal("create"),
          databaseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          title: stringOrExpression.optional(),
          simple: booleanOrExpression.optional(),
          propertiesUi: z.object({ propertyValues: z.array(z.object({ key: stringOrExpression.optional(), type: z.unknown().optional(), title: stringOrExpression.optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), phoneValue: stringOrExpression.optional(), multiSelectValue: z.array(z.string()).optional(), selectValue: stringOrExpression.optional(), statusValue: stringOrExpression.optional(), emailValue: stringOrExpression.optional(), ignoreIfEmpty: booleanOrExpression.optional(), urlValue: stringOrExpression.optional(), peopleValue: z.array(z.string()).optional(), relationValue: stringOrExpression.optional(), checkboxValue: booleanOrExpression.optional(), numberValue: numberOrExpression.optional(), range: booleanOrExpression.optional(), includeTime: booleanOrExpression.optional(), date: stringOrExpression.optional(), dateStart: stringOrExpression.optional(), dateEnd: stringOrExpression.optional(), timezone: stringOrExpression.optional(), fileUrls: z.unknown().optional() })).optional() }).optional(),
          blockUi: z.object({ blockValues: z.array(z.object({ type: stringOrExpression.optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), checked: booleanOrExpression.optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), title: stringOrExpression.optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), url: stringOrExpression.optional() })).optional() }).optional(),
          options: z.object({ iconType: z.union([z.literal("emoji"), z.literal("file"), expressionSchema]).optional(), icon: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database_page/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database_page/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("databasePage"),
          operation: z.literal("get"),
          pageId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database_page/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database_page/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("databasePage"),
          operation: z.literal("getAll"),
          databaseId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional(),
          filterType: z.union([z.literal("none"), z.literal("manual"), z.literal("json"), expressionSchema]).optional(),
          matchType: resolveSchema({ parameters, schema: z.union([z.literal("anyFilter"), z.literal("allFilters"), expressionSchema]), required: false, displayOptions: { "show": { "filterType": ["manual"] } }, defaults: { "filterType": "none" } }),
          filters: resolveSchema({ parameters, schema: z.object({ conditions: z.array(z.object({ key: stringOrExpression.optional(), type: z.unknown().optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), z.literal("contains"), z.literal("does_not_contain"), z.literal("starts_with"), z.literal("ends_with"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), z.literal("contains"), z.literal("does_not_contain"), z.literal("starts_with"), z.literal("ends_with"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), z.literal("greater_than"), z.literal("less_than"), z.literal("greater_than_or_equal_to"), z.literal("less_than_or_equal_to"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("contains"), z.literal("does_not_equal"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("before"), z.literal("after"), z.literal("on_or_before"), z.literal("is_empty"), z.literal("is_not_empty"), z.literal("on_or_after"), z.literal("past_week"), z.literal("past_month"), z.literal("past_year"), z.literal("next_week"), z.literal("next_month"), z.literal("next_year"), expressionSchema]).optional(), condition: z.union([z.literal("contains"), z.literal("does_not_contain"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), z.literal("contains"), z.literal("does_not_contain"), z.literal("starts_with"), z.literal("ends_with"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), z.literal("contains"), z.literal("does_not_contain"), z.literal("starts_with"), z.literal("ends_with"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), z.literal("contains"), z.literal("does_not_contain"), z.literal("starts_with"), z.literal("ends_with"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("contains"), z.literal("does_not_contain"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("contains"), z.literal("does_not_contain"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("before"), z.literal("after"), z.literal("on_or_before"), z.literal("is_empty"), z.literal("is_not_empty"), z.literal("on_or_after"), z.literal("past_week"), z.literal("past_month"), z.literal("past_year"), z.literal("next_week"), z.literal("next_month"), z.literal("next_year"), expressionSchema]).optional(), condition: z.union([z.literal("contains"), z.literal("does_not_contain"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("before"), z.literal("after"), z.literal("on_or_before"), z.literal("is_empty"), z.literal("is_not_empty"), z.literal("on_or_after"), z.literal("past_week"), z.literal("past_month"), z.literal("past_year"), z.literal("next_week"), z.literal("next_month"), z.literal("next_year"), expressionSchema]).optional(), returnType: z.union([z.literal("text"), z.literal("checkbox"), z.literal("number"), z.literal("date"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), z.literal("contains"), z.literal("does_not_contain"), z.literal("starts_with"), z.literal("ends_with"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("does_not_equal"), z.literal("greater_than"), z.literal("less_than"), z.literal("greater_than_or_equal_to"), z.literal("less_than_or_equal_to"), z.literal("is_empty"), z.literal("is_not_empty"), expressionSchema]).optional(), condition: z.union([z.literal("equals"), z.literal("before"), z.literal("after"), z.literal("on_or_before"), z.literal("is_empty"), z.literal("is_not_empty"), z.literal("on_or_after"), z.literal("past_week"), z.literal("past_month"), z.literal("past_year"), z.literal("next_week"), z.literal("next_month"), z.literal("next_year"), expressionSchema]).optional(), titleValue: stringOrExpression.optional(), richTextValue: stringOrExpression.optional(), phoneNumberValue: stringOrExpression.optional(), multiSelectValue: stringOrExpression.optional(), selectValue: stringOrExpression.optional(), statusValue: stringOrExpression.optional(), emailValue: stringOrExpression.optional(), urlValue: stringOrExpression.optional(), peopleValue: stringOrExpression.optional(), createdByValue: stringOrExpression.optional(), lastEditedByValue: stringOrExpression.optional(), relationValue: stringOrExpression.optional(), checkboxValue: booleanOrExpression.optional(), numberValue: numberOrExpression.optional(), date: stringOrExpression.optional(), createdTimeValue: stringOrExpression.optional(), lastEditedTime: stringOrExpression.optional(), numberValue: numberOrExpression.optional(), textValue: stringOrExpression.optional(), checkboxValue: booleanOrExpression.optional(), dateValue: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "filterType": ["manual"] } }, defaults: { "filterType": "none" } }),
          filterJson: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "filterType": ["json"] } }, defaults: { "filterType": "none" } }),
          options: z.object({ downloadFiles: booleanOrExpression.optional(), filter: z.unknown().optional(), sort: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database_page/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database_page/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("databasePage"),
          operation: z.literal("update"),
          pageId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          simple: booleanOrExpression.optional(),
          propertiesUi: z.object({ propertyValues: z.array(z.object({ key: stringOrExpression.optional(), type: z.unknown().optional(), title: stringOrExpression.optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), phoneValue: stringOrExpression.optional(), multiSelectValue: z.array(z.string()).optional(), selectValue: stringOrExpression.optional(), statusValue: stringOrExpression.optional(), emailValue: stringOrExpression.optional(), ignoreIfEmpty: booleanOrExpression.optional(), urlValue: stringOrExpression.optional(), peopleValue: z.array(z.string()).optional(), relationValue: stringOrExpression.optional(), checkboxValue: booleanOrExpression.optional(), numberValue: numberOrExpression.optional(), range: booleanOrExpression.optional(), includeTime: booleanOrExpression.optional(), date: stringOrExpression.optional(), dateStart: stringOrExpression.optional(), dateEnd: stringOrExpression.optional(), timezone: stringOrExpression.optional(), fileUrls: z.unknown().optional() })).optional() }).optional(),
          options: z.object({ iconType: z.union([z.literal("emoji"), z.literal("file"), expressionSchema]).optional(), icon: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database_page/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_database_page/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema3();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "append" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_page/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_page/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("page").default("page"),
          operation: z.literal("create"),
          pageId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          title: stringOrExpression.optional(),
          simple: booleanOrExpression.optional(),
          blockUi: z.object({ blockValues: z.array(z.object({ type: stringOrExpression.optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), checked: booleanOrExpression.optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), title: stringOrExpression.optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), richText: booleanOrExpression.optional(), textContent: stringOrExpression.optional(), text: z.unknown().optional(), url: stringOrExpression.optional() })).optional() }).optional(),
          options: z.object({ iconType: z.union([z.literal("emoji"), z.literal("file"), expressionSchema]).optional(), icon: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_page/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_page/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("page").default("page"),
          operation: z.literal("get")
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_page/operation_search.schema.js
var require_operation_search_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_page/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("page").default("page"),
          operation: z.literal("search"),
          text: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simple: booleanOrExpression.optional(),
          options: z.object({ filter: z.unknown().optional(), sort: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_page/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_page/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getGetSchema = require_operation_get_schema3();
    var getSearchSchema = require_operation_search_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "append" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_user/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_user/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("get"),
          userId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_user/operation_get_all.schema.js
var require_operation_get_all_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_user/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_user/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/resource_user/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema4();
    var getGetAllSchema = require_operation_get_all_schema4();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "append" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/notion/v22/index.schema.js
var getBlockSchema = require_index_schema();
var getDatabaseSchema = require_index_schema2();
var getDatabasePageSchema = require_index_schema3();
var getPageSchema = require_index_schema4();
var getUserSchema = require_index_schema5();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "page" } : parameters;
  return z.union([
    getBlockSchema({ ...helpers, parameters: effectiveParams }),
    getDatabaseSchema({ ...helpers, parameters: effectiveParams }),
    getDatabasePageSchema({ ...helpers, parameters: effectiveParams }),
    getPageSchema({ ...helpers, parameters: effectiveParams }),
    getUserSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
