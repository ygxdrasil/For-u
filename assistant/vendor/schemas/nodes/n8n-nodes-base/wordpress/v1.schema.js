var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_post/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_post/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("post").default("post"),
          operation: z.literal("create").default("create"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          title: stringOrExpression.optional(),
          additionalFields: z.object({ authorId: stringOrExpression.optional(), content: stringOrExpression.optional(), slug: stringOrExpression.optional(), password: stringOrExpression.optional(), status: z.union([z.literal("draft"), z.literal("future"), z.literal("pending"), z.literal("private"), z.literal("publish"), expressionSchema]).optional(), date: stringOrExpression.optional(), commentStatus: z.union([z.literal("open"), z.literal("closed"), expressionSchema]).optional(), pingStatus: z.union([z.literal("open"), z.literal("closed"), expressionSchema]).optional(), format: z.union([z.literal("aside"), z.literal("audio"), z.literal("chat"), z.literal("gallery"), z.literal("image"), z.literal("link"), z.literal("quote"), z.literal("standard"), z.literal("status"), z.literal("video"), expressionSchema]).optional(), sticky: booleanOrExpression.optional(), categories: z.array(z.string()).optional(), tags: z.array(z.string()).optional(), postTemplate: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_post/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_post/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("post").default("post"),
          operation: z.literal("get"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          postId: stringOrExpression.optional(),
          options: z.object({ password: stringOrExpression.optional(), context: z.union([z.literal("view"), z.literal("embed"), z.literal("edit"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_post/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_post/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("post").default("post"),
          operation: z.literal("getAll"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ after: stringOrExpression.optional(), author: z.array(z.string()).optional(), before: stringOrExpression.optional(), categories: z.array(z.string()).optional(), context: z.union([z.literal("view"), z.literal("embed"), z.literal("edit"), expressionSchema]).optional(), excludedCategories: z.array(z.string()).optional(), excludedTags: z.array(z.string()).optional(), order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), orderBy: z.union([z.literal("author"), z.literal("date"), z.literal("id"), z.literal("include"), z.literal("include_slugs"), z.literal("modified"), z.literal("parent"), z.literal("relevance"), z.literal("slug"), z.literal("title"), expressionSchema]).optional(), search: stringOrExpression.optional(), status: z.union([z.literal("draft"), z.literal("future"), z.literal("pending"), z.literal("private"), z.literal("publish"), expressionSchema]).optional(), sticky: booleanOrExpression.optional(), tags: z.array(z.string()).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_post/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_post/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("post").default("post"),
          operation: z.literal("update"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          postId: stringOrExpression.optional(),
          updateFields: z.object({ authorId: stringOrExpression.optional(), title: stringOrExpression.optional(), content: stringOrExpression.optional(), slug: stringOrExpression.optional(), password: stringOrExpression.optional(), status: z.union([z.literal("draft"), z.literal("future"), z.literal("pending"), z.literal("private"), z.literal("publish"), expressionSchema]).optional(), date: stringOrExpression.optional(), commentStatus: z.union([z.literal("open"), z.literal("closed"), expressionSchema]).optional(), pingStatus: z.union([z.literal("open"), z.literal("closed"), expressionSchema]).optional(), format: z.union([z.literal("aside"), z.literal("audio"), z.literal("chat"), z.literal("gallery"), z.literal("image"), z.literal("link"), z.literal("quote"), z.literal("standard"), z.literal("status"), z.literal("video"), expressionSchema]).optional(), sticky: booleanOrExpression.optional(), categories: z.array(z.string()).optional(), tags: z.array(z.string()).optional(), postTemplate: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_post/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_post/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_page/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_page/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("page"),
          operation: z.literal("create").default("create"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          title: stringOrExpression.optional(),
          additionalFields: z.object({ authorId: stringOrExpression.optional(), parent: numberOrExpression.optional(), content: stringOrExpression.optional(), slug: stringOrExpression.optional(), password: stringOrExpression.optional(), status: z.union([z.literal("draft"), z.literal("future"), z.literal("pending"), z.literal("private"), z.literal("publish"), expressionSchema]).optional(), commentStatus: z.union([z.literal("open"), z.literal("closed"), expressionSchema]).optional(), pingStatus: z.union([z.literal("open"), z.literal("closed"), expressionSchema]).optional(), pageTemplate: z.unknown().optional(), menuOrder: numberOrExpression.optional(), featuredMediaId: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_page/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_page/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("page"),
          operation: z.literal("get"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          pageId: stringOrExpression.optional(),
          options: z.object({ password: stringOrExpression.optional(), context: z.union([z.literal("view"), z.literal("embed"), z.literal("edit"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_page/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_page/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("page"),
          operation: z.literal("getAll"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ after: stringOrExpression.optional(), author: z.array(z.string()).optional(), before: stringOrExpression.optional(), context: z.union([z.literal("view"), z.literal("embed"), z.literal("edit"), expressionSchema]).optional(), menuOrder: numberOrExpression.optional(), order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), orderBy: z.union([z.literal("author"), z.literal("date"), z.literal("id"), z.literal("include"), z.literal("include_slugs"), z.literal("modified"), z.literal("parent"), z.literal("relevance"), z.literal("slug"), z.literal("title"), expressionSchema]).optional(), page: numberOrExpression.optional(), parent: numberOrExpression.optional(), search: stringOrExpression.optional(), status: z.union([z.literal("draft"), z.literal("future"), z.literal("pending"), z.literal("private"), z.literal("publish"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_page/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_page/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("page"),
          operation: z.literal("update"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          pageId: stringOrExpression.optional(),
          updateFields: z.object({ authorId: stringOrExpression.optional(), parent: numberOrExpression.optional(), title: stringOrExpression.optional(), content: stringOrExpression.optional(), slug: stringOrExpression.optional(), password: stringOrExpression.optional(), status: z.union([z.literal("draft"), z.literal("future"), z.literal("pending"), z.literal("private"), z.literal("publish"), expressionSchema]).optional(), commentStatus: z.union([z.literal("open"), z.literal("closed"), expressionSchema]).optional(), pingStatus: z.union([z.literal("open"), z.literal("closed"), expressionSchema]).optional(), pageTemplate: z.unknown().optional(), menuOrder: numberOrExpression.optional(), commentStatus: z.union([z.literal("open"), z.literal("closed"), expressionSchema]).optional(), featuredMediaId: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_page/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_page/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getUpdateSchema = require_operation_update_schema2();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_user/operation_create.schema.js
var require_operation_create_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_user/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("create").default("create"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          username: stringOrExpression.optional(),
          name: stringOrExpression.optional(),
          firstName: stringOrExpression.optional(),
          lastName: stringOrExpression.optional(),
          email: stringOrExpression.optional(),
          password: stringOrExpression.optional(),
          additionalFields: z.object({ url: stringOrExpression.optional(), description: stringOrExpression.optional(), nickname: stringOrExpression.optional(), slug: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_user/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_user/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("get"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          userId: stringOrExpression.optional(),
          options: z.object({ context: z.union([z.literal("view"), z.literal("embed"), z.literal("edit"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_user/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_user/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("getAll"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ context: z.union([z.literal("view"), z.literal("embed"), z.literal("edit"), expressionSchema]).optional(), orderBy: z.union([z.literal("email"), z.literal("id"), z.literal("include"), z.literal("include_slugs"), z.literal("name"), z.literal("registered_date"), z.literal("slug"), z.literal("url"), expressionSchema]).optional(), order: z.union([z.literal("asc"), z.literal("desc"), expressionSchema]).optional(), search: stringOrExpression.optional(), who: z.union([z.literal("authors"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_user/operation_update.schema.js
var require_operation_update_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_user/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user"),
          operation: z.literal("update"),
          authType: z.union([z.literal("basicAuth"), z.literal("oAuth2"), expressionSchema]).optional(),
          userId: stringOrExpression.optional(),
          updateFields: z.object({ username: stringOrExpression.optional(), name: stringOrExpression.optional(), firstName: stringOrExpression.optional(), lastName: stringOrExpression.optional(), email: stringOrExpression.optional(), password: stringOrExpression.optional(), url: stringOrExpression.optional(), description: stringOrExpression.optional(), nickname: stringOrExpression.optional(), slug: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_user/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/resource_user/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema3();
    var getGetSchema = require_operation_get_schema3();
    var getGetAllSchema = require_operation_get_all_schema3();
    var getUpdateSchema = require_operation_update_schema3();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/wordpress/v1/index.schema.js
var getPostSchema = require_index_schema();
var getPageSchema = require_index_schema2();
var getUserSchema = require_index_schema3();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "post" } : parameters;
  return z.union([
    getPostSchema({ ...helpers, parameters: effectiveParams }),
    getPageSchema({ ...helpers, parameters: effectiveParams }),
    getUserSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
