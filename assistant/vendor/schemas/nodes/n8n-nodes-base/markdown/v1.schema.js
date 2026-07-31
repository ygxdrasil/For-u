var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/markdown/v1/mode_html_to_markdown.schema.js
var require_mode_html_to_markdown_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/markdown/v1/mode_html_to_markdown.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("htmlToMarkdown").default("htmlToMarkdown"),
          html: stringOrExpression.optional(),
          destinationKey: stringOrExpression.optional(),
          options: z.object({ bulletMarker: stringOrExpression.optional(), codeFence: stringOrExpression.optional(), emDelimiter: stringOrExpression.optional(), globalEscape: z.unknown().optional(), ignore: stringOrExpression.optional(), keepDataImages: booleanOrExpression.optional(), lineStartEscape: z.unknown().optional(), maxConsecutiveNewlines: numberOrExpression.optional(), useLinkReferenceDefinitions: booleanOrExpression.optional(), strongDelimiter: stringOrExpression.optional(), codeBlockStyle: z.union([z.literal("fence"), z.literal("indented"), expressionSchema]).optional(), textReplace: z.unknown().optional(), blockElements: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/markdown/v1/mode_markdown_to_html.schema.js
var require_mode_markdown_to_html_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/markdown/v1/mode_markdown_to_html.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          mode: z.literal("markdownToHtml"),
          markdown: stringOrExpression.optional(),
          destinationKey: stringOrExpression.optional(),
          options: z.object({ openLinksInNewWindow: booleanOrExpression.optional(), simplifiedAutoLink: booleanOrExpression.optional(), backslashEscapesHTMLTags: booleanOrExpression.optional(), completeHTMLDocument: booleanOrExpression.optional(), customizedHeaderId: booleanOrExpression.optional(), emoji: booleanOrExpression.optional(), encodeEmails: booleanOrExpression.optional(), excludeTrailingPunctuationFromURLs: booleanOrExpression.optional(), ghCodeBlocks: booleanOrExpression.optional(), ghCompatibleHeaderId: booleanOrExpression.optional(), ghMentionsLink: stringOrExpression.optional(), ghMentions: booleanOrExpression.optional(), tasklists: booleanOrExpression.optional(), headerLevelStart: numberOrExpression.optional(), requireSpaceBeforeHeadingText: booleanOrExpression.optional(), literalMidWordAsterisks: booleanOrExpression.optional(), literalMidWordUnderscores: booleanOrExpression.optional(), noHeaderId: booleanOrExpression.optional(), parseImgDimensions: booleanOrExpression.optional(), prefixHeaderId: stringOrExpression.optional(), rawHeaderId: booleanOrExpression.optional(), rawPrefixHeaderId: booleanOrExpression.optional(), simpleLineBreaks: booleanOrExpression.optional(), smartIndentationFix: booleanOrExpression.optional(), disableForced4SpacesIndentedSublists: booleanOrExpression.optional(), splitAdjacentBlockquotes: booleanOrExpression.optional(), strikethrough: booleanOrExpression.optional(), tablesHeaderId: booleanOrExpression.optional(), tables: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/markdown/v1/index.schema.js
var getHtmlToMarkdownSchema = require_mode_html_to_markdown_schema();
var getMarkdownToHtmlSchema = require_mode_markdown_to_html_schema();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.mode === void 0 ? { ...parameters, mode: "htmlToMarkdown" } : parameters;
  return z.union([
    getHtmlToMarkdownSchema({ ...helpers, parameters: effectiveParams }),
    getMarkdownToHtmlSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
