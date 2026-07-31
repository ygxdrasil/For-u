var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/flow/v1/resource_task/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/flow/v1/resource_task/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task").default("task"),
          operation: z.literal("create").default("create"),
          workspaceId: stringOrExpression.optional(),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ ownerid: stringOrExpression.optional(), listID: stringOrExpression.optional(), startsOn: stringOrExpression.optional(), dueOn: stringOrExpression.optional(), mirrorParentSubscribers: booleanOrExpression.optional(), mirrorParentTags: booleanOrExpression.optional(), noteContent: stringOrExpression.optional(), noteMimeType: z.union([z.literal("text/plain"), z.literal("text/x-markdown"), z.literal("text/html"), expressionSchema]).optional(), parentId: stringOrExpression.optional(), positionList: numberOrExpression.optional(), positionUpcoming: numberOrExpression.optional(), position: numberOrExpression.optional(), sectionId: stringOrExpression.optional(), tags: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/flow/v1/resource_task/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/flow/v1/resource_task/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task").default("task"),
          operation: z.literal("get"),
          taskId: stringOrExpression.optional(),
          filters: z.object({ include: z.array(z.union([z.literal("schedule"), z.literal("files"), z.literal("file_associations"), z.literal("parent")])).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/flow/v1/resource_task/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/flow/v1/resource_task/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task").default("task"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ include: z.array(z.union([z.literal("schedule"), z.literal("files"), z.literal("file_associations"), z.literal("parent")])).optional(), order: z.union([z.literal("account_id"), z.literal("completed_at"), z.literal("created_at"), z.literal("due_on"), z.literal("list_id"), z.literal("name"), z.literal("owner_id"), z.literal("position"), z.literal("section_id"), z.literal("starts_on"), z.literal("updated_at"), expressionSchema]).optional(), workspaceId: stringOrExpression.optional(), createdBefore: stringOrExpression.optional(), createdAfter: stringOrExpression.optional(), updateBefore: stringOrExpression.optional(), updateAfter: stringOrExpression.optional(), deleted: booleanOrExpression.optional(), cleared: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/flow/v1/resource_task/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/flow/v1/resource_task/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task").default("task"),
          operation: z.literal("update"),
          workspaceId: stringOrExpression.optional(),
          taskId: stringOrExpression.optional(),
          updateFields: z.object({ name: stringOrExpression.optional(), completed: booleanOrExpression.optional(), ownerid: stringOrExpression.optional(), listID: stringOrExpression.optional(), startsOn: stringOrExpression.optional(), dueOn: stringOrExpression.optional(), mirrorParentSubscribers: booleanOrExpression.optional(), mirrorParentTags: booleanOrExpression.optional(), noteContent: stringOrExpression.optional(), noteMimeType: z.union([z.literal("text/plain"), z.literal("text/x-markdown"), z.literal("text/html"), expressionSchema]).optional(), parentId: stringOrExpression.optional(), positionList: numberOrExpression.optional(), positionUpcoming: numberOrExpression.optional(), position: numberOrExpression.optional(), sectionId: stringOrExpression.optional(), tags: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/flow/v1/resource_task/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/flow/v1/resource_task/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/flow/v1/index.schema.js
var getTaskSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "task" } : parameters;
  return getTaskSchema({ ...helpers, parameters: effectiveParams });
};
