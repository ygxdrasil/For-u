var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          binaryData: booleanOrExpression.optional(),
          fileContent: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [false] } }, defaults: { "binaryData": false } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [true] } }, defaults: { "binaryData": false } }),
          commitMessage: stringOrExpression.optional(),
          additionalParameters: z.object({ author: z.object({ name: stringOrExpression.optional(), email: stringOrExpression.optional() }).optional(), branch: z.object({ branch: stringOrExpression.optional() }).optional(), committer: z.object({ name: stringOrExpression.optional(), email: stringOrExpression.optional() }).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          commitMessage: stringOrExpression.optional(),
          additionalParameters: z.object({ author: z.object({ name: stringOrExpression.optional(), email: stringOrExpression.optional() }).optional(), branch: z.object({ branch: stringOrExpression.optional() }).optional(), committer: z.object({ name: stringOrExpression.optional(), email: stringOrExpression.optional() }).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/operation_edit.schema.js
var require_operation_edit_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/operation_edit.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("edit"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          binaryData: booleanOrExpression.optional(),
          fileContent: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [false] } }, defaults: { "binaryData": false } }),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "binaryData": [true] } }, defaults: { "binaryData": false } }),
          commitMessage: stringOrExpression.optional(),
          additionalParameters: z.object({ author: z.object({ name: stringOrExpression.optional(), email: stringOrExpression.optional() }).optional(), branch: z.object({ branch: stringOrExpression.optional() }).optional(), committer: z.object({ name: stringOrExpression.optional(), email: stringOrExpression.optional() }).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          asBinaryProperty: booleanOrExpression.optional(),
          binaryPropertyName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "asBinaryProperty": [true] } }, defaults: { "asBinaryProperty": true } }),
          additionalParameters: z.object({ reference: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/operation_list.schema.js
var require_operation_list_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/operation_list.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("list"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          filePath: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_file/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getEditSchema = require_operation_edit_schema();
    var getGetSchema = require_operation_get_schema();
    var getListSchema = require_operation_list_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getRepositories" } : parameters;
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("issue").default("issue"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          title: stringOrExpression.optional(),
          body: stringOrExpression.optional(),
          labels: z.object({ label: stringOrExpression.optional() }).optional(),
          assignees: z.object({ assignee: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/operation_create_comment.schema.js
var require_operation_create_comment_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/operation_create_comment.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("issue").default("issue"),
          operation: z.literal("createComment"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          issueNumber: numberOrExpression.optional(),
          body: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/operation_edit.schema.js
var require_operation_edit_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/operation_edit.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("issue").default("issue"),
          operation: z.literal("edit"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          issueNumber: numberOrExpression.optional(),
          editFields: z.object({ assignees: z.unknown().optional(), body: stringOrExpression.optional(), labels: z.unknown().optional(), state: z.union([z.literal("closed"), z.literal("open"), expressionSchema]).optional(), state_reason: z.union([z.literal("completed"), z.literal("not_planned"), z.literal("reopened"), expressionSchema]).optional(), title: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("issue").default("issue"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          issueNumber: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/operation_lock.schema.js
var require_operation_lock_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/operation_lock.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("issue").default("issue"),
          operation: z.literal("lock"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          issueNumber: numberOrExpression.optional(),
          lockReason: z.union([z.literal("off-topic"), z.literal("too heated"), z.literal("resolved"), z.literal("spam"), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_issue/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getCreateCommentSchema = require_operation_create_comment_schema();
    var getEditSchema = require_operation_edit_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getLockSchema = require_operation_lock_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getRepositories" } : parameters;
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_organization/operation_get_repositories.schema.js
var require_operation_get_repositories_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_organization/operation_get_repositories.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("organization"),
          operation: z.literal("getRepositories").default("getRepositories"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_organization/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_organization/index.schema.js"(exports2, module2) {
    var getGetRepositoriesSchema = require_operation_get_repositories_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getRepositories" } : parameters;
      return getGetRepositoriesSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/operation_create.schema.js
var require_operation_create_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("release"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          releaseTag: stringOrExpression.optional(),
          additionalFields: z.object({ name: stringOrExpression.optional(), body: stringOrExpression.optional(), draft: booleanOrExpression.optional(), prerelease: booleanOrExpression.optional(), target_commitish: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("release"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          release_id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("release"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          release_id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("release"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("release"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          release_id: stringOrExpression.optional(),
          additionalFields: z.object({ body: stringOrExpression.optional(), draft: booleanOrExpression.optional(), name: stringOrExpression.optional(), prerelease: booleanOrExpression.optional(), tag_name: stringOrExpression.optional(), target_commitish: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_release/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema3();
    var getDeleteSchema = require_operation_delete_schema2();
    var getGetSchema = require_operation_get_schema3();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getRepositories" } : parameters;
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("repository"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_get_issues.schema.js
var require_operation_get_issues_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_get_issues.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("repository"),
          operation: z.literal("getIssues"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          getRepositoryIssuesFilters: z.object({ assignee: stringOrExpression.optional(), creator: stringOrExpression.optional(), mentioned: stringOrExpression.optional(), labels: stringOrExpression.optional(), since: stringOrExpression.optional(), state: z.union([z.literal("all"), z.literal("closed"), z.literal("open"), expressionSchema]).optional(), sort: z.union([z.literal("created"), z.literal("updated"), z.literal("comments"), expressionSchema]).optional(), direction: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_get_license.schema.js
var require_operation_get_license_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_get_license.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("repository"),
          operation: z.literal("getLicense"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_get_profile.schema.js
var require_operation_get_profile_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_get_profile.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("repository"),
          operation: z.literal("getProfile"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_get_pull_requests.schema.js
var require_operation_get_pull_requests_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_get_pull_requests.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("repository"),
          operation: z.literal("getPullRequests"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          getRepositoryPullRequestsFilters: z.object({ state: z.union([z.literal("all"), z.literal("closed"), z.literal("open"), expressionSchema]).optional(), sort: z.union([z.literal("created"), z.literal("updated"), z.literal("popularity"), z.literal("long-running"), expressionSchema]).optional(), direction: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_list_popular_paths.schema.js
var require_operation_list_popular_paths_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_list_popular_paths.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("repository"),
          operation: z.literal("listPopularPaths"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_list_referrers.schema.js
var require_operation_list_referrers_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/operation_list_referrers.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("repository"),
          operation: z.literal("listReferrers"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_repository/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema4();
    var getGetIssuesSchema = require_operation_get_issues_schema();
    var getGetLicenseSchema = require_operation_get_license_schema();
    var getGetProfileSchema = require_operation_get_profile_schema();
    var getGetPullRequestsSchema = require_operation_get_pull_requests_schema();
    var getListPopularPathsSchema = require_operation_list_popular_paths_schema();
    var getListReferrersSchema = require_operation_list_referrers_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getRepositories" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetIssuesSchema({ ...helpers, parameters: effectiveParams }),
        getGetLicenseSchema({ ...helpers, parameters: effectiveParams }),
        getGetProfileSchema({ ...helpers, parameters: effectiveParams }),
        getGetPullRequestsSchema({ ...helpers, parameters: effectiveParams }),
        getListPopularPathsSchema({ ...helpers, parameters: effectiveParams }),
        getListReferrersSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_review/operation_create.schema.js
var require_operation_create_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_review/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("review"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          pullRequestNumber: numberOrExpression.optional(),
          event: z.union([z.literal("approve"), z.literal("requestChanges"), z.literal("comment"), z.literal("pending"), expressionSchema]).optional(),
          body: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "event": ["requestChanges", "comment"] } }, defaults: { "event": "approve" } }),
          additionalFields: z.object({ commitId: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_review/operation_get.schema.js
var require_operation_get_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_review/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("review"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          pullRequestNumber: numberOrExpression.optional(),
          reviewId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_review/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_review/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("review"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          pullRequestNumber: numberOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_review/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_review/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("review"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          pullRequestNumber: numberOrExpression.optional(),
          reviewId: stringOrExpression.optional(),
          body: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_review/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_review/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema4();
    var getGetSchema = require_operation_get_schema5();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getRepositories" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_user/operation_get_repositories.schema.js
var require_operation_get_repositories_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_user/operation_get_repositories.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("getRepositories").default("getRepositories"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_user/operation_get_user_issues.schema.js
var require_operation_get_user_issues_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_user/operation_get_user_issues.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("getUserIssues"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          getUserIssuesFilters: z.object({ mentioned: stringOrExpression.optional(), labels: stringOrExpression.optional(), since: stringOrExpression.optional(), state: z.union([z.literal("all"), z.literal("closed"), z.literal("open"), expressionSchema]).optional(), sort: z.union([z.literal("created"), z.literal("updated"), z.literal("comments"), expressionSchema]).optional(), direction: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_user/operation_invite.schema.js
var require_operation_invite_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_user/operation_invite.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("invite"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          organization: stringOrExpression.optional(),
          email: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_user/index.schema.js
var require_index_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_user/index.schema.js"(exports2, module2) {
    var getGetRepositoriesSchema = require_operation_get_repositories_schema2();
    var getGetUserIssuesSchema = require_operation_get_user_issues_schema();
    var getInviteSchema = require_operation_invite_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getRepositories" } : parameters;
      return z.union([
        getGetRepositoriesSchema({ ...helpers, parameters: effectiveParams }),
        getGetUserIssuesSchema({ ...helpers, parameters: effectiveParams }),
        getInviteSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_disable.schema.js
var require_operation_disable_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_disable.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("workflow"),
          operation: z.literal("disable"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          workflowId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("filename"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_dispatch.schema.js
var require_operation_dispatch_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_dispatch.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("workflow"),
          operation: z.literal("dispatch"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          workflowId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("filename"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          ref: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          inputs: z.union([iDataObjectSchema, z.string()]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_dispatch_and_wait.schema.js
var require_operation_dispatch_and_wait_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_dispatch_and_wait.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("workflow"),
          operation: z.literal("dispatchAndWait"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          workflowId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("filename"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          ref: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          inputs: z.union([iDataObjectSchema, z.string()]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_enable.schema.js
var require_operation_enable_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_enable.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("workflow"),
          operation: z.literal("enable"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          workflowId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("filename"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_get.schema.js
var require_operation_get_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("workflow"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          workflowId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("filename"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_get_usage.schema.js
var require_operation_get_usage_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_get_usage.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("workflow"),
          operation: z.literal("getUsage"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          workflowId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("filename"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_list.schema.js
var require_operation_list_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/operation_list.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("workflow"),
          operation: z.literal("list"),
          authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/index.schema.js
var require_index_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/resource_workflow/index.schema.js"(exports2, module2) {
    var getDisableSchema = require_operation_disable_schema();
    var getDispatchSchema = require_operation_dispatch_schema();
    var getDispatchAndWaitSchema = require_operation_dispatch_and_wait_schema();
    var getEnableSchema = require_operation_enable_schema();
    var getGetSchema = require_operation_get_schema6();
    var getGetUsageSchema = require_operation_get_usage_schema();
    var getListSchema = require_operation_list_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getRepositories" } : parameters;
      return z.union([
        getDisableSchema({ ...helpers, parameters: effectiveParams }),
        getDispatchSchema({ ...helpers, parameters: effectiveParams }),
        getDispatchAndWaitSchema({ ...helpers, parameters: effectiveParams }),
        getEnableSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetUsageSchema({ ...helpers, parameters: effectiveParams }),
        getListSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/github/v11/index.schema.js
var getFileSchema = require_index_schema();
var getIssueSchema = require_index_schema2();
var getOrganizationSchema = require_index_schema3();
var getReleaseSchema = require_index_schema4();
var getRepositorySchema = require_index_schema5();
var getReviewSchema = require_index_schema6();
var getUserSchema = require_index_schema7();
var getWorkflowSchema = require_index_schema8();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "issue" } : parameters;
  return z.union([
    getFileSchema({ ...helpers, parameters: effectiveParams }),
    getIssueSchema({ ...helpers, parameters: effectiveParams }),
    getOrganizationSchema({ ...helpers, parameters: effectiveParams }),
    getReleaseSchema({ ...helpers, parameters: effectiveParams }),
    getRepositorySchema({ ...helpers, parameters: effectiveParams }),
    getReviewSchema({ ...helpers, parameters: effectiveParams }),
    getUserSchema({ ...helpers, parameters: effectiveParams }),
    getWorkflowSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
