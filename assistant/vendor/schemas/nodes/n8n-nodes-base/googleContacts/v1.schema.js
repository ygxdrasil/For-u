var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("create").default("create"),
          familyName: stringOrExpression.optional(),
          givenName: stringOrExpression.optional(),
          additionalFields: z.object({ addressesUi: z.unknown().optional(), birthday: stringOrExpression.optional(), companyUi: z.unknown().optional(), customFieldsUi: z.unknown().optional(), emailsUi: z.unknown().optional(), eventsUi: z.unknown().optional(), fileAs: stringOrExpression.optional(), group: z.array(z.string()).optional(), honorificPrefix: stringOrExpression.optional(), honorificSuffix: stringOrExpression.optional(), middleName: stringOrExpression.optional(), biographies: stringOrExpression.optional(), phoneUi: z.unknown().optional(), relationsUi: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("delete"),
          contactId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("get"),
          contactId: stringOrExpression.optional(),
          fields: z.array(z.union([z.literal("*"), z.literal("addresses"), z.literal("biographies"), z.literal("birthdays"), z.literal("coverPhotos"), z.literal("emailAddresses"), z.literal("events"), z.literal("genders"), z.literal("imClients"), z.literal("interests"), z.literal("locales"), z.literal("memberships"), z.literal("metadata"), z.literal("names"), z.literal("nicknames"), z.literal("occupations"), z.literal("organizations"), z.literal("phoneNumbers"), z.literal("photos"), z.literal("relations"), z.literal("residences"), z.literal("sipAddresses"), z.literal("skills"), z.literal("urls"), z.literal("userDefined")])).optional(),
          rawData: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          fields: z.array(z.union([z.literal("*"), z.literal("addresses"), z.literal("biographies"), z.literal("birthdays"), z.literal("coverPhotos"), z.literal("emailAddresses"), z.literal("events"), z.literal("genders"), z.literal("imClients"), z.literal("interests"), z.literal("locales"), z.literal("memberships"), z.literal("metadata"), z.literal("names"), z.literal("nicknames"), z.literal("occupations"), z.literal("organizations"), z.literal("phoneNumbers"), z.literal("photos"), z.literal("relations"), z.literal("residences"), z.literal("sipAddresses"), z.literal("skills"), z.literal("urls"), z.literal("userDefined")])).optional(),
          useQuery: booleanOrExpression.optional(),
          query: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "useQuery": [true] } }, defaults: { "useQuery": false } }),
          rawData: booleanOrExpression.optional(),
          options: resolveSchema({ parameters, schema: z.object({ sortOrder: z.union([z.literal("LAST_MODIFIED_ASCENDING"), z.literal("LAST_MODIFIED_DESCENDING"), z.literal("FIRST_NAME_ASCENDING"), z.literal("LAST_NAME_ASCENDING"), expressionSchema]).optional() }), required: false, displayOptions: { "show": { "useQuery": [false] } }, defaults: { "useQuery": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("update"),
          contactId: stringOrExpression.optional(),
          fields: z.array(z.union([z.literal("*"), z.literal("addresses"), z.literal("biographies"), z.literal("birthdays"), z.literal("coverPhotos"), z.literal("emailAddresses"), z.literal("events"), z.literal("genders"), z.literal("imClients"), z.literal("interests"), z.literal("locales"), z.literal("memberships"), z.literal("metadata"), z.literal("names"), z.literal("nicknames"), z.literal("occupations"), z.literal("organizations"), z.literal("phoneNumbers"), z.literal("photos"), z.literal("relations"), z.literal("residences"), z.literal("sipAddresses"), z.literal("skills"), z.literal("urls"), z.literal("userDefined")])).optional(),
          updateFields: z.object({ etag: stringOrExpression.optional(), familyName: stringOrExpression.optional(), givenName: stringOrExpression.optional(), addressesUi: z.unknown().optional(), birthday: stringOrExpression.optional(), companyUi: z.unknown().optional(), customFieldsUi: z.unknown().optional(), emailsUi: z.unknown().optional(), eventsUi: z.unknown().optional(), fileAs: stringOrExpression.optional(), group: z.array(z.string()).optional(), honorificPrefix: stringOrExpression.optional(), honorificSuffix: stringOrExpression.optional(), middleName: stringOrExpression.optional(), biographies: stringOrExpression.optional(), phoneUi: z.unknown().optional(), relationsUi: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/resource_contact/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleContacts/v1/index.schema.js
var getContactSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "contact" } : parameters;
  return getContactSchema({ ...helpers, parameters: effectiveParams });
};
