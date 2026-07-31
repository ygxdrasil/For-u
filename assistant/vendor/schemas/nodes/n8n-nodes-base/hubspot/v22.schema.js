var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ aboutUs: stringOrExpression.optional(), annualRevenue: numberOrExpression.optional(), city: stringOrExpression.optional(), closeDate: stringOrExpression.optional(), companyDomainName: stringOrExpression.optional(), companyOwner: stringOrExpression.optional(), countryRegion: stringOrExpression.optional(), customPropertiesUi: z.unknown().optional(), description: stringOrExpression.optional(), facebookFans: numberOrExpression.optional(), googlePlusPage: stringOrExpression.optional(), industry: stringOrExpression.optional(), isPublic: booleanOrExpression.optional(), leadStatus: stringOrExpression.optional(), lifecycleStatus: stringOrExpression.optional(), linkedinBio: stringOrExpression.optional(), linkedInCompanyPage: stringOrExpression.optional(), numberOfEmployees: numberOrExpression.optional(), originalSourceType: stringOrExpression.optional(), phoneNumber: stringOrExpression.optional(), postalCode: stringOrExpression.optional(), stateRegion: stringOrExpression.optional(), streetAddress: stringOrExpression.optional(), streetAddress2: stringOrExpression.optional(), targetAccount: stringOrExpression.optional(), timezone: stringOrExpression.optional(), totalMoneyRaised: numberOrExpression.optional(), twitterBio: stringOrExpression.optional(), twitterFollowers: numberOrExpression.optional(), twitterHandle: stringOrExpression.optional(), type: stringOrExpression.optional(), webTechnologies: stringOrExpression.optional(), websiteUrl: stringOrExpression.optional(), yearFounded: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          companyId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          companyId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          additionalFields: z.object({ includeMergeAudits: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ includeMergeAudits: booleanOrExpression.optional(), propertiesCollection: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_get_recently_created_updated.schema.js
var require_operation_get_recently_created_updated_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_get_recently_created_updated.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("getRecentlyCreatedUpdated"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          additionalFields: z.object({ since: stringOrExpression.optional(), propertiesCollection: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_search_by_domain.schema.js
var require_operation_search_by_domain_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_search_by_domain.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("searchByDomain"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          domain: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          options: z.object({ properties: z.array(z.string()).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("company"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          companyId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          updateFields: z.object({ aboutUs: stringOrExpression.optional(), annualRevenue: numberOrExpression.optional(), city: stringOrExpression.optional(), closeDate: stringOrExpression.optional(), companyDomainName: stringOrExpression.optional(), companyOwner: stringOrExpression.optional(), countryRegion: stringOrExpression.optional(), customPropertiesUi: z.unknown().optional(), description: stringOrExpression.optional(), facebookFans: numberOrExpression.optional(), googlePlusPage: stringOrExpression.optional(), industry: stringOrExpression.optional(), isPublic: booleanOrExpression.optional(), leadStatus: stringOrExpression.optional(), lifecycleStatus: stringOrExpression.optional(), linkedinBio: stringOrExpression.optional(), linkedInCompanyPage: stringOrExpression.optional(), name: stringOrExpression.optional(), numberOfEmployees: numberOrExpression.optional(), originalSourceType: stringOrExpression.optional(), phoneNumber: stringOrExpression.optional(), postalCode: stringOrExpression.optional(), stateRegion: stringOrExpression.optional(), streetAddress: stringOrExpression.optional(), streetAddress2: stringOrExpression.optional(), targetAccount: stringOrExpression.optional(), timezone: stringOrExpression.optional(), totalMoneyRaised: numberOrExpression.optional(), twitterBio: stringOrExpression.optional(), twitterFollowers: numberOrExpression.optional(), twitterHandle: stringOrExpression.optional(), type: stringOrExpression.optional(), webTechnologies: stringOrExpression.optional(), websiteUrl: stringOrExpression.optional(), yearFounded: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_company/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema();
    var getGetAllSchema = require_operation_get_all_schema();
    var getGetRecentlyCreatedUpdatedSchema = require_operation_get_recently_created_updated_schema();
    var getSearchByDomainSchema = require_operation_search_by_domain_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "upsert" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetRecentlyCreatedUpdatedSchema({ ...helpers, parameters: effectiveParams }),
        getSearchByDomainSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          contactId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          additionalFields: z.object({ formSubmissionMode: z.union([z.literal("all"), z.literal("none"), z.literal("newest"), z.literal("oldest"), expressionSchema]).optional(), listMemberships: booleanOrExpression.optional(), propertiesCollection: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          additionalFields: z.object({ formSubmissionMode: z.union([z.literal("all"), z.literal("none"), z.literal("newest"), z.literal("oldest"), expressionSchema]).optional(), listMemberships: booleanOrExpression.optional(), propertiesCollection: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_get_recently_created_updated.schema.js
var require_operation_get_recently_created_updated_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_get_recently_created_updated.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("getRecentlyCreatedUpdated"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          additionalFields: z.object({ formSubmissionMode: z.union([z.literal("all"), z.literal("none"), z.literal("newest"), z.literal("oldest"), expressionSchema]).optional(), listMemberships: booleanOrExpression.optional(), propertiesCollection: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_search.schema.js
var require_operation_search_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("search"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filterGroupsUi: z.object({ filterGroupsValues: z.array(z.object({ filtersUi: z.unknown().optional() })).optional() }).optional(),
          additionalFields: z.object({ direction: z.union([z.literal("ASCENDING"), z.literal("DESCENDING"), expressionSchema]).optional(), properties: z.array(z.string()).optional(), query: stringOrExpression.optional(), sortBy: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_upsert.schema.js
var require_operation_upsert_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/operation_upsert.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact").default("contact"),
          operation: z.literal("upsert").default("upsert"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          email: stringOrExpression.optional(),
          additionalFields: z.object({ annualRevenue: numberOrExpression.optional(), associatedCompanyId: stringOrExpression.optional(), buyingRole: z.array(z.union([z.literal("BLOCKER"), z.literal("BUDGET_HOLDER"), z.literal("CHAMPION"), z.literal("DECISION_MAKER"), z.literal("END_USER"), z.literal("EXECUTIVE_SPONSOR"), z.literal("INFLUENCER"), z.literal("LEGAL_AND_COMPLIANCE"), z.literal("OTHER")])).optional(), city: stringOrExpression.optional(), clickedFacebookAd: stringOrExpression.optional(), closeDate: stringOrExpression.optional(), companyName: stringOrExpression.optional(), companySize: stringOrExpression.optional(), contactOwner: stringOrExpression.optional(), properties: z.array(z.string()).optional(), country: stringOrExpression.optional(), countryRegionCode: stringOrExpression.optional(), customPropertiesUi: z.unknown().optional(), dateOfBirth: stringOrExpression.optional(), degree: stringOrExpression.optional(), emailCustomerQuarantinedReason: z.union([z.literal("SUSPENSION_REMEDIATION"), z.literal("BLOCKLIST_REMEDIATION"), z.literal("TRUST_SAFETY_REMEDIATION"), expressionSchema]).optional(), employmentRole: z.union([z.literal("accounting"), z.literal("administrative"), z.literal("business_development"), z.literal("communications"), z.literal("consulting"), z.literal("customer_service"), z.literal("design"), z.literal("education"), z.literal("engineering"), z.literal("entrepreneurship"), z.literal("finance"), z.literal("health_professional"), z.literal("human_resources"), z.literal("information_technology"), z.literal("legal"), z.literal("marketing"), z.literal("operations"), z.literal("product"), z.literal("project_management"), z.literal("public_relations"), z.literal("quality_assurance"), z.literal("real_estate"), z.literal("recruiting"), z.literal("research"), z.literal("retired"), z.literal("sales"), z.literal("support"), expressionSchema]).optional(), employmentSeniority: z.union([z.literal("director"), z.literal("employee"), z.literal("entry"), z.literal("executive"), z.literal("manager"), z.literal("owner"), z.literal("partner"), z.literal("senior"), z.literal("vp"), expressionSchema]).optional(), employmentSubRole: z.union([z.literal("account_executive"), z.literal("account_manager"), z.literal("accountant"), z.literal("accounting_manager"), z.literal("administrative_assistant"), z.literal("appraisal"), z.literal("architect_it"), z.literal("assistant"), z.literal("attorney"), z.literal("auditor"), z.literal("brand_marketing"), z.literal("business_analyst"), z.literal("business_consultant"), z.literal("business_manager"), z.literal("chief_compliance_officer"), z.literal("chief_data_officer"), z.literal("chief_executive_officer"), z.literal("chief_experience_officer"), z.literal("chief_financial_officer"), z.literal("chief_human_resources_officer"), z.literal("chief_information_officer"), z.literal("chief_innovation_officer"), z.literal("chief_legal_officer"), z.literal("chief_marketing_officer"), z.literal("chief_operating_officer"), z.literal("chief_product_officer"), z.literal("chief_revenue_officer"), z.literal("chief_risk_officer"), z.literal("chief_security_officer"), z.literal("chief_sustainability_officer"), z.literal("chief_technology_officer"), z.literal("communications_manager"), z.literal("community"), z.literal("content_marketing"), z.literal("contracts"), z.literal("creative"), z.literal("customer_service_specialist"), z.literal("customer_success"), z.literal("data_it"), z.literal("data_science_engineer"), z.literal("database_administrator"), z.literal("design_engineer"), z.literal("development_specialist"), z.literal("devops_engineer"), z.literal("digital_marketing"), z.literal("director_of_development"), z.literal("editorial"), z.literal("electrical_engineer"), z.literal("engineering_manager"), z.literal("events"), z.literal("executive_assistant"), z.literal("facilities"), z.literal("fashion_design"), z.literal("field_marketing"), z.literal("financial_analyst"), z.literal("financial_controller"), z.literal("fitness"), z.literal("founder"), z.literal("general_counsel"), z.literal("general_manager"), z.literal("general_partner"), z.literal("graphic_design"), z.literal("human_resources_specialist"), z.literal("information_technology_specialist"), z.literal("investment"), z.literal("investment_banker"), z.literal("journalist"), z.literal("key_account_manager"), z.literal("law_enforcement"), z.literal("lawyer"), z.literal("logistics_manager"), z.literal("management"), z.literal("marketing_specialist"), z.literal("mechanical_engineer"), z.literal("medical_doctor"), z.literal("network_engineer"), z.literal("nurse"), z.literal("office_management"), z.literal("office_manager"), z.literal("operational_specialist"), z.literal("owner"), z.literal("paralegal"), z.literal("principal"), z.literal("product_design"), z.literal("product_manager"), z.literal("product_marketing"), z.literal("production_manager"), z.literal("professor"), z.literal("program_coordinator"), z.literal("program_manager"), z.literal("project_engineer"), z.literal("project_manager"), z.literal("property_manager"), z.literal("qa_engineer"), z.literal("qa_it"), z.literal("quality_assurance_manager"), z.literal("quality_assurance_specialist"), z.literal("realtor"), z.literal("recruiter"), z.literal("relationship_manager"), z.literal("research_analyst"), z.literal("retail"), z.literal("retired"), z.literal("risk_compliance"), z.literal("sales_executive"), z.literal("sales_operations"), z.literal("sales_specialist"), z.literal("salesperson"), z.literal("secretary"), z.literal("social_marketing"), z.literal("software_engineer"), z.literal("strategy"), z.literal("student"), z.literal("support"), z.literal("support_specialist"), z.literal("system_administrator"), z.literal("system_analyst"), z.literal("systems_engineer"), z.literal("talent"), z.literal("tax_audit"), z.literal("teacher"), z.literal("technical_manager"), z.literal("technical_support_specialist"), z.literal("therapist"), z.literal("training"), z.literal("video"), z.literal("web_developer"), z.literal("writer"), expressionSchema]).optional(), enrichedEmailBounceDetected: booleanOrExpression.optional(), facebookClickId: numberOrExpression.optional(), faxNumber: stringOrExpression.optional(), fieldOfStudy: stringOrExpression.optional(), firstName: stringOrExpression.optional(), gender: stringOrExpression.optional(), googleAdClickId: numberOrExpression.optional(), graduationDate: stringOrExpression.optional(), industry: stringOrExpression.optional(), inferredLanguageCodes: z.union([z.literal("ab"), z.literal("aa"), z.literal("af"), z.literal("ak"), z.literal("sq"), z.literal("am"), z.literal("ar"), z.literal("an"), z.literal("hy"), z.literal("as"), z.literal("av"), z.literal("ae"), z.literal("ay"), z.literal("az"), z.literal("bm"), z.literal("ba"), z.literal("eu"), z.literal("be"), z.literal("bn"), z.literal("bi"), z.literal("nb"), z.literal("bs"), z.literal("br"), z.literal("bg"), z.literal("my"), z.literal("ca"), z.literal("km"), z.literal("ch"), z.literal("ce"), z.literal("ny"), z.literal("zh"), z.literal("cu"), z.literal("cv"), z.literal("kw"), z.literal("co"), z.literal("cr"), z.literal("hr"), z.literal("cs"), z.literal("da"), z.literal("dv"), z.literal("nl"), z.literal("dz"), z.literal("en"), z.literal("eo"), z.literal("et"), z.literal("ee"), z.literal("fo"), z.literal("fj"), z.literal("fi"), z.literal("fr"), z.literal("ff"), z.literal("gd"), z.literal("gl"), z.literal("lg"), z.literal("ka"), z.literal("de"), z.literal("el"), z.literal("gn"), z.literal("gu"), z.literal("ht"), z.literal("ha"), z.literal("he"), z.literal("hz"), z.literal("hi"), z.literal("ho"), z.literal("hu"), z.literal("is"), z.literal("io"), z.literal("ig"), z.literal("id"), z.literal("ia"), z.literal("ie"), z.literal("iu"), z.literal("ik"), z.literal("ga"), z.literal("it"), z.literal("ja"), z.literal("jv"), z.literal("kl"), z.literal("kn"), z.literal("kr"), z.literal("ks"), z.literal("kk"), z.literal("ki"), z.literal("rw"), z.literal("ky"), z.literal("kv"), z.literal("kg"), z.literal("ko"), z.literal("kj"), z.literal("ku"), z.literal("lo"), z.literal("la"), z.literal("lv"), z.literal("li"), z.literal("ln"), z.literal("lt"), z.literal("lu"), z.literal("lb"), z.literal("mk"), z.literal("mg"), z.literal("ms"), z.literal("ml"), z.literal("mt"), z.literal("gv"), z.literal("mi"), z.literal("mr"), z.literal("mh"), z.literal("mn"), z.literal("na"), z.literal("nv"), z.literal("nd"), z.literal("nr"), z.literal("ng"), z.literal("ne"), z.literal("se"), z.literal("no"), z.literal("nn"), z.literal("oc"), z.literal("oj"), z.literal("or"), z.literal("om"), z.literal("os"), z.literal("pi"), z.literal("pa"), z.literal("fa"), z.literal("pl"), z.literal("pt"), z.literal("ps"), z.literal("qu"), z.literal("ro"), z.literal("rm"), z.literal("rn"), z.literal("ru"), z.literal("sm"), z.literal("sg"), z.literal("sa"), z.literal("sc"), z.literal("sr"), z.literal("sn"), z.literal("ii"), z.literal("sd"), z.literal("si"), z.literal("sk"), z.literal("sl"), z.literal("so"), z.literal("st"), z.literal("es"), z.literal("su"), z.literal("sw"), z.literal("ss"), z.literal("sv"), z.literal("tl"), z.literal("ty"), z.literal("tg"), z.literal("ta"), z.literal("tt"), z.literal("te"), z.literal("th"), z.literal("bo"), z.literal("ti"), z.literal("to"), z.literal("ts"), z.literal("tn"), z.literal("tr"), z.literal("tk"), z.literal("tw"), z.literal("ug"), z.literal("uk"), z.literal("ur"), z.literal("uz"), z.literal("ve"), z.literal("vi"), z.literal("vo"), z.literal("wa"), z.literal("cy"), z.literal("fy"), z.literal("wo"), z.literal("xh"), z.literal("yi"), z.literal("yo"), z.literal("za"), z.literal("zu"), expressionSchema]).optional(), jobFunction: stringOrExpression.optional(), jobTitle: stringOrExpression.optional(), lastName: stringOrExpression.optional(), latestTrafficSource: z.union([z.literal("DIRECT_TRAFFIC"), z.literal("EMAIL_MARKETING"), z.literal("OFFLINE"), z.literal("ORGANIC_SEARCH"), z.literal("SOCIAL_MEDIA"), z.literal("OTHER_CAMPAIGNS"), z.literal("PAID_SEARCH"), z.literal("PAID_SOCIAL"), z.literal("REFERRALS"), expressionSchema]).optional(), latestTrafficSourceDate: stringOrExpression.optional(), leadStatus: stringOrExpression.optional(), processingContactData: stringOrExpression.optional(), lifeCycleStage: stringOrExpression.optional(), linkedinUrl: stringOrExpression.optional(), maritalStatus: stringOrExpression.optional(), memberEmail: stringOrExpression.optional(), membershipNote: stringOrExpression.optional(), message: stringOrExpression.optional(), militaryStatus: stringOrExpression.optional(), mobilePhoneNumber: stringOrExpression.optional(), numberOfEmployees: stringOrExpression.optional(), originalSource: stringOrExpression.optional(), persona: stringOrExpression.optional(), phoneNumber: stringOrExpression.optional(), postalCode: stringOrExpression.optional(), prefferedLanguage: stringOrExpression.optional(), prospectingAgentLastEnrolled: stringOrExpression.optional(), prospectingAgentTotalEnrolledCount: numberOrExpression.optional(), relationshipStatus: stringOrExpression.optional(), salutation: stringOrExpression.optional(), school: stringOrExpression.optional(), seniority: stringOrExpression.optional(), startDate: stringOrExpression.optional(), stateRegion: stringOrExpression.optional(), stateRegionCode: stringOrExpression.optional(), status: stringOrExpression.optional(), streetAddress: stringOrExpression.optional(), timeZone: z.union([z.literal("atlantic_slash_cape_verde"), z.literal("america_slash_godthab"), z.literal("america_slash_miquelon"), z.literal("america_slash_noronha"), z.literal("atlantic_slash_south_georgia"), z.literal("brazil_slash_denoronha"), z.literal("america_slash_st_johns"), z.literal("canada_slash_newfoundland"), z.literal("america_slash_araguaina"), z.literal("america_slash_argentina_slash_buenos_aires"), z.literal("america_slash_argentina_slash_catamarca"), z.literal("america_slash_argentina_slash_comodrivadavia"), z.literal("america_slash_argentina_slash_cordoba"), z.literal("america_slash_argentina_slash_jujuy"), z.literal("america_slash_argentina_slash_la_rioja"), z.literal("america_slash_argentina_slash_mendoza"), z.literal("america_slash_argentina_slash_rio_gallegos"), z.literal("america_slash_argentina_slash_salta"), z.literal("america_slash_argentina_slash_san_juan"), z.literal("america_slash_argentina_slash_san_luis"), z.literal("america_slash_argentina_slash_tucuman"), z.literal("america_slash_argentina_slash_ushuaia"), z.literal("america_slash_bahia"), z.literal("america_slash_belem"), z.literal("america_slash_buenos_aires"), z.literal("america_slash_catamarca"), z.literal("america_slash_cayenne"), z.literal("america_slash_cordoba"), z.literal("america_slash_fortaleza"), z.literal("america_slash_glace_bay"), z.literal("america_slash_goose_bay"), z.literal("america_slash_halifax"), z.literal("america_slash_jujuy"), z.literal("america_slash_maceio"), z.literal("america_slash_mendoza"), z.literal("america_slash_moncton"), z.literal("america_slash_montevideo"), z.literal("america_slash_paramaribo"), z.literal("america_slash_punta_arenas"), z.literal("america_slash_recife"), z.literal("america_slash_rosario"), z.literal("america_slash_santarem"), z.literal("america_slash_sao_paulo"), z.literal("america_slash_thule"), z.literal("antarctica_slash_palmer"), z.literal("antarctica_slash_rothera"), z.literal("atlantic_slash_bermuda"), z.literal("atlantic_slash_stanley"), z.literal("brazil_slash_east"), z.literal("canada_slash_atlantic"), z.literal("america_slash_anguilla"), z.literal("america_slash_antigua"), z.literal("america_slash_aruba"), z.literal("america_slash_asuncion"), z.literal("america_slash_barbados"), z.literal("america_slash_blanc_hyphen_sablon"), z.literal("america_slash_boa_vista"), z.literal("america_slash_campo_grande"), z.literal("america_slash_caracas"), z.literal("cuba"), z.literal("america_slash_cuiaba"), z.literal("america_slash_curacao"), z.literal("america_slash_detroit"), z.literal("america_slash_dominica"), z.literal("america_slash_fort_wayne"), z.literal("america_slash_grand_turk"), z.literal("america_slash_grenada"), z.literal("america_slash_guadeloupe"), z.literal("america_slash_guyana"), z.literal("america_slash_havana"), z.literal("america_slash_indiana_slash_indianapolis"), z.literal("america_slash_indiana_slash_marengo"), z.literal("america_slash_indiana_slash_petersburg"), z.literal("america_slash_indiana_slash_vevay"), z.literal("america_slash_indiana_slash_vincennes"), z.literal("america_slash_indiana_slash_winamac"), z.literal("america_slash_indianapolis"), z.literal("america_slash_iqaluit"), z.literal("america_slash_kentucky_slash_louisville"), z.literal("america_slash_kentucky_slash_monticello"), z.literal("america_slash_kralendijk"), z.literal("america_slash_la_paz"), z.literal("america_slash_louisville"), z.literal("america_slash_lower_princes"), z.literal("america_slash_manaus"), z.literal("america_slash_marigot"), z.literal("america_slash_martinique"), z.literal("america_slash_montreal"), z.literal("america_slash_montserrat"), z.literal("america_slash_nassau"), z.literal("america_slash_new_york"), z.literal("america_slash_nipigon"), z.literal("america_slash_pangnirtung"), z.literal("america_slash_port_of_spain"), z.literal("america_slash_port_hyphen_au_hyphen_prince"), z.literal("america_slash_porto_velho"), z.literal("america_slash_puerto_rico"), z.literal("america_slash_santiago"), z.literal("america_slash_santo_domingo"), z.literal("america_slash_st_barthelemy"), z.literal("america_slash_st_kitts"), z.literal("america_slash_st_lucia"), z.literal("america_slash_st_thomas"), z.literal("america_slash_st_vincent"), z.literal("america_slash_thunder_bay"), z.literal("america_slash_toronto"), z.literal("america_slash_tortola"), z.literal("america_slash_virgin"), z.literal("brazil_slash_west"), z.literal("canada_slash_eastern"), z.literal("chile_slash_continental"), z.literal("us_slash_east_hyphen_indiana"), z.literal("us_slash_eastern"), z.literal("us_slash_michigan"), z.literal("america_slash_atikokan"), z.literal("america_slash_bahia_banderas"), z.literal("america_slash_bogota"), z.literal("america_slash_cancun"), z.literal("america_slash_cayman"), z.literal("america_slash_chicago"), z.literal("america_slash_coral_harbour"), z.literal("america_slash_eirunepe"), z.literal("america_slash_guayaquil"), z.literal("america_slash_indiana_slash_knox"), z.literal("america_slash_indiana_slash_tell_city"), z.literal("america_slash_jamaica"), z.literal("america_slash_knox_in"), z.literal("america_slash_lima"), z.literal("america_slash_matamoros"), z.literal("america_slash_menominee"), z.literal("america_slash_merida"), z.literal("america_slash_mexico_city"), z.literal("america_slash_monterrey"), z.literal("america_slash_north_dakota_slash_beulah"), z.literal("america_slash_north_dakota_slash_center"), z.literal("america_slash_north_dakota_slash_new_salem"), z.literal("america_slash_panama"), z.literal("america_slash_porto_acre"), z.literal("america_slash_rainy_river"), z.literal("america_slash_rankin_inlet"), z.literal("america_slash_resolute"), z.literal("america_slash_rio_branco"), z.literal("america_slash_winnipeg"), z.literal("brazil_slash_acre"), z.literal("canada_slash_central"), z.literal("mexico_slash_general"), z.literal("us_slash_central"), z.literal("us_slash_indiana_hyphen_starke"), z.literal("america_slash_belize"), z.literal("america_slash_boise"), z.literal("america_slash_cambridge_bay"), z.literal("america_slash_chihuahua"), z.literal("america_slash_costa_rica"), z.literal("america_slash_denver"), z.literal("america_slash_edmonton"), z.literal("america_slash_el_salvador"), z.literal("america_slash_guatemala"), z.literal("america_slash_inuvik"), z.literal("america_slash_managua"), z.literal("america_slash_mazatlan"), z.literal("navajo"), z.literal("america_slash_ojinaga"), z.literal("america_slash_regina"), z.literal("america_slash_shiprock"), z.literal("america_slash_swift_current"), z.literal("america_slash_tegucigalpa"), z.literal("america_slash_yellowknife"), z.literal("canada_slash_mountain"), z.literal("canada_slash_saskatchewan"), z.literal("chile_slash_easterisland"), z.literal("mexico_slash_bajasur"), z.literal("pacific_slash_easter"), z.literal("pacific_slash_galapagos"), z.literal("us_slash_mountain"), z.literal("america_slash_creston"), z.literal("america_slash_dawson"), z.literal("america_slash_dawson_creek"), z.literal("america_slash_ensenada"), z.literal("america_slash_fort_nelson"), z.literal("america_slash_hermosillo"), z.literal("america_slash_los_angeles"), z.literal("america_slash_phoenix"), z.literal("america_slash_santa_isabel"), z.literal("america_slash_tijuana"), z.literal("america_slash_vancouver"), z.literal("america_slash_whitehorse"), z.literal("canada_slash_pacific"), z.literal("canada_slash_yukon"), z.literal("mexico_slash_bajanorte"), z.literal("us_slash_arizona"), z.literal("us_slash_pacific"), z.literal("us_slash_pacific_hyphen_new"), z.literal("america_slash_anchorage"), z.literal("america_slash_juneau"), z.literal("america_slash_metlakatla"), z.literal("america_slash_nome"), z.literal("america_slash_sitka"), z.literal("america_slash_yakutat"), z.literal("pacific_slash_pitcairn"), z.literal("us_slash_alaska"), z.literal("america_slash_adak"), z.literal("america_slash_atka"), z.literal("pacific_slash_gambier"), z.literal("us_slash_aleutian"), z.literal("pacific_slash_marquesas"), z.literal("pacific_slash_honolulu"), z.literal("pacific_slash_johnston"), z.literal("pacific_slash_rarotonga"), z.literal("pacific_slash_tahiti"), z.literal("us_slash_hawaii"), z.literal("pacific_slash_midway"), z.literal("pacific_slash_niue"), z.literal("pacific_slash_pago_pago"), z.literal("pacific_slash_samoa"), z.literal("us_slash_samoa"), z.literal("africa_slash_abidjan"), z.literal("africa_slash_accra"), z.literal("africa_slash_bamako"), z.literal("africa_slash_banjul"), z.literal("africa_slash_bissau"), z.literal("africa_slash_conakry"), z.literal("africa_slash_dakar"), z.literal("africa_slash_freetown"), z.literal("africa_slash_lome"), z.literal("africa_slash_monrovia"), z.literal("africa_slash_nouakchott"), z.literal("africa_slash_ouagadougou"), z.literal("africa_slash_timbuktu"), z.literal("america_slash_danmarkshavn"), z.literal("america_slash_scoresbysund"), z.literal("atlantic_slash_azores"), z.literal("atlantic_slash_reykjavik"), z.literal("atlantic_slash_st_helena"), z.literal("iceland"), z.literal("africa_slash_algiers"), z.literal("africa_slash_bangui"), z.literal("africa_slash_brazzaville"), z.literal("africa_slash_casablanca"), z.literal("africa_slash_douala"), z.literal("africa_slash_el_aaiun"), z.literal("africa_slash_kinshasa"), z.literal("africa_slash_lagos"), z.literal("africa_slash_libreville"), z.literal("africa_slash_luanda"), z.literal("africa_slash_malabo"), z.literal("africa_slash_ndjamena"), z.literal("africa_slash_niamey"), z.literal("africa_slash_porto_hyphen_novo"), z.literal("africa_slash_sao_tome"), z.literal("africa_slash_tunis"), z.literal("atlantic_slash_canary"), z.literal("atlantic_slash_faeroe"), z.literal("atlantic_slash_faroe"), z.literal("atlantic_slash_madeira"), z.literal("europe_slash_belfast"), z.literal("europe_slash_dublin"), z.literal("eire"), z.literal("europe_slash_guernsey"), z.literal("europe_slash_isle_of_man"), z.literal("europe_slash_jersey"), z.literal("europe_slash_lisbon"), z.literal("europe_slash_london"), z.literal("portugal"), z.literal("africa_slash_blantyre"), z.literal("africa_slash_bujumbura"), z.literal("africa_slash_cairo"), z.literal("africa_slash_ceuta"), z.literal("egypt"), z.literal("africa_slash_gaborone"), z.literal("africa_slash_harare"), z.literal("africa_slash_johannesburg"), z.literal("africa_slash_khartoum"), z.literal("africa_slash_kigali"), z.literal("libya"), z.literal("africa_slash_lubumbashi"), z.literal("africa_slash_lusaka"), z.literal("africa_slash_maputo"), z.literal("africa_slash_maseru"), z.literal("africa_slash_mbabane"), z.literal("africa_slash_tripoli"), z.literal("africa_slash_windhoek"), z.literal("antarctica_slash_troll"), z.literal("arctic_slash_longyearbyen"), z.literal("atlantic_slash_jan_mayen"), z.literal("europe_slash_amsterdam"), z.literal("europe_slash_andorra"), z.literal("europe_slash_belgrade"), z.literal("europe_slash_berlin"), z.literal("europe_slash_bratislava"), z.literal("europe_slash_brussels"), z.literal("europe_slash_budapest"), z.literal("europe_slash_busingen"), z.literal("europe_slash_copenhagen"), z.literal("europe_slash_gibraltar"), z.literal("europe_slash_kaliningrad"), z.literal("europe_slash_ljubljana"), z.literal("europe_slash_luxembourg"), z.literal("europe_slash_madrid"), z.literal("europe_slash_malta"), z.literal("europe_slash_monaco"), z.literal("europe_slash_oslo"), z.literal("europe_slash_paris"), z.literal("europe_slash_podgorica"), z.literal("poland"), z.literal("europe_slash_prague"), z.literal("europe_slash_rome"), z.literal("europe_slash_san_marino"), z.literal("europe_slash_sarajevo"), z.literal("europe_slash_skopje"), z.literal("europe_slash_stockholm"), z.literal("europe_slash_tirane"), z.literal("europe_slash_vaduz"), z.literal("europe_slash_vatican"), z.literal("europe_slash_vienna"), z.literal("europe_slash_warsaw"), z.literal("europe_slash_zagreb"), z.literal("europe_slash_zurich"), z.literal("africa_slash_addis_ababa"), z.literal("africa_slash_asmara"), z.literal("africa_slash_asmera"), z.literal("africa_slash_dar_es_salaam"), z.literal("africa_slash_djibouti"), z.literal("africa_slash_juba"), z.literal("africa_slash_kampala"), z.literal("africa_slash_mogadishu"), z.literal("africa_slash_nairobi"), z.literal("antarctica_slash_syowa"), z.literal("asia_slash_aden"), z.literal("asia_slash_amman"), z.literal("asia_slash_baghdad"), z.literal("asia_slash_bahrain"), z.literal("asia_slash_beirut"), z.literal("asia_slash_damascus"), z.literal("asia_slash_famagusta"), z.literal("asia_slash_gaza"), z.literal("asia_slash_hebron"), z.literal("israel"), z.literal("asia_slash_istanbul"), z.literal("asia_slash_jerusalem"), z.literal("asia_slash_kuwait"), z.literal("asia_slash_nicosia"), z.literal("asia_slash_qatar"), z.literal("asia_slash_riyadh"), z.literal("asia_slash_tel_aviv"), z.literal("turkey"), z.literal("europe_slash_athens"), z.literal("europe_slash_bucharest"), z.literal("europe_slash_chisinau"), z.literal("europe_slash_helsinki"), z.literal("europe_slash_istanbul"), z.literal("europe_slash_kirov"), z.literal("europe_slash_kiev"), z.literal("europe_slash_mariehamn"), z.literal("europe_slash_minsk"), z.literal("europe_slash_moscow"), z.literal("europe_slash_nicosia"), z.literal("europe_slash_riga"), z.literal("europe_slash_simferopol"), z.literal("europe_slash_sofia"), z.literal("europe_slash_tallinn"), z.literal("europe_slash_tiraspol"), z.literal("europe_slash_uzhgorod"), z.literal("europe_slash_vilnius"), z.literal("europe_slash_zaporozhye"), z.literal("indian_slash_antananarivo"), z.literal("indian_slash_comoro"), z.literal("indian_slash_mayotte"), z.literal("asia_slash_baku"), z.literal("asia_slash_dubai"), z.literal("asia_slash_muscat"), z.literal("asia_slash_tbilisi"), z.literal("asia_slash_yerevan"), z.literal("europe_slash_astrakhan"), z.literal("europe_slash_samara"), z.literal("europe_slash_saratov"), z.literal("europe_slash_ulyanovsk"), z.literal("europe_slash_volgograd"), z.literal("indian_slash_mahe"), z.literal("indian_slash_mauritius"), z.literal("indian_slash_reunion"), z.literal("iran"), z.literal("asia_slash_kabul"), z.literal("asia_slash_tehran"), z.literal("antarctica_slash_mawson"), z.literal("asia_slash_aqtau"), z.literal("asia_slash_aqtobe"), z.literal("asia_slash_ashgabat"), z.literal("asia_slash_ashkhabad"), z.literal("asia_slash_atyrau"), z.literal("asia_slash_dushanbe"), z.literal("asia_slash_karachi"), z.literal("asia_slash_oral"), z.literal("asia_slash_samarkand"), z.literal("asia_slash_tashkent"), z.literal("asia_slash_yekaterinburg"), z.literal("indian_slash_kerguelen"), z.literal("indian_slash_maldives"), z.literal("asia_slash_calcutta"), z.literal("asia_slash_colombo"), z.literal("asia_slash_kolkata"), z.literal("asia_slash_kathmandu"), z.literal("asia_slash_katmandu"), z.literal("antarctica_slash_vostok"), z.literal("asia_slash_almaty"), z.literal("asia_slash_bishkek"), z.literal("asia_slash_dacca"), z.literal("asia_slash_dhaka"), z.literal("asia_slash_kashgar"), z.literal("asia_slash_omsk"), z.literal("asia_slash_qyzylorda"), z.literal("asia_slash_thimbu"), z.literal("asia_slash_thimphu"), z.literal("asia_slash_urumqi"), z.literal("indian_slash_chagos"), z.literal("asia_slash_rangoon"), z.literal("asia_slash_yangon"), z.literal("indian_slash_cocos"), z.literal("antarctica_slash_davis"), z.literal("asia_slash_bangkok"), z.literal("asia_slash_barnaul"), z.literal("asia_slash_ho_chi_minh"), z.literal("asia_slash_hovd"), z.literal("asia_slash_jakarta"), z.literal("asia_slash_krasnoyarsk"), z.literal("asia_slash_novokuznetsk"), z.literal("asia_slash_novosibirsk"), z.literal("asia_slash_phnom_penh"), z.literal("asia_slash_pontianak"), z.literal("asia_slash_saigon"), z.literal("asia_slash_tomsk"), z.literal("asia_slash_vientiane"), z.literal("indian_slash_christmas"), z.literal("antarctica_slash_casey"), z.literal("asia_slash_brunei"), z.literal("asia_slash_choibalsan"), z.literal("asia_slash_chongqing"), z.literal("asia_slash_chungking"), z.literal("asia_slash_harbin"), z.literal("asia_slash_hong_kong"), z.literal("asia_slash_irkutsk"), z.literal("asia_slash_kuala_lumpur"), z.literal("asia_slash_kuching"), z.literal("asia_slash_macao"), z.literal("asia_slash_macau"), z.literal("asia_slash_makassar"), z.literal("asia_slash_manila"), z.literal("asia_slash_shanghai"), z.literal("asia_slash_singapore"), z.literal("asia_slash_taipei"), z.literal("asia_slash_ujung_pandang"), z.literal("asia_slash_ulaanbaatar"), z.literal("asia_slash_ulan_bator"), z.literal("australia_slash_perth"), z.literal("australia_slash_west"), z.literal("australia_slash_eucla"), z.literal("asia_slash_chita"), z.literal("asia_slash_dili"), z.literal("japan"), z.literal("asia_slash_jayapura"), z.literal("asia_slash_khandyga"), z.literal("asia_slash_pyongyang"), z.literal("asia_slash_seoul"), z.literal("asia_slash_tokyo"), z.literal("asia_slash_yakutsk"), z.literal("pacific_slash_palau"), z.literal("australia_slash_adelaide"), z.literal("australia_slash_broken_hill"), z.literal("australia_slash_darwin"), z.literal("australia_slash_north"), z.literal("australia_slash_south"), z.literal("australia_slash_yancowinna"), z.literal("antarctica_slash_dumontdurville"), z.literal("asia_slash_ust_hyphen_nera"), z.literal("asia_slash_vladivostok"), z.literal("australia_slash_act"), z.literal("australia_slash_brisbane"), z.literal("australia_slash_canberra"), z.literal("australia_slash_currie"), z.literal("australia_slash_hobart"), z.literal("australia_slash_lindeman"), z.literal("australia_slash_melbourne"), z.literal("australia_slash_nsw"), z.literal("australia_slash_queensland"), z.literal("australia_slash_sydney"), z.literal("australia_slash_tasmania"), z.literal("australia_slash_victoria"), z.literal("pacific_slash_chuuk"), z.literal("pacific_slash_guam"), z.literal("pacific_slash_port_moresby"), z.literal("pacific_slash_saipan"), z.literal("pacific_slash_truk"), z.literal("pacific_slash_yap"), z.literal("australia_slash_lhi"), z.literal("australia_slash_lord_howe"), z.literal("antarctica_slash_macquarie"), z.literal("asia_slash_magadan"), z.literal("asia_slash_sakhalin"), z.literal("asia_slash_srednekolymsk"), z.literal("pacific_slash_bougainville"), z.literal("pacific_slash_efate"), z.literal("pacific_slash_guadalcanal"), z.literal("pacific_slash_kosrae"), z.literal("pacific_slash_norfolk"), z.literal("pacific_slash_noumea"), z.literal("pacific_slash_pohnpei"), z.literal("pacific_slash_ponape"), z.literal("antarctica_slash_mcmurdo"), z.literal("antarctica_slash_south_pole"), z.literal("asia_slash_anadyr"), z.literal("asia_slash_kamchatka"), z.literal("pacific_slash_auckland"), z.literal("pacific_slash_fiji"), z.literal("pacific_slash_funafuti"), z.literal("kwajalein"), z.literal("pacific_slash_majuro"), z.literal("pacific_slash_nauru"), z.literal("pacific_slash_tarawa"), z.literal("pacific_slash_wake"), z.literal("pacific_slash_wallis"), z.literal("pacific_slash_chatham"), z.literal("pacific_slash_apia"), z.literal("pacific_slash_enderbury"), z.literal("pacific_slash_fakaofo"), z.literal("pacific_slash_tongatapu"), z.literal("pacific_slash_kiritimati"), expressionSchema]).optional(), twitterUsername: stringOrExpression.optional(), websiteUrl: stringOrExpression.optional(), whatsappPhoneNumber: stringOrExpression.optional(), workEmail: stringOrExpression.optional() }).optional(),
          options: z.object({ resolveData: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact/index.schema.js"(exports2, module2) {
    var getDeleteSchema = require_operation_delete_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getGetRecentlyCreatedUpdatedSchema = require_operation_get_recently_created_updated_schema2();
    var getSearchSchema = require_operation_search_schema();
    var getUpsertSchema = require_operation_upsert_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "upsert" } : parameters;
      return z.union([
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetRecentlyCreatedUpdatedSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams }),
        getUpsertSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact_list/operation_add.schema.js
var require_operation_add_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact_list/operation_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contactList"),
          operation: z.literal("add"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          by: z.union([z.literal("id"), z.literal("email"), expressionSchema]).optional(),
          email: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "by": ["email"] } }, defaults: { "by": "email" } }),
          id: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "by": ["id"] } }, defaults: { "by": "email" } }),
          listId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact_list/operation_remove.schema.js
var require_operation_remove_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact_list/operation_remove.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contactList"),
          operation: z.literal("remove"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          id: numberOrExpression.optional(),
          listId: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact_list/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_contact_list/index.schema.js"(exports2, module2) {
    var getAddSchema = require_operation_add_schema();
    var getRemoveSchema = require_operation_remove_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "upsert" } : parameters;
      return z.union([
        getAddSchema({ ...helpers, parameters: effectiveParams }),
        getRemoveSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          stage: stringOrExpression.optional(),
          additionalFields: z.object({ amount: stringOrExpression.optional(), associatedCompany: z.array(z.string()).optional(), associatedVids: z.array(z.string()).optional(), closeDate: stringOrExpression.optional(), customPropertiesUi: z.unknown().optional(), description: stringOrExpression.optional(), dealName: stringOrExpression.optional(), dealOwner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(), dealType: stringOrExpression.optional(), pipeline: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_delete.schema.js
var require_operation_delete_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          dealId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          dealId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          filters: z.object({ includePropertyVersions: booleanOrExpression.optional(), propertiesCollection: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ includeAssociations: booleanOrExpression.optional(), properties: z.array(z.string()).optional(), propertiesWithHistory: z.array(z.string()).optional(), propertiesCollection: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_get_recently_created_updated.schema.js
var require_operation_get_recently_created_updated_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_get_recently_created_updated.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("getRecentlyCreatedUpdated"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ since: stringOrExpression.optional(), includePropertyVersions: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_search.schema.js
var require_operation_search_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("search"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filterGroupsUi: z.object({ filterGroupsValues: z.array(z.object({ filtersUi: z.unknown().optional() })).optional() }).optional(),
          additionalFields: z.object({ direction: z.union([z.literal("ASCENDING"), z.literal("DESCENDING"), expressionSchema]).optional(), properties: z.array(z.string()).optional(), query: stringOrExpression.optional(), sortBy: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          dealId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          updateFields: z.object({ amount: stringOrExpression.optional(), closeDate: stringOrExpression.optional(), customPropertiesUi: z.unknown().optional(), description: stringOrExpression.optional(), dealName: stringOrExpression.optional(), dealOwner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(), stage: stringOrExpression.optional(), dealType: stringOrExpression.optional(), pipeline: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_deal/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema3();
    var getGetSchema = require_operation_get_schema3();
    var getGetAllSchema = require_operation_get_all_schema3();
    var getGetRecentlyCreatedUpdatedSchema = require_operation_get_recently_created_updated_schema3();
    var getSearchSchema = require_operation_search_schema2();
    var getUpdateSchema = require_operation_update_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "upsert" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getGetRecentlyCreatedUpdatedSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_engagement/operation_create.schema.js
var require_operation_create_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_engagement/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("engagement"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          type: z.union([z.literal("call"), z.literal("email"), z.literal("meeting"), z.literal("task"), expressionSchema]).optional(),
          dueDate: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "type": ["task"] } }, defaults: { "type": "" } }),
          metadata: resolveSchema({ parameters, schema: z.object({ body: stringOrExpression.optional(), forObjectType: z.union([z.literal("COMPANY"), z.literal("CONTACT"), expressionSchema]).optional(), status: z.union([z.literal("COMPLETED"), z.literal("DEFERRED"), z.literal("IN_PROGRESS"), z.literal("NOT_STARTED"), z.literal("WAITING"), expressionSchema]).optional(), subject: stringOrExpression.optional(), bcc: stringOrExpression.optional(), cc: stringOrExpression.optional(), fromEmail: stringOrExpression.optional(), firstName: stringOrExpression.optional(), lastName: stringOrExpression.optional(), html: stringOrExpression.optional(), toEmail: stringOrExpression.optional(), endTime: stringOrExpression.optional(), internalMeetingNotes: stringOrExpression.optional(), startTime: stringOrExpression.optional(), title: stringOrExpression.optional(), durationMilliseconds: numberOrExpression.optional(), fromNumber: stringOrExpression.optional(), recordingUrl: stringOrExpression.optional(), toNumber: stringOrExpression.optional() }), required: false, displayOptions: { "show": { "type": ["task", "email", "meeting", "call"] } }, defaults: { "type": "" } }),
          additionalFields: z.object({ associations: z.unknown().optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_engagement/operation_delete.schema.js
var require_operation_delete_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_engagement/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("engagement"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          engagementId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_engagement/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_engagement/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("engagement"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          engagementId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_engagement/operation_get_all.schema.js
var require_operation_get_all_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_engagement/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("engagement"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_engagement/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_engagement/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema3();
    var getDeleteSchema = require_operation_delete_schema4();
    var getGetSchema = require_operation_get_schema4();
    var getGetAllSchema = require_operation_get_all_schema4();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "upsert" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/operation_create.schema.js
var require_operation_create_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ticket"),
          operation: z.literal("create"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          pipelineId: stringOrExpression.optional(),
          stageId: stringOrExpression.optional(),
          ticketName: stringOrExpression.optional(),
          additionalFields: z.object({ associatedCompanyIds: z.array(z.string()).optional(), associatedContactIds: z.array(z.string()).optional(), category: stringOrExpression.optional(), closeDate: stringOrExpression.optional(), createDate: stringOrExpression.optional(), description: stringOrExpression.optional(), priority: stringOrExpression.optional(), resolution: stringOrExpression.optional(), source: stringOrExpression.optional(), ticketOwnerId: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/operation_delete.schema.js
var require_operation_delete_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ticket"),
          operation: z.literal("delete"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          ticketId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/operation_get.schema.js
var require_operation_get_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ticket"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          ticketId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          additionalFields: z.object({ includeDeleted: booleanOrExpression.optional(), properties: z.array(z.string()).optional(), propertiesWithHistory: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/operation_get_all.schema.js
var require_operation_get_all_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ticket"),
          operation: z.literal("getAll"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          additionalFields: z.object({ properties: z.array(z.string()).optional(), propertiesWithHistory: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/operation_update.schema.js
var require_operation_update_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("ticket"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("apiKey"), z.literal("appToken"), z.literal("oAuth2"), expressionSchema]).optional(),
          ticketId: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("id")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
          updateFields: z.object({ associatedCompanyIds: z.array(z.string()).optional(), associatedContactIds: z.array(z.string()).optional(), category: stringOrExpression.optional(), closeDate: stringOrExpression.optional(), createDate: stringOrExpression.optional(), description: stringOrExpression.optional(), pipelineId: stringOrExpression.optional(), priority: stringOrExpression.optional(), resolution: stringOrExpression.optional(), source: stringOrExpression.optional(), stageId: stringOrExpression.optional(), ticketName: stringOrExpression.optional(), ticketOwnerId: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/resource_ticket/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema4();
    var getDeleteSchema = require_operation_delete_schema5();
    var getGetSchema = require_operation_get_schema5();
    var getGetAllSchema = require_operation_get_all_schema5();
    var getUpdateSchema = require_operation_update_schema3();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "upsert" } : parameters;
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/hubspot/v22/index.schema.js
var getCompanySchema = require_index_schema();
var getContactSchema = require_index_schema2();
var getContactListSchema = require_index_schema3();
var getDealSchema = require_index_schema4();
var getEngagementSchema = require_index_schema5();
var getTicketSchema = require_index_schema6();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "contact" } : parameters;
  return z.union([
    getCompanySchema({ ...helpers, parameters: effectiveParams }),
    getContactSchema({ ...helpers, parameters: effectiveParams }),
    getContactListSchema({ ...helpers, parameters: effectiveParams }),
    getDealSchema({ ...helpers, parameters: effectiveParams }),
    getEngagementSchema({ ...helpers, parameters: effectiveParams }),
    getTicketSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
