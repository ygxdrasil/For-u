var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_copy.schema.js
var require_operation_copy_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_copy.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file").default("file"),
          operation: z.literal("copy"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          fileId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          name: stringOrExpression.optional(),
          sameFolder: booleanOrExpression.optional(),
          driveId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "sameFolder": [false] } }, defaults: { "sameFolder": true } }),
          folderId: resolveSchema({ parameters, schema: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]), required: false, displayOptions: { "show": { "sameFolder": [false] } }, defaults: { "sameFolder": true } }),
          options: z.object({ copyRequiresWriterPermission: booleanOrExpression.optional(), description: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_create_from_text.schema.js
var require_operation_create_from_text_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_create_from_text.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file").default("file"),
          operation: z.literal("createFromText"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          content: stringOrExpression.optional(),
          name: stringOrExpression.optional(),
          driveId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          folderId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          options: z.object({ appPropertiesUi: z.unknown().optional(), propertiesUi: z.unknown().optional(), keepRevisionForever: booleanOrExpression.optional(), ocrLanguage: stringOrExpression.optional(), useContentAsIndexableText: booleanOrExpression.optional(), convertToGoogleDocument: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_delete_file.schema.js
var require_operation_delete_file_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_delete_file.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file").default("file"),
          operation: z.literal("deleteFile"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          fileId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          options: z.object({ deletePermanently: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_download.schema.js
var require_operation_download_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_download.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file").default("file"),
          operation: z.literal("download"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          fileId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          options: z.object({ binaryPropertyName: stringOrExpression.optional(), googleFileConversion: z.unknown().optional(), fileName: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_move.schema.js
var require_operation_move_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_move.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file").default("file"),
          operation: z.literal("move"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          fileId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          driveId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          folderId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_share.schema.js
var require_operation_share_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_share.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file").default("file"),
          operation: z.literal("share"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          fileId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          permissionsUi: z.object({ permissionsValues: z.object({ role: z.union([z.literal("commenter"), z.literal("fileOrganizer"), z.literal("organizer"), z.literal("owner"), z.literal("reader"), z.literal("writer"), expressionSchema]).optional(), type: z.union([z.literal("user"), z.literal("group"), z.literal("domain"), z.literal("anyone"), expressionSchema]).optional(), emailAddress: stringOrExpression.optional(), domain: stringOrExpression.optional(), allowFileDiscovery: booleanOrExpression.optional() }).optional() }).optional(),
          options: z.object({ emailMessage: stringOrExpression.optional(), moveToNewOwnersRoot: booleanOrExpression.optional(), sendNotificationEmail: booleanOrExpression.optional(), transferOwnership: booleanOrExpression.optional(), useDomainAdminAccess: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file").default("file"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          fileId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          changeFileContent: booleanOrExpression.optional(),
          inputDataFieldName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "changeFileContent": [true] } }, defaults: { "changeFileContent": false } }),
          newUpdatedFileName: stringOrExpression.optional(),
          options: z.object({ appPropertiesUi: z.unknown().optional(), propertiesUi: z.unknown().optional(), keepRevisionForever: booleanOrExpression.optional(), ocrLanguage: stringOrExpression.optional(), useContentAsIndexableText: booleanOrExpression.optional(), trashed: booleanOrExpression.optional(), fields: z.array(z.union([z.literal("*"), z.literal("explicitlyTrashed"), z.literal("exportLinks"), z.literal("hasThumbnail"), z.literal("iconLink"), z.literal("id"), z.literal("kind"), z.literal("mimeType"), z.literal("name"), z.literal("permissions"), z.literal("shared"), z.literal("spaces"), z.literal("starred"), z.literal("thumbnailLink"), z.literal("trashed"), z.literal("version"), z.literal("webViewLink")])).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_upload.schema.js
var require_operation_upload_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/operation_upload.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file").default("file"),
          operation: z.literal("upload"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          inputDataFieldName: stringOrExpression.optional(),
          name: stringOrExpression.optional(),
          driveId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          folderId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          options: z.object({ appPropertiesUi: z.unknown().optional(), propertiesUi: z.unknown().optional(), keepRevisionForever: booleanOrExpression.optional(), ocrLanguage: stringOrExpression.optional(), useContentAsIndexableText: booleanOrExpression.optional(), simplifyOutput: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file/index.schema.js"(exports2, module2) {
    var getCopySchema = require_operation_copy_schema();
    var getCreateFromTextSchema = require_operation_create_from_text_schema();
    var getDeleteFileSchema = require_operation_delete_file_schema();
    var getDownloadSchema = require_operation_download_schema();
    var getMoveSchema = require_operation_move_schema();
    var getShareSchema = require_operation_share_schema();
    var getUpdateSchema = require_operation_update_schema();
    var getUploadSchema = require_operation_upload_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCopySchema({ ...helpers, parameters: effectiveParams }),
        getCreateFromTextSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteFileSchema({ ...helpers, parameters: effectiveParams }),
        getDownloadSchema({ ...helpers, parameters: effectiveParams }),
        getMoveSchema({ ...helpers, parameters: effectiveParams }),
        getShareSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUploadSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file_folder/operation_search.schema.js
var require_operation_search_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file_folder/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("fileFolder"),
          operation: z.literal("search"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          searchMethod: z.union([z.literal("name"), z.literal("query"), expressionSchema]).optional(),
          queryString: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "searchMethod": ["name", "query"] } }, defaults: { "searchMethod": "name" } }),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filter: z.object({ driveId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(), folderId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(), whatToSearch: z.union([z.literal("all"), z.literal("files"), z.literal("folders"), expressionSchema]).optional(), fileTypes: z.array(z.union([z.literal("*"), z.literal("application/vnd.google-apps.drive-sdk"), z.literal("application/vnd.google-apps.audio"), z.literal("application/vnd.google-apps.folder"), z.literal("application/vnd.google-apps.script"), z.literal("application/vnd.google-apps.document"), z.literal("application/vnd.google-apps.drawing"), z.literal("application/vnd.google-apps.form"), z.literal("application/vnd.google-apps.fusiontable"), z.literal("application/vnd.google-apps.map"), z.literal("application/vnd.google-apps.spreadsheet"), z.literal("application/vnd.google-apps.sites"), z.literal("application/vnd.google-apps.presentation"), z.literal("application/vnd.google-apps.photo"), z.literal("application/vnd.google-apps.unknown"), z.literal("application/vnd.google-apps.video")])).optional(), fileTypes: z.array(z.union([z.literal("*"), z.literal("application/vnd.google-apps.drive-sdk"), z.literal("application/vnd.google-apps.audio"), z.literal("application/vnd.google-apps.script"), z.literal("application/vnd.google-apps.document"), z.literal("application/vnd.google-apps.drawing"), z.literal("application/vnd.google-apps.form"), z.literal("application/vnd.google-apps.fusiontable"), z.literal("application/vnd.google-apps.map"), z.literal("application/vnd.google-apps.spreadsheet"), z.literal("application/vnd.google-apps.sites"), z.literal("application/vnd.google-apps.presentation"), z.literal("application/vnd.google-apps.photo"), z.literal("application/vnd.google-apps.unknown"), z.literal("application/vnd.google-apps.video")])).optional(), includeTrashed: booleanOrExpression.optional() }).optional(),
          options: z.object({ fields: z.array(z.union([z.literal("*"), z.literal("explicitlyTrashed"), z.literal("exportLinks"), z.literal("hasThumbnail"), z.literal("iconLink"), z.literal("id"), z.literal("kind"), z.literal("mimeType"), z.literal("name"), z.literal("permissions"), z.literal("shared"), z.literal("spaces"), z.literal("starred"), z.literal("thumbnailLink"), z.literal("trashed"), z.literal("version"), z.literal("webViewLink")])).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file_folder/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_file_folder/index.schema.js"(exports2, module2) {
    var getSearchSchema = require_operation_search_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getSearchSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_folder/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_folder/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("folder"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          name: stringOrExpression.optional(),
          driveId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          folderId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          options: z.object({ simplifyOutput: booleanOrExpression.optional(), folderColorRgb: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_folder/operation_delete_folder.schema.js
var require_operation_delete_folder_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_folder/operation_delete_folder.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("folder"),
          operation: z.literal("deleteFolder"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          folderNoRootId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          options: z.object({ deletePermanently: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_folder/operation_share.schema.js
var require_operation_share_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_folder/operation_share.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("folder"),
          operation: z.literal("share"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          folderNoRootId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          permissionsUi: z.object({ permissionsValues: z.object({ role: z.union([z.literal("commenter"), z.literal("fileOrganizer"), z.literal("organizer"), z.literal("owner"), z.literal("reader"), z.literal("writer"), expressionSchema]).optional(), type: z.union([z.literal("user"), z.literal("group"), z.literal("domain"), z.literal("anyone"), expressionSchema]).optional(), emailAddress: stringOrExpression.optional(), domain: stringOrExpression.optional(), allowFileDiscovery: booleanOrExpression.optional() }).optional() }).optional(),
          options: z.object({ emailMessage: stringOrExpression.optional(), moveToNewOwnersRoot: booleanOrExpression.optional(), sendNotificationEmail: booleanOrExpression.optional(), transferOwnership: booleanOrExpression.optional(), useDomainAdminAccess: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_folder/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_folder/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteFolderSchema = require_operation_delete_folder_schema();
    var getShareSchema = require_operation_share_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteFolderSchema({ ...helpers, parameters: effectiveParams }),
        getShareSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("drive"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          name: stringOrExpression.optional(),
          options: z.object({ capabilities: z.unknown().optional(), colorRgb: stringOrExpression.optional(), hidden: booleanOrExpression.optional(), restrictions: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/operation_delete_drive.schema.js
var require_operation_delete_drive_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/operation_delete_drive.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("drive"),
          operation: z.literal("deleteDrive"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          driveId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("drive"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          driveId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          options: z.object({ useDomainAdminAccess: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/operation_list.schema.js
var require_operation_list_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/operation_list.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("drive"),
          operation: z.literal("list"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ q: stringOrExpression.optional(), useDomainAdminAccess: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("drive"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          driveId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          options: z.object({ colorRgb: stringOrExpression.optional(), name: stringOrExpression.optional(), restrictions: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/resource_drive/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteDriveSchema = require_operation_delete_drive_schema();
    var getGetSchema = require_operation_get_schema();
    var getListSchema = require_operation_list_schema();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteDriveSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getListSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDrive/v3/index.schema.js
var getFileSchema = require_index_schema();
var getFileFolderSchema = require_index_schema2();
var getFolderSchema = require_index_schema3();
var getDriveSchema = require_index_schema4();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "file" } : parameters;
  return z.union([
    getFileSchema({ ...helpers, parameters: effectiveParams }),
    getFileFolderSchema({ ...helpers, parameters: effectiveParams }),
    getFolderSchema({ ...helpers, parameters: effectiveParams }),
    getDriveSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
