var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/memoryManager/v11/mode_delete.schema.js
var require_mode_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/memoryManager/v11/mode_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema, resolveOneOfSchemas, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          mode: z.literal("delete"),
          deleteMode: z.union([z.literal("lastN"), z.literal("all")]).optional(),
          lastMessagesCount: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "deleteMode": ["lastN"] } }, defaults: { "deleteMode": "lastN" } })
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/memoryManager/v11/mode_insert.schema.js
var require_mode_insert_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/memoryManager/v11/mode_insert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          mode: z.literal("insert"),
          insertMode: z.union([z.literal("insert"), z.literal("override")]).optional(),
          messages: z.object({ messageValues: z.array(z.object({ type: z.union([z.literal("ai"), z.literal("system"), z.literal("user"), expressionSchema]).optional(), message: stringOrExpression.optional(), hideFromUI: booleanOrExpression.optional() })).optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/memoryManager/v11/mode_load.schema.js
var require_mode_load_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/memoryManager/v11/mode_load.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, memoryInstanceSchema }) {
      const subnodesSchema = z.object({
        memory: memoryInstanceSchema.optional()
      }).strict();
      return z.object({
        parameters: z.object({
          mode: z.literal("load").default("load"),
          simplifyOutput: booleanOrExpression.optional(),
          options: z.object({ groupMessages: booleanOrExpression.optional() }).optional()
        }).optional(),
        subnodes: subnodesSchema.optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/@n8n/n8n-nodes-langchain/dist/node-definitions/nodes/n8n-nodes-langchain/memoryManager/v11/index.schema.js
var getDeleteSchema = require_mode_delete_schema();
var getInsertSchema = require_mode_insert_schema();
var getLoadSchema = require_mode_load_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.mode === void 0 ? { ...parameters, mode: "load" } : parameters;
  return z.union([
    getDeleteSchema({ ...helpers, parameters: effectiveParams }),
    getInsertSchema({ ...helpers, parameters: effectiveParams }),
    getLoadSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
