var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("group"),
          operation: z.literal("create"),
          groupType: z.union([z.literal("Unified"), z.literal(""), expressionSchema]).optional(),
          displayName: stringOrExpression.optional(),
          mailNickname: stringOrExpression.optional(),
          mailEnabled: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "groupType": ["Unified"] } }, defaults: { "groupType": "" } }),
          membershipType: z.union([z.literal(""), z.literal("DynamicMembership"), expressionSchema]).optional(),
          securityEnabled: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "groupType": ["Unified"] } }, defaults: { "groupType": "" } }),
          additionalFields: z.object({ isAssignableToRole: booleanOrExpression.optional(), description: stringOrExpression.optional(), membershipRule: stringOrExpression.optional(), membershipRuleProcessingState: z.union([z.literal("On"), z.literal("Paused"), expressionSchema]).optional(), preferredDataLocation: stringOrExpression.optional(), uniqueName: stringOrExpression.optional(), visibility: z.union([z.literal("Private"), z.literal("Public"), expressionSchema]).optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("group"),
          operation: z.literal("delete"),
          group: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("group"),
          operation: z.literal("get"),
          group: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          output: z.union([z.literal("simple"), z.literal("raw"), z.literal("fields"), expressionSchema]).optional(),
          fields: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "show": { "output": ["fields"] } }, defaults: { "output": "simple" } }),
          options: z.object({ includeMembers: booleanOrExpression.optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("group"),
          operation: z.literal("getAll").default("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filter: stringOrExpression.optional(),
          output: z.union([z.literal("simple"), z.literal("raw"), z.literal("fields"), expressionSchema]).optional(),
          fields: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "show": { "output": ["fields"] } }, defaults: { "output": "simple" } }),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("group"),
          operation: z.literal("update"),
          group: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          updateFields: z.object({ allowExternalSenders: booleanOrExpression.optional(), autoSubscribeNewMembers: booleanOrExpression.optional(), description: stringOrExpression.optional(), displayName: stringOrExpression.optional(), mailNickname: stringOrExpression.optional(), membershipRule: stringOrExpression.optional(), membershipRuleProcessingState: z.union([z.literal("On"), z.literal("Paused"), expressionSchema]).optional(), preferredDataLocation: stringOrExpression.optional(), securityEnabled: booleanOrExpression.optional(), uniqueName: stringOrExpression.optional(), visibility: z.union([z.literal("Private"), z.literal("Public"), expressionSchema]).optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_group/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getAll" } : parameters;
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_add_group.schema.js
var require_operation_add_group_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_add_group.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user").default("user"),
          operation: z.literal("addGroup"),
          group: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          user: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user").default("user"),
          operation: z.literal("create"),
          accountEnabled: booleanOrExpression.optional(),
          displayName: stringOrExpression.optional(),
          userPrincipalName: stringOrExpression.optional(),
          mailNickname: stringOrExpression.optional(),
          password: stringOrExpression.optional(),
          additionalFields: z.object({ aboutMe: stringOrExpression.optional(), ageGroup: z.union([z.literal("Adult"), z.literal("Minor"), z.literal("NotAdult"), expressionSchema]).optional(), birthday: stringOrExpression.optional(), businessPhones: stringOrExpression.optional(), city: stringOrExpression.optional(), companyName: stringOrExpression.optional(), consentProvidedForMinor: z.union([z.literal("Denied"), z.literal("Granted"), z.literal("NotRequired"), expressionSchema]).optional(), country: stringOrExpression.optional(), department: stringOrExpression.optional(), employeeId: stringOrExpression.optional(), employeeType: stringOrExpression.optional(), employeeHireDate: stringOrExpression.optional(), employeeLeaveDateTime: stringOrExpression.optional(), employeeOrgData: z.unknown().optional(), givenName: stringOrExpression.optional(), forceChangePassword: z.union([z.literal("forceChangePasswordNextSignIn"), z.literal("forceChangePasswordNextSignInWithMfa"), expressionSchema]).optional(), interests: stringOrExpression.optional(), jobTitle: stringOrExpression.optional(), surname: stringOrExpression.optional(), mail: stringOrExpression.optional(), mobilePhone: stringOrExpression.optional(), mySite: stringOrExpression.optional(), officeLocation: stringOrExpression.optional(), onPremisesImmutableId: stringOrExpression.optional(), otherMails: stringOrExpression.optional(), passwordPolicies: z.array(z.union([z.literal("DisablePasswordExpiration"), z.literal("DisableStrongPassword")])).optional(), pastProjects: stringOrExpression.optional(), postalCode: stringOrExpression.optional(), preferredLanguage: stringOrExpression.optional(), responsibilities: stringOrExpression.optional(), schools: stringOrExpression.optional(), skills: stringOrExpression.optional(), state: stringOrExpression.optional(), streetAddress: stringOrExpression.optional(), usageLocation: stringOrExpression.optional(), userType: z.union([z.literal("Guest"), z.literal("Member"), expressionSchema]).optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user").default("user"),
          operation: z.literal("delete"),
          user: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user").default("user"),
          operation: z.literal("get"),
          user: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          output: z.union([z.literal("simple"), z.literal("raw"), z.literal("fields"), expressionSchema]).optional(),
          fields: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "show": { "output": ["fields"] } }, defaults: { "output": "simple" } }),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user").default("user"),
          operation: z.literal("getAll").default("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filter: stringOrExpression.optional(),
          output: z.union([z.literal("simple"), z.literal("raw"), z.literal("fields"), expressionSchema]).optional(),
          fields: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "show": { "output": ["fields"] } }, defaults: { "output": "simple" } }),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_remove_group.schema.js
