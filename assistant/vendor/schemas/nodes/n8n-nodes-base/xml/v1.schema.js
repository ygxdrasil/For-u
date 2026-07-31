var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xml/v1/mode_json_toxml.schema.js
var require_mode_json_toxml_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xml/v1/mode_json_toxml.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("jsonToxml"),
          dataPropertyName: stringOrExpression.optional(),
          options: z.object({ allowSurrogateChars: booleanOrExpression.optional(), attrkey: stringOrExpression.optional(), cdata: booleanOrExpression.optional(), charkey: stringOrExpression.optional(), headless: booleanOrExpression.optional(), rootName: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xml/v1/mode_xml_to_json.schema.js
var require_mode_xml_to_json_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xml/v1/mode_xml_to_json.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("xmlToJson").default("xmlToJson"),
          dataPropertyName: stringOrExpression.optional(),
          options: z.object({ attrkey: stringOrExpression.optional(), charkey: stringOrExpression.optional(), explicitArray: booleanOrExpression.optional(), explicitRoot: booleanOrExpression.optional(), ignoreAttrs: booleanOrExpression.optional(), mergeAttrs: booleanOrExpression.optional(), normalize: booleanOrExpression.optional(), normalizeTags: booleanOrExpression.optional(), trim: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/xml/v1/index.schema.js
var getJsonToxmlSchema = require_mode_json_toxml_schema();
var getXmlToJsonSchema = require_mode_xml_to_json_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.mode === void 0 ? { ...parameters, mode: "xmlToJson" } : parameters;
  return z.union([
    getJsonToxmlSchema({ ...helpers, parameters: effectiveParams }),
    getXmlToJsonSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
