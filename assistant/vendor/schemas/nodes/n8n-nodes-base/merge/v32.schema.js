var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/merge/v32/mode_append.schema.js
var require_mode_append_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/merge/v32/mode_append.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("append").default("append"),
          numberInputs: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10)]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/merge/v32/mode_choose_branch.schema.js
var require_mode_choose_branch_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/merge/v32/mode_choose_branch.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("chooseBranch"),
          numberInputs: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10)]).optional(),
          chooseBranchMode: z.union([z.literal("waitForAll"), expressionSchema]).optional(),
          output: resolveSchema({ parameters, schema: z.union([z.literal("specifiedInput"), z.literal("empty"), expressionSchema]), required: false, displayOptions: { "show": { "chooseBranchMode": ["waitForAll"] } }, defaults: { "chooseBranchMode": "waitForAll" } }),
          useDataOfInput: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "output": ["specifiedInput"] } }, defaults: { "output": "specifiedInput" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/merge/v32/mode_combine.schema.js
var require_mode_combine_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/merge/v32/mode_combine.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("combine"),
          combineBy: z.union([z.literal("combineByFields"), z.literal("combineByPosition"), z.literal("combineAll")]).optional(),
          options: resolveSchema({ parameters, schema: z.object({ clashHandling: z.unknown().optional(), fuzzyCompare: booleanOrExpression.optional(), disableDotNotation: booleanOrExpression.optional(), multipleMatches: z.union([z.literal("all"), z.literal("first"), expressionSchema]).optional(), multipleMatches: z.union([z.literal("all"), z.literal("first"), expressionSchema]).optional(), includeUnpaired: booleanOrExpression.optional() }), required: false, displayOptions: { "show": { "combineBy": ["combineAll", "combineByFields", "combineByPosition"] } }, defaults: { "combineBy": "combineByFields" } }),
          advanced: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "combineBy": ["combineByFields"] } }, defaults: { "combineBy": "combineByFields" } }),
          fieldsToMatchString: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "advanced": [false], "combineBy": ["combineByFields"] } }, defaults: { "advanced": false, "combineBy": "combineByFields" } }),
          mergeByFields: resolveSchema({ parameters, schema: z.object({ values: z.array(z.object({ field1: stringOrExpression.optional(), field2: stringOrExpression.optional() })).optional() }), required: false, displayOptions: { "show": { "advanced": [true], "combineBy": ["combineByFields"] } }, defaults: { "advanced": false, "combineBy": "combineByFields" } }),
          joinMode: resolveSchema({ parameters, schema: z.union([z.literal("keepMatches"), z.literal("keepNonMatches"), z.literal("keepEverything"), z.literal("enrichInput1"), z.literal("enrichInput2"), expressionSchema]), required: false, displayOptions: { "show": { "combineBy": ["combineByFields"] } }, defaults: { "combineBy": "combineByFields" } }),
          outputDataFrom: resolveSchema({ parameters, schema: z.union([z.literal("both"), z.literal("input1"), z.literal("input2"), expressionSchema]), required: false, displayOptions: { "show": { "joinMode": ["keepMatches", "keepNonMatches"], "combineBy": ["combineByFields"] } }, defaults: { "joinMode": "keepMatches", "combineBy": "combineByFields" } }),
          numberInputs: resolveSchema({ parameters, schema: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10)]), required: false, displayOptions: { "show": { "combineBy": ["combineByPosition"] } }, defaults: { "combineBy": "combineByFields" } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/merge/v32/mode_combine_by_sql.schema.js
var require_mode_combine_by_sql_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/merge/v32/mode_combine_by_sql.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("combineBySql"),
          numberInputs: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10)]).optional(),
          query: z.string().optional(),
          options: z.object({ emptyQueryResult: z.union([z.literal("success"), z.literal("empty"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/merge/v32/index.schema.js
var getAppendSchema = require_mode_append_schema();
var getChooseBranchSchema = require_mode_choose_branch_schema();
var getCombineSchema = require_mode_combine_schema();
var getCombineBySqlSchema = require_mode_combine_by_sql_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.mode === void 0 ? { ...parameters, mode: "append" } : parameters;
  return z.union([
    getAppendSchema({ ...helpers, parameters: effectiveParams }),
    getChooseBranchSchema({ ...helpers, parameters: effectiveParams }),
    getCombineSchema({ ...helpers, parameters: effectiveParams }),
    getCombineBySqlSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