var require_operation_remove_group_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_remove_group.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user").default("user"),
          operation: z.literal("removeGroup"),
          group: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          user: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("user").default("user"),
          operation: z.literal("update"),
          user: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          updateFields: z.object({ aboutMe: stringOrExpression.optional(), accountEnabled: booleanOrExpression.optional(), ageGroup: z.union([z.literal("Adult"), z.literal("Minor"), z.literal("NotAdult"), expressionSchema]).optional(), birthday: stringOrExpression.optional(), businessPhones: stringOrExpression.optional(), city: stringOrExpression.optional(), companyName: stringOrExpression.optional(), consentProvidedForMinor: z.union([z.literal("Denied"), z.literal("Granted"), z.literal("NotRequired"), expressionSchema]).optional(), country: stringOrExpression.optional(), department: stringOrExpression.optional(), displayName: stringOrExpression.optional(), employeeId: stringOrExpression.optional(), employeeType: stringOrExpression.optional(), givenName: stringOrExpression.optional(), employeeHireDate: stringOrExpression.optional(), employeeLeaveDateTime: stringOrExpression.optional(), employeeOrgData: z.unknown().optional(), forceChangePassword: z.union([z.literal("forceChangePasswordNextSignIn"), z.literal("forceChangePasswordNextSignInWithMfa"), expressionSchema]).optional(), interests: stringOrExpression.optional(), jobTitle: stringOrExpression.optional(), surname: stringOrExpression.optional(), mail: stringOrExpression.optional(), mailNickname: stringOrExpression.optional(), mobilePhone: stringOrExpression.optional(), mySite: stringOrExpression.optional(), officeLocation: stringOrExpression.optional(), onPremisesImmutableId: stringOrExpression.optional(), otherMails: stringOrExpression.optional(), password: stringOrExpression.optional(), passwordPolicies: z.array(z.union([z.literal("DisablePasswordExpiration"), z.literal("DisableStrongPassword")])).optional(), pastProjects: stringOrExpression.optional(), postalCode: stringOrExpression.optional(), preferredLanguage: stringOrExpression.optional(), responsibilities: stringOrExpression.optional(), schools: stringOrExpression.optional(), skills: stringOrExpression.optional(), state: stringOrExpression.optional(), streetAddress: stringOrExpression.optional(), usageLocation: stringOrExpression.optional(), userPrincipalName: stringOrExpression.optional(), userType: z.union([z.literal("Guest"), z.literal("Member"), expressionSchema]).optional() }).optional(),
          requestOptions: z.object({ batching: z.unknown().optional(), allowUnauthorizedCerts: z.boolean().optional(), proxy: stringOrExpression.optional(), timeout: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/resource_user/index.schema.js"(exports2, module2) {
    var getAddGroupSchema = require_operation_add_group_schema();
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getRemoveGroupSchema = require_operation_remove_group_schema();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "getAll" } : parameters;
      return z.union([
        getAddGroupSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getRemoveGroupSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/microsoftEntra/v1/index.schema.js
var getGroupSchema = require_index_schema();
var getUserSchema = require_index_schema2();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "user" } : parameters;
  return z.union([
    getGroupSchema({ ...helpers, parameters: effectiveParams }),
    getUserSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
