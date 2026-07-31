var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          filePath: stringOrExpression.optional(),
          binaryData: booleanOrExpression.optional(),
          fileContent: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [false] } }, defaults: { "binaryData": false } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [true] } }, defaults: { "binaryData": false } }),
          commitMessage: stringOrExpression.optional(),
          branch: stringOrExpression.optional(),
          additionalParameters: z.object({ branchStart: z.object({ branchStart: stringOrExpression.optional() }).optional(), author: z.object({ name: stringOrExpression.optional(), email: stringOrExpression.optional() }).optional(), encoding: z.object({ encoding: stringOrExpression.optional() }).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          filePath: stringOrExpression.optional(),
          commitMessage: stringOrExpression.optional(),
          branch: stringOrExpression.optional(),
          additionalParameters: z.object({ branchStart: z.object({ branchStart: stringOrExpression.optional() }).optional(), author: z.object({ name: stringOrExpression.optional(), email: stringOrExpression.optional() }).optional(), encoding: z.object({ encoding: stringOrExpression.optional() }).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/operation_edit.schema.js
var require_operation_edit_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/operation_edit.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("edit"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          filePath: stringOrExpression.optional(),
          binaryData: booleanOrExpression.optional(),
          fileContent: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [false] } }, defaults: { "binaryData": false } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [true] } }, defaults: { "binaryData": false } }),
          commitMessage: stringOrExpression.optional(),
          branch: stringOrExpression.optional(),
          additionalParameters: z.object({ branchStart: z.object({ branchStart: stringOrExpression.optional() }).optional(), author: z.object({ name: stringOrExpression.optional(), email: stringOrExpression.optional() }).optional(), encoding: z.object({ encoding: stringOrExpression.optional() }).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          filePath: stringOrExpression.optional(),
          asBinaryProperty: booleanOrExpression.optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "asBinaryProperty": [true] } }, defaults: { "asBinaryProperty": true } }),
          additionalParameters: z.object({ reference: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/operation_list.schema.js
var require_operation_list_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/operation_list.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("list"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filePath: stringOrExpression.optional(),
          page: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          additionalParameters: z.object({ ref: stringOrExpression.optional(), recursive: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_file/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getEditSchema = require_operation_edit_schema();
    var getGetSchema = require_operation_get_schema();
    var getListSchema = require_operation_list_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getEditSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getListSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("issue").default("issue"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          title: stringOrExpression.optional(),
          body: stringOrExpression.optional(),
          due_date: stringOrExpression.optional(),
          labels: z.object({ label: stringOrExpression.optional() }).optional(),
          assignee_ids: z.object({ assignee: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/operation_create_comment.schema.js
var require_operation_create_comment_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/operation_create_comment.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("issue").default("issue"),
          operation: z.literal("createComment"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          issueNumber: numberOrExpression.optional(),
          body: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/operation_edit.schema.js
var require_operation_edit_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/operation_edit.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("issue").default("issue"),
          operation: z.literal("edit"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          issueNumber: numberOrExpression.optional(),
          editFields: z.object({ title: stringOrExpression.optional(), description: stringOrExpression.optional(), state: z.union([z.literal("closed"), z.literal("open"), expressionSchema]).optional(), labels: z.unknown().optional(), assignee_ids: z.unknown().optional(), due_date: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("issue").default("issue"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          issueNumber: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/operation_lock.schema.js
var require_operation_lock_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/operation_lock.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("issue").default("issue"),
          operation: z.literal("lock"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          issueNumber: numberOrExpression.optional(),
          lockReason: z.union([z.literal("off-topic"), z.literal("too heated"), z.literal("resolved"), z.literal("spam"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_issue/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getCreateCommentSchema = require_operation_create_comment_schema();
    var getEditSchema = require_operation_edit_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getLockSchema = require_operation_lock_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getCreateCommentSchema({ ...helpers, parameters: effectiveParams }),
        getEditSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getLockSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/operation_create.schema.js
var require_operation_create_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("release"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          releaseTag: stringOrExpression.optional(),
          additionalFields: z.object({ name: stringOrExpression.optional(), description: stringOrExpression.optional(), ref: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("release"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          projectId: stringOrExpression.optional(),
          tag_name: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("release"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          projectId: stringOrExpression.optional(),
          tag_name: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("release"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          projectId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          additionalFields: z.object({ order_by: z.union([z.literal("created_at"), z.literal("released_at"), expressionSchema]).optional(), sort: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("release"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          projectId: stringOrExpression.optional(),
          tag_name: stringOrExpression.optional(),
          additionalFields: z.object({ name: stringOrExpression.optional(), description: stringOrExpression.optional(), milestones: stringOrExpression.optional(), released_at: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_release/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema3();
    var getDeleteSchema = require_operation_delete_schema2();
    var getGetSchema = require_operation_get_schema3();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_repository/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_repository/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("repository"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_repository/operation_get_issues.schema.js
var require_operation_get_issues_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_repository/operation_get_issues.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("repository"),
          operation: z.literal("getIssues"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional(),
          repository: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          getRepositoryIssuesFilters: z.object({ assignee_username: stringOrExpression.optional(), author_username: stringOrExpression.optional(), search: stringOrExpression.optional(), labels: stringOrExpression.optional(), updated_after: stringOrExpression.optional(), state: z.union([z.literal(""), z.literal("closed"), z.literal("opened"), expressionSchema]).optional(), order_by: z.union([z.literal("created_at"), z.literal("updated_at"), z.literal("priority"), expressionSchema]).optional(), sort: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_repository/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_repository/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema4();
    var getGetIssuesSchema = require_operation_get_issues_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetIssuesSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_user/operation_get_repositories.schema.js
var require_operation_get_repositories_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_user/operation_get_repositories.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("getRepositories"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_user/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/resource_user/index.schema.js"(exports2, module2) {
    var getGetRepositoriesSchema = require_operation_get_repositories_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getGetRepositoriesSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/gitlab/v1/index.schema.js
var getFileSchema = require_index_schema();
var getIssueSchema = require_index_schema2();
var getReleaseSchema = require_index_schema3();
var getRepositorySchema = require_index_schema4();
var getUserSchema = require_index_schema5();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "issue" } : parameters;
  return z.union([
    getFileSchema({ ...helpers, parameters: effectiveParams }),
    getIssueSchema({ ...helpers, parameters: effectiveParams }),
    getReleaseSchema({ ...helpers, parameters: effectiveParams }),
    getRepositorySchema({ ...helpers, parameters: effectiveParams }),
    getUserSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
