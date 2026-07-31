var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_information/operation_exchange_rate.schema.js
var require_operation_exchange_rate_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_information/operation_exchange_rate.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("information"),
          operation: z.literal("exchangeRate"),
          value: stringOrExpression.optional(),
          fromCurrency: stringOrExpression.optional(),
          toCurrency: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_information/operation_image_metadata.schema.js
var require_operation_image_metadata_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_information/operation_image_metadata.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("information"),
          operation: z.literal("imageMetadata"),
          link: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_information/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_information/index.schema.js"(exports2, module2) {
    var getExchangeRateSchema = require_operation_exchange_rate_schema();
    var getImageMetadataSchema = require_operation_image_metadata_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "pdf" } : parameters;
      return z.union([
        getExchangeRateSchema({ ...helpers, parameters: effectiveParams }),
        getImageMetadataSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_social_profile/operation_instagram_profile.schema.js
var require_operation_instagram_profile_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_social_profile/operation_instagram_profile.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("socialProfile"),
          operation: z.literal("instagramProfile"),
          profileName: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_social_profile/operation_spotify_artist_profile.schema.js
var require_operation_spotify_artist_profile_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_social_profile/operation_spotify_artist_profile.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("socialProfile"),
          operation: z.literal("spotifyArtistProfile"),
          artistName: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_social_profile/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_social_profile/index.schema.js"(exports2, module2) {
    var getInstagramProfileSchema = require_operation_instagram_profile_schema();
    var getSpotifyArtistProfileSchema = require_operation_spotify_artist_profile_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "pdf" } : parameters;
      return z.union([
        getInstagramProfileSchema({ ...helpers, parameters: effectiveParams }),
        getSpotifyArtistProfileSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_utility/operation_expand_u_r_l.schema.js
var require_operation_expand_u_r_l_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_utility/operation_expand_u_r_l.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("utility"),
          operation: z.literal("expandURL"),
          link: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_utility/operation_qr_code.schema.js
var require_operation_qr_code_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_utility/operation_qr_code.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("utility"),
          operation: z.literal("qrCode"),
          message: stringOrExpression.optional(),
          download: booleanOrExpression.optional(),
          output: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "download": [true] } }, defaults: { "download": false } }),
          options: z.object({ size: z.union([z.literal("Small"), z.literal("Medium"), z.literal("Large"), expressionSchema]).optional(), format: z.union([z.literal("PNG"), z.literal("SVG"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_utility/operation_validate_email.schema.js
var require_operation_validate_email_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_utility/operation_validate_email.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("utility"),
          operation: z.literal("validateEmail"),
          emailAddress: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_utility/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_utility/index.schema.js"(exports2, module2) {
    var getExpandURLSchema = require_operation_expand_u_r_l_schema();
    var getQrCodeSchema = require_operation_qr_code_schema();
    var getValidateEmailSchema = require_operation_validate_email_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "pdf" } : parameters;
      return z.union([
        getExpandURLSchema({ ...helpers, parameters: effectiveParams }),
        getQrCodeSchema({ ...helpers, parameters: effectiveParams }),
        getValidateEmailSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_website/operation_pdf.schema.js
var require_operation_pdf_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_website/operation_pdf.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("website").default("website"),
          operation: z.literal("pdf").default("pdf"),
          link: stringOrExpression.optional(),
          download: booleanOrExpression.optional(),
          output: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "download": [true] } }, defaults: { "download": false } }),
          options: z.object({ page: z.union([z.literal("A0"), z.literal("A1"), z.literal("A2"), z.literal("A3"), z.literal("A4"), z.literal("A5"), z.literal("A6"), z.literal("Ledger"), z.literal("Legal"), z.literal("Letter"), z.literal("Tabloid"), expressionSchema]).optional(), force: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_website/operation_screenshot.schema.js
var require_operation_screenshot_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_website/operation_screenshot.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("website").default("website"),
          operation: z.literal("screenshot"),
          link: stringOrExpression.optional(),
          download: booleanOrExpression.optional(),
          output: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "download": [true] } }, defaults: { "download": false } }),
          options: z.object({ screen: z.union([z.literal("phone"), z.literal("phone-landscape"), z.literal("retina"), z.literal("tablet"), z.literal("tablet-landscape"), expressionSchema]).optional(), force: booleanOrExpression.optional(), fullpage: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_website/operation_seo.schema.js
var require_operation_seo_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_website/operation_seo.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("website").default("website"),
          operation: z.literal("seo"),
          link: stringOrExpression.optional(),
          options: z.object({ headers: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_website/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/resource_website/index.schema.js"(exports2, module2) {
    var getPdfSchema = require_operation_pdf_schema();
    var getScreenshotSchema = require_operation_screenshot_schema();
    var getSeoSchema = require_operation_seo_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "pdf" } : parameters;
      return z.union([
        getPdfSchema({ ...helpers, parameters: effectiveParams }),
        getScreenshotSchema({ ...helpers, parameters: effectiveParams }),
        getSeoSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/oneSimpleApi/v1/index.schema.js
var getInformationSchema = require_index_schema();
var getSocialProfileSchema = require_index_schema2();
var getUtilitySchema = require_index_schema3();
var getWebsiteSchema = require_index_schema4();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "website" } : parameters;
  return z.union([
    getInformationSchema({ ...helpers, parameters: effectiveParams }),
    getSocialProfileSchema({ ...helpers, parameters: effectiveParams }),
    getUtilitySchema({ ...helpers, parameters: effectiveParams }),
    getWebsiteSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
