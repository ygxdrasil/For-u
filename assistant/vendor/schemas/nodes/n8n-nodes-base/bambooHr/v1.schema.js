var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_company_report/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_company_report/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("companyReport"),
          operation: z.literal("get"),
          reportId: stringOrExpression.optional(),
          format: z.union([z.literal("CSV"), z.literal("JSON"), z.literal("PDF"), z.literal("XLS"), z.literal("XML"), expressionSchema]).optional(),
          output: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "hide": { "format": ["JSON"] } }, defaults: { "format": "JSON" } }),
          options: z.object({ fd: booleanOrExpression.optional(), onlyCurrent: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_company_report/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_company_report/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return getGetSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("employee").default("employee"),
          operation: z.literal("create").default("create"),
          synced: booleanOrExpression.optional(),
          firstName: stringOrExpression.optional(),
          lastName: stringOrExpression.optional(),
          address: resolveSchema({ parameters, schema: z.object({ value: z.object({ address1: stringOrExpression.optional(), address2: stringOrExpression.optional(), city: stringOrExpression.optional(), state: stringOrExpression.optional(), country: stringOrExpression.optional() }).optional() }), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          dateOfBirth: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          department: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          division: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          employeeNumber: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          exempt: resolveSchema({ parameters, schema: z.union([z.literal("exempt"), z.literal("non-exempt"), expressionSchema]), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          gender: resolveSchema({ parameters, schema: z.union([z.literal("female"), z.literal("male"), expressionSchema]), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          hireDate: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          location: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          maritalStatus: resolveSchema({ parameters, schema: z.union([z.literal("single"), z.literal("married"), z.literal("domesticPartnership"), expressionSchema]), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          mobilePhone: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          paidPer: resolveSchema({ parameters, schema: z.union([z.literal("hour"), z.literal("day"), z.literal("week"), z.literal("month"), z.literal("quater"), z.literal("year"), expressionSchema]), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          payRate: resolveSchema({ parameters, schema: z.object({ value: z.object({ value: stringOrExpression.optional(), currency: stringOrExpression.optional() }).optional() }), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          payType: resolveSchema({ parameters, schema: z.union([z.literal("commission"), z.literal("contract"), z.literal("daily"), z.literal("exceptionHourly"), z.literal("hourly"), z.literal("monthly"), z.literal("pieceRate"), z.literal("proRata"), z.literal("salary"), z.literal("weekly"), expressionSchema]), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          preferredName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          ssn: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          additionalFields: z.object({ address: z.unknown().optional(), dateOfBirth: stringOrExpression.optional(), department: stringOrExpression.optional(), division: stringOrExpression.optional(), employeeNumber: stringOrExpression.optional(), exempt: z.union([z.literal("exempt"), z.literal("non-exempt"), expressionSchema]).optional(), gender: z.union([z.literal("female"), z.literal("male"), expressionSchema]).optional(), hireDate: stringOrExpression.optional(), location: stringOrExpression.optional(), maritalStatus: z.union([z.literal("single"), z.literal("married"), z.literal("domesticPartnership"), expressionSchema]).optional(), mobilePhone: stringOrExpression.optional(), paidPer: z.union([z.literal("hour"), z.literal("day"), z.literal("week"), z.literal("month"), z.literal("quater"), z.literal("year"), expressionSchema]).optional(), payRate: z.unknown().optional(), payType: z.union([z.literal("commission"), z.literal("contract"), z.literal("daily"), z.literal("exceptionHourly"), z.literal("hourly"), z.literal("monthly"), z.literal("pieceRate"), z.literal("proRata"), z.literal("salary"), z.literal("weekly"), expressionSchema]).optional(), preferredName: stringOrExpression.optional(), ssn: stringOrExpression.optional(), workEmail: stringOrExpression.optional(), workPhone: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("employee").default("employee"),
          operation: z.literal("get"),
          employeeId: stringOrExpression.optional(),
          options: z.object({ fields: z.array(z.string()).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("employee").default("employee"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("employee").default("employee"),
          operation: z.literal("update"),
          employeeId: stringOrExpression.optional(),
          synced: booleanOrExpression.optional(),
          addasasress: resolveSchema({ parameters, schema: z.object({ value: z.object({ address1: stringOrExpression.optional(), address2: stringOrExpression.optional(), city: stringOrExpression.optional(), state: stringOrExpression.optional(), country: stringOrExpression.optional() }).optional() }), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          dateOfBirth: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          department: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          division: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          employeeNumber: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          firstName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          lastName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          exempt: resolveSchema({ parameters, schema: z.union([z.literal("exempt"), z.literal("non-exempt"), expressionSchema]), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          gender: resolveSchema({ parameters, schema: z.union([z.literal("female"), z.literal("male"), expressionSchema]), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          hireDate: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          location: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          maritalStatus: resolveSchema({ parameters, schema: z.union([z.literal("single"), z.literal("married"), z.literal("domesticPartnership"), expressionSchema]), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          mobilePhone: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          paidPer: resolveSchema({ parameters, schema: z.union([z.literal("hour"), z.literal("day"), z.literal("week"), z.literal("month"), z.literal("quater"), z.literal("year"), expressionSchema]), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          payRate: resolveSchema({ parameters, schema: z.object({ value: z.object({ value: stringOrExpression.optional(), currency: stringOrExpression.optional() }).optional() }), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          payType: resolveSchema({ parameters, schema: z.union([z.literal("commission"), z.literal("contract"), z.literal("daily"), z.literal("exceptionHourly"), z.literal("hourly"), z.literal("monthly"), z.literal("pieceRate"), z.literal("proRata"), z.literal("salary"), z.literal("weekly"), expressionSchema]), required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          preferredName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          ssn: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "synced": [true] } }, defaults: { "synced": false } }),
          updateFields: z.object({ addasasress: z.unknown().optional(), dateOfBirth: stringOrExpression.optional(), department: stringOrExpression.optional(), division: stringOrExpression.optional(), employeeNumber: stringOrExpression.optional(), firstName: stringOrExpression.optional(), lastName: stringOrExpression.optional(), exempt: z.union([z.literal("exempt"), z.literal("non-exempt"), expressionSchema]).optional(), gender: z.union([z.literal("female"), z.literal("male"), expressionSchema]).optional(), hireDate: stringOrExpression.optional(), location: stringOrExpression.optional(), maritalStatus: z.union([z.literal("single"), z.literal("married"), z.literal("domesticPartnership"), expressionSchema]).optional(), mobilePhone: stringOrExpression.optional(), paidPer: z.union([z.literal("hour"), z.literal("day"), z.literal("week"), z.literal("month"), z.literal("quater"), z.literal("year"), expressionSchema]).optional(), payRate: z.unknown().optional(), payType: z.union([z.literal("commission"), z.literal("contract"), z.literal("daily"), z.literal("exceptionHourly"), z.literal("hourly"), z.literal("monthly"), z.literal("pieceRate"), z.literal("proRata"), z.literal("salary"), z.literal("weekly"), expressionSchema]).optional(), preferredName: stringOrExpression.optional(), ssn: stringOrExpression.optional(), workEmail: stringOrExpression.optional(), workPhone: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getGetSchema = require_operation_get_schema2();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("employeeDocument"),
          operation: z.literal("delete"),
          employeeId: stringOrExpression.optional(),
          fileId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/operation_download.schema.js
var require_operation_download_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/operation_download.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("employeeDocument"),
          operation: z.literal("download"),
          employeeId: stringOrExpression.optional(),
          fileId: stringOrExpression.optional(),
          output: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("employeeDocument"),
          operation: z.literal("getAll"),
          employeeId: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simplifyOutput: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("employeeDocument"),
          operation: z.literal("update"),
          employeeId: stringOrExpression.optional(),
          fileId: stringOrExpression.optional(),
          updateFields: z.object({ categoryId: stringOrExpression.optional(), name: stringOrExpression.optional(), shareWithEmployee: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/operation_upload.schema.js
var require_operation_upload_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/operation_upload.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("employeeDocument"),
          operation: z.literal("upload"),
          employeeId: stringOrExpression.optional(),
          categoryId: stringOrExpression.optional(),
          binaryPropertyName: stringOrExpression.optional(),
          options: z.object({ share: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_employee_document/index.schema.js"(exports2, module2) {
    var getDeleteSchema = require_operation_delete_schema();
    var getDownloadSchema = require_operation_download_schema();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getUpdateSchema = require_operation_update_schema2();
    var getUploadSchema = require_operation_upload_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getDownloadSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUploadSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("delete"),
          fileId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/operation_download.schema.js
var require_operation_download_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/operation_download.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("download"),
          fileId: stringOrExpression.optional(),
          output: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          simplifyOutput: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/operation_update.schema.js
var require_operation_update_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("update"),
          fileId: stringOrExpression.optional(),
          updateFields: z.object({ categoryId: stringOrExpression.optional(), name: stringOrExpression.optional(), shareWithEmployee: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/operation_upload.schema.js
var require_operation_upload_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/operation_upload.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("file"),
          operation: z.literal("upload"),
          binaryPropertyName: stringOrExpression.optional(),
          categoryId: stringOrExpression.optional(),
          options: z.object({ share: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/resource_file/index.schema.js"(exports2, module2) {
    var getDeleteSchema = require_operation_delete_schema2();
    var getDownloadSchema = require_operation_download_schema2();
    var getGetAllSchema = require_operation_get_all_schema3();
    var getUpdateSchema = require_operation_update_schema3();
    var getUploadSchema = require_operation_upload_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getDownloadSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams }),
        getUploadSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/bambooHr/v1/index.schema.js
var getCompanyReportSchema = require_index_schema();
var getEmployeeSchema = require_index_schema2();
var getEmployeeDocumentSchema = require_index_schema3();
var getFileSchema = require_index_schema4();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "employee" } : parameters;
  return z.union([
    getCompanyReportSchema({ ...helpers, parameters: effectiveParams }),
    getEmployeeSchema({ ...helpers, parameters: effectiveParams }),
    getEmployeeDocumentSchema({ ...helpers, parameters: effectiveParams }),
    getFileSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
