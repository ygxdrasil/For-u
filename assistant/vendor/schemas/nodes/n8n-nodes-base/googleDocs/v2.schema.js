var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDocs/v2/resource_document/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDocs/v2/resource_document/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("document").default("document"),
          operation: z.literal("create").default("create"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          driveId: stringOrExpression.optional(),
          folderId: stringOrExpression.optional(),
          title: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDocs/v2/resource_document/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDocs/v2/resource_document/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("document").default("document"),
          operation: z.literal("get"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          documentURL: stringOrExpression.optional(),
          simple: booleanOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDocs/v2/resource_document/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDocs/v2/resource_document/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("document").default("document"),
          operation: z.literal("update"),
          authentication: z.union([z.literal("oAuth2"), z.literal("serviceAccount"), expressionSchema]).optional(),
          documentURL: stringOrExpression.optional(),
          simple: booleanOrExpression.optional(),
          actionsUi: z.object({ actionFields: z.array(z.object({ object: z.union([z.literal("footer"), z.literal("header"), z.literal("namedRange"), z.literal("pageBreak"), z.literal("paragraphBullets"), z.literal("positionedObject"), z.literal("table"), z.literal("tableColumn"), z.literal("tableRow"), z.literal("text"), expressionSchema]).optional(), action: z.union([z.literal("replaceAll"), z.literal("insert"), expressionSchema]).optional(), action: z.union([z.literal("create"), z.literal("delete"), expressionSchema]).optional(), action: z.union([z.literal("delete"), z.literal("insert"), expressionSchema]).optional(), action: z.union([z.literal("insert"), expressionSchema]).optional(), action: z.union([z.literal("delete"), expressionSchema]).optional(), insertSegment: z.union([z.literal("header"), z.literal("body"), z.literal("footer"), expressionSchema]).optional(), segmentId: stringOrExpression.optional(), index: numberOrExpression.optional(), name: stringOrExpression.optional(), startIndex: numberOrExpression.optional(), endIndex: numberOrExpression.optional(), bulletPreset: z.union([z.literal("BULLET_DISC_CIRCLE_SQUARE"), z.literal("BULLET_CHECKBOX"), z.literal("NUMBERED_DECIMAL_NESTED"), expressionSchema]).optional(), footerId: stringOrExpression.optional(), headerId: stringOrExpression.optional(), namedRangeReference: z.union([z.literal("namedRangeId"), z.literal("name"), expressionSchema]).optional(), value: stringOrExpression.optional(), value: stringOrExpression.optional(), objectId: stringOrExpression.optional(), insertSegment: z.union([z.literal("header"), z.literal("body"), z.literal("footer"), expressionSchema]).optional(), segmentId: stringOrExpression.optional(), locationChoice: z.union([z.literal("endOfSegmentLocation"), z.literal("location"), expressionSchema]).optional(), index: numberOrExpression.optional(), locationChoice: z.union([z.literal("endOfSegmentLocation"), z.literal("location"), expressionSchema]).optional(), index: numberOrExpression.optional(), rows: numberOrExpression.optional(), columns: numberOrExpression.optional(), locationChoice: z.union([z.literal("endOfSegmentLocation"), z.literal("location"), expressionSchema]).optional(), index: numberOrExpression.optional(), text: stringOrExpression.optional(), text: stringOrExpression.optional(), replaceText: stringOrExpression.optional(), matchCase: booleanOrExpression.optional(), insertSegment: z.union([z.literal("header"), z.literal("body"), z.literal("footer"), expressionSchema]).optional(), segmentId: stringOrExpression.optional(), startIndex: numberOrExpression.optional(), endIndex: numberOrExpression.optional(), insertPosition: z.union([z.literal(false), z.literal(true), expressionSchema]).optional(), index: numberOrExpression.optional(), rowIndex: numberOrExpression.optional(), columnIndex: numberOrExpression.optional() })).optional() }).optional(),
          updateFields: z.object({ writeControlObject: z.object({ control: z.union([z.literal("targetRevisionId"), z.literal("requiredRevisionId"), expressionSchema]).optional(), value: stringOrExpression.optional() }).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDocs/v2/resource_document/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDocs/v2/resource_document/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema();
    var getGetSchema = require_operation_get_schema();
    var getUpdateSchema = require_operation_update_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/googleDocs/v2/index.schema.js
var getDocumentSchema = require_index_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "document" } : parameters;
  return getDocumentSchema({ ...helpers, parameters: effectiveParams });
};
