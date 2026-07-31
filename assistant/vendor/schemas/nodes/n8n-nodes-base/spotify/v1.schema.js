var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_album/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_album/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("album"),
          operation: z.literal("get"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_album/operation_get_new_releases.schema.js
var require_operation_get_new_releases_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_album/operation_get_new_releases.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("album"),
          operation: z.literal("getNewReleases"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ country: z.union([z.literal("AF"), z.literal("AX"), z.literal("AL"), z.literal("DZ"), z.literal("AS"), z.literal("AD"), z.literal("AO"), z.literal("AI"), z.literal("AQ"), z.literal("AG"), z.literal("AR"), z.literal("AM"), z.literal("AW"), z.literal("AU"), z.literal("AT"), z.literal("AZ"), z.literal("BS"), z.literal("BH"), z.literal("BD"), z.literal("BB"), z.literal("BY"), z.literal("BE"), z.literal("BZ"), z.literal("BJ"), z.literal("BM"), z.literal("BT"), z.literal("BO"), z.literal("BQ"), z.literal("BA"), z.literal("BW"), z.literal("BV"), z.literal("BR"), z.literal("IO"), z.literal("BN"), z.literal("BG"), z.literal("BF"), z.literal("BI"), z.literal("CV"), z.literal("KH"), z.literal("CM"), z.literal("CA"), z.literal("KY"), z.literal("CF"), z.literal("TD"), z.literal("CL"), z.literal("CN"), z.literal("CX"), z.literal("CC"), z.literal("CO"), z.literal("KM"), z.literal("CD"), z.literal("CG"), z.literal("CK"), z.literal("CR"), z.literal("CI"), z.literal("HR"), z.literal("CU"), z.literal("CW"), z.literal("CY"), z.literal("CZ"), z.literal("DK"), z.literal("DJ"), z.literal("DM"), z.literal("DO"), z.literal("EC"), z.literal("EG"), z.literal("SV"), z.literal("GQ"), z.literal("ER"), z.literal("EE"), z.literal("ET"), z.literal("FK"), z.literal("FO"), z.literal("FJ"), z.literal("FI"), z.literal("FR"), z.literal("GF"), z.literal("PF"), z.literal("TF"), z.literal("GA"), z.literal("GM"), z.literal("GE"), z.literal("DE"), z.literal("GH"), z.literal("GI"), z.literal("GR"), z.literal("GL"), z.literal("GD"), z.literal("GP"), z.literal("GU"), z.literal("GT"), z.literal("GG"), z.literal("GN"), z.literal("GW"), z.literal("GY"), z.literal("HT"), z.literal("HM"), z.literal("VA"), z.literal("HN"), z.literal("HK"), z.literal("HU"), z.literal("IS"), z.literal("IN"), z.literal("ID"), z.literal("IR"), z.literal("IQ"), z.literal("IE"), z.literal("IM"), z.literal("IL"), z.literal("IT"), z.literal("JM"), z.literal("JP"), z.literal("JE"), z.literal("JO"), z.literal("KZ"), z.literal("KE"), z.literal("KI"), z.literal("KP"), z.literal("KR"), z.literal("KW"), z.literal("KG"), z.literal("LA"), z.literal("LV"), z.literal("LB"), z.literal("LS"), z.literal("LR"), z.literal("LY"), z.literal("LI"), z.literal("LT"), z.literal("LU"), z.literal("MO"), z.literal("MK"), z.literal("MG"), z.literal("MW"), z.literal("MY"), z.literal("MV"), z.literal("ML"), z.literal("MT"), z.literal("MH"), z.literal("MQ"), z.literal("MR"), z.literal("MU"), z.literal("YT"), z.literal("MX"), z.literal("FM"), z.literal("MD"), z.literal("MC"), z.literal("MN"), z.literal("ME"), z.literal("MS"), z.literal("MA"), z.literal("MZ"), z.literal("MM"), z.literal("NA"), z.literal("NR"), z.literal("NP"), z.literal("NL"), z.literal("NC"), z.literal("NZ"), z.literal("NI"), z.literal("NE"), z.literal("NG"), z.literal("NU"), z.literal("NF"), z.literal("MP"), z.literal("NO"), z.literal("OM"), z.literal("PK"), z.literal("PW"), z.literal("PS"), z.literal("PA"), z.literal("PG"), z.literal("PY"), z.literal("PE"), z.literal("PH"), z.literal("PN"), z.literal("PL"), z.literal("PT"), z.literal("PR"), z.literal("QA"), z.literal("RE"), z.literal("RO"), z.literal("RU"), z.literal("RW"), z.literal("BL"), z.literal("SH"), z.literal("KN"), z.literal("LC"), z.literal("MF"), z.literal("PM"), z.literal("VC"), z.literal("WS"), z.literal("SM"), z.literal("ST"), z.literal("SA"), z.literal("SN"), z.literal("RS"), z.literal("SC"), z.literal("SL"), z.literal("SG"), z.literal("SX"), z.literal("SK"), z.literal("SI"), z.literal("SB"), z.literal("SO"), z.literal("ZA"), z.literal("GS"), z.literal("SS"), z.literal("ES"), z.literal("LK"), z.literal("SD"), z.literal("SR"), z.literal("SJ"), z.literal("SZ"), z.literal("SE"), z.literal("CH"), z.literal("SY"), z.literal("TW"), z.literal("TJ"), z.literal("TZ"), z.literal("TH"), z.literal("TL"), z.literal("TG"), z.literal("TK"), z.literal("TO"), z.literal("TT"), z.literal("TN"), z.literal("TR"), z.literal("TM"), z.literal("TC"), z.literal("TV"), z.literal("UG"), z.literal("UA"), z.literal("AE"), z.literal("GB"), z.literal("UM"), z.literal("US"), z.literal("UY"), z.literal("UZ"), z.literal("VU"), z.literal("VE"), z.literal("VN"), z.literal("VG"), z.literal("VI"), z.literal("WF"), z.literal("EH"), z.literal("YE"), z.literal("ZM"), z.literal("ZW"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_album/operation_get_tracks.schema.js
var require_operation_get_tracks_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_album/operation_get_tracks.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("album"),
          operation: z.literal("getTracks"),
          id: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_album/operation_search.schema.js
var require_operation_search_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_album/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("album"),
          operation: z.literal("search"),
          query: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ market: z.union([z.literal("AF"), z.literal("AX"), z.literal("AL"), z.literal("DZ"), z.literal("AS"), z.literal("AD"), z.literal("AO"), z.literal("AI"), z.literal("AQ"), z.literal("AG"), z.literal("AR"), z.literal("AM"), z.literal("AW"), z.literal("AU"), z.literal("AT"), z.literal("AZ"), z.literal("BS"), z.literal("BH"), z.literal("BD"), z.literal("BB"), z.literal("BY"), z.literal("BE"), z.literal("BZ"), z.literal("BJ"), z.literal("BM"), z.literal("BT"), z.literal("BO"), z.literal("BQ"), z.literal("BA"), z.literal("BW"), z.literal("BV"), z.literal("BR"), z.literal("IO"), z.literal("BN"), z.literal("BG"), z.literal("BF"), z.literal("BI"), z.literal("CV"), z.literal("KH"), z.literal("CM"), z.literal("CA"), z.literal("KY"), z.literal("CF"), z.literal("TD"), z.literal("CL"), z.literal("CN"), z.literal("CX"), z.literal("CC"), z.literal("CO"), z.literal("KM"), z.literal("CD"), z.literal("CG"), z.literal("CK"), z.literal("CR"), z.literal("CI"), z.literal("HR"), z.literal("CU"), z.literal("CW"), z.literal("CY"), z.literal("CZ"), z.literal("DK"), z.literal("DJ"), z.literal("DM"), z.literal("DO"), z.literal("EC"), z.literal("EG"), z.literal("SV"), z.literal("GQ"), z.literal("ER"), z.literal("EE"), z.literal("ET"), z.literal("FK"), z.literal("FO"), z.literal("FJ"), z.literal("FI"), z.literal("FR"), z.literal("GF"), z.literal("PF"), z.literal("TF"), z.literal("GA"), z.literal("GM"), z.literal("GE"), z.literal("DE"), z.literal("GH"), z.literal("GI"), z.literal("GR"), z.literal("GL"), z.literal("GD"), z.literal("GP"), z.literal("GU"), z.literal("GT"), z.literal("GG"), z.literal("GN"), z.literal("GW"), z.literal("GY"), z.literal("HT"), z.literal("HM"), z.literal("VA"), z.literal("HN"), z.literal("HK"), z.literal("HU"), z.literal("IS"), z.literal("IN"), z.literal("ID"), z.literal("IR"), z.literal("IQ"), z.literal("IE"), z.literal("IM"), z.literal("IL"), z.literal("IT"), z.literal("JM"), z.literal("JP"), z.literal("JE"), z.literal("JO"), z.literal("KZ"), z.literal("KE"), z.literal("KI"), z.literal("KP"), z.literal("KR"), z.literal("KW"), z.literal("KG"), z.literal("LA"), z.literal("LV"), z.literal("LB"), z.literal("LS"), z.literal("LR"), z.literal("LY"), z.literal("LI"), z.literal("LT"), z.literal("LU"), z.literal("MO"), z.literal("MK"), z.literal("MG"), z.literal("MW"), z.literal("MY"), z.literal("MV"), z.literal("ML"), z.literal("MT"), z.literal("MH"), z.literal("MQ"), z.literal("MR"), z.literal("MU"), z.literal("YT"), z.literal("MX"), z.literal("FM"), z.literal("MD"), z.literal("MC"), z.literal("MN"), z.literal("ME"), z.literal("MS"), z.literal("MA"), z.literal("MZ"), z.literal("MM"), z.literal("NA"), z.literal("NR"), z.literal("NP"), z.literal("NL"), z.literal("NC"), z.literal("NZ"), z.literal("NI"), z.literal("NE"), z.literal("NG"), z.literal("NU"), z.literal("NF"), z.literal("MP"), z.literal("NO"), z.literal("OM"), z.literal("PK"), z.literal("PW"), z.literal("PS"), z.literal("PA"), z.literal("PG"), z.literal("PY"), z.literal("PE"), z.literal("PH"), z.literal("PN"), z.literal("PL"), z.literal("PT"), z.literal("PR"), z.literal("QA"), z.literal("RE"), z.literal("RO"), z.literal("RU"), z.literal("RW"), z.literal("BL"), z.literal("SH"), z.literal("KN"), z.literal("LC"), z.literal("MF"), z.literal("PM"), z.literal("VC"), z.literal("WS"), z.literal("SM"), z.literal("ST"), z.literal("SA"), z.literal("SN"), z.literal("RS"), z.literal("SC"), z.literal("SL"), z.literal("SG"), z.literal("SX"), z.literal("SK"), z.literal("SI"), z.literal("SB"), z.literal("SO"), z.literal("ZA"), z.literal("GS"), z.literal("SS"), z.literal("ES"), z.literal("LK"), z.literal("SD"), z.literal("SR"), z.literal("SJ"), z.literal("SZ"), z.literal("SE"), z.literal("CH"), z.literal("SY"), z.literal("TW"), z.literal("TJ"), z.literal("TZ"), z.literal("TH"), z.literal("TL"), z.literal("TG"), z.literal("TK"), z.literal("TO"), z.literal("TT"), z.literal("TN"), z.literal("TR"), z.literal("TM"), z.literal("TC"), z.literal("TV"), z.literal("UG"), z.literal("UA"), z.literal("AE"), z.literal("GB"), z.literal("UM"), z.literal("US"), z.literal("UY"), z.literal("UZ"), z.literal("VU"), z.literal("VE"), z.literal("VN"), z.literal("VG"), z.literal("VI"), z.literal("WF"), z.literal("EH"), z.literal("YE"), z.literal("ZM"), z.literal("ZW"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_album/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_album/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema();
    var getGetNewReleasesSchema = require_operation_get_new_releases_schema();
    var getGetTracksSchema = require_operation_get_tracks_schema();
    var getSearchSchema = require_operation_search_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "addSongToQueue" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetNewReleasesSchema({ ...helpers, parameters: effectiveParams }),
        getGetTracksSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("artist"),
          operation: z.literal("get"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/operation_get_albums.schema.js
var require_operation_get_albums_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/operation_get_albums.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("artist"),
          operation: z.literal("getAlbums"),
          id: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/operation_get_related_artists.schema.js
var require_operation_get_related_artists_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/operation_get_related_artists.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("artist"),
          operation: z.literal("getRelatedArtists"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/operation_get_top_tracks.schema.js
var require_operation_get_top_tracks_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/operation_get_top_tracks.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("artist"),
          operation: z.literal("getTopTracks"),
          id: stringOrExpression.optional(),
          country: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/operation_search.schema.js
var require_operation_search_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("artist"),
          operation: z.literal("search"),
          id: stringOrExpression.optional(),
          query: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ market: z.union([z.literal("AF"), z.literal("AX"), z.literal("AL"), z.literal("DZ"), z.literal("AS"), z.literal("AD"), z.literal("AO"), z.literal("AI"), z.literal("AQ"), z.literal("AG"), z.literal("AR"), z.literal("AM"), z.literal("AW"), z.literal("AU"), z.literal("AT"), z.literal("AZ"), z.literal("BS"), z.literal("BH"), z.literal("BD"), z.literal("BB"), z.literal("BY"), z.literal("BE"), z.literal("BZ"), z.literal("BJ"), z.literal("BM"), z.literal("BT"), z.literal("BO"), z.literal("BQ"), z.literal("BA"), z.literal("BW"), z.literal("BV"), z.literal("BR"), z.literal("IO"), z.literal("BN"), z.literal("BG"), z.literal("BF"), z.literal("BI"), z.literal("CV"), z.literal("KH"), z.literal("CM"), z.literal("CA"), z.literal("KY"), z.literal("CF"), z.literal("TD"), z.literal("CL"), z.literal("CN"), z.literal("CX"), z.literal("CC"), z.literal("CO"), z.literal("KM"), z.literal("CD"), z.literal("CG"), z.literal("CK"), z.literal("CR"), z.literal("CI"), z.literal("HR"), z.literal("CU"), z.literal("CW"), z.literal("CY"), z.literal("CZ"), z.literal("DK"), z.literal("DJ"), z.literal("DM"), z.literal("DO"), z.literal("EC"), z.literal("EG"), z.literal("SV"), z.literal("GQ"), z.literal("ER"), z.literal("EE"), z.literal("ET"), z.literal("FK"), z.literal("FO"), z.literal("FJ"), z.literal("FI"), z.literal("FR"), z.literal("GF"), z.literal("PF"), z.literal("TF"), z.literal("GA"), z.literal("GM"), z.literal("GE"), z.literal("DE"), z.literal("GH"), z.literal("GI"), z.literal("GR"), z.literal("GL"), z.literal("GD"), z.literal("GP"), z.literal("GU"), z.literal("GT"), z.literal("GG"), z.literal("GN"), z.literal("GW"), z.literal("GY"), z.literal("HT"), z.literal("HM"), z.literal("VA"), z.literal("HN"), z.literal("HK"), z.literal("HU"), z.literal("IS"), z.literal("IN"), z.literal("ID"), z.literal("IR"), z.literal("IQ"), z.literal("IE"), z.literal("IM"), z.literal("IL"), z.literal("IT"), z.literal("JM"), z.literal("JP"), z.literal("JE"), z.literal("JO"), z.literal("KZ"), z.literal("KE"), z.literal("KI"), z.literal("KP"), z.literal("KR"), z.literal("KW"), z.literal("KG"), z.literal("LA"), z.literal("LV"), z.literal("LB"), z.literal("LS"), z.literal("LR"), z.literal("LY"), z.literal("LI"), z.literal("LT"), z.literal("LU"), z.literal("MO"), z.literal("MK"), z.literal("MG"), z.literal("MW"), z.literal("MY"), z.literal("MV"), z.literal("ML"), z.literal("MT"), z.literal("MH"), z.literal("MQ"), z.literal("MR"), z.literal("MU"), z.literal("YT"), z.literal("MX"), z.literal("FM"), z.literal("MD"), z.literal("MC"), z.literal("MN"), z.literal("ME"), z.literal("MS"), z.literal("MA"), z.literal("MZ"), z.literal("MM"), z.literal("NA"), z.literal("NR"), z.literal("NP"), z.literal("NL"), z.literal("NC"), z.literal("NZ"), z.literal("NI"), z.literal("NE"), z.literal("NG"), z.literal("NU"), z.literal("NF"), z.literal("MP"), z.literal("NO"), z.literal("OM"), z.literal("PK"), z.literal("PW"), z.literal("PS"), z.literal("PA"), z.literal("PG"), z.literal("PY"), z.literal("PE"), z.literal("PH"), z.literal("PN"), z.literal("PL"), z.literal("PT"), z.literal("PR"), z.literal("QA"), z.literal("RE"), z.literal("RO"), z.literal("RU"), z.literal("RW"), z.literal("BL"), z.literal("SH"), z.literal("KN"), z.literal("LC"), z.literal("MF"), z.literal("PM"), z.literal("VC"), z.literal("WS"), z.literal("SM"), z.literal("ST"), z.literal("SA"), z.literal("SN"), z.literal("RS"), z.literal("SC"), z.literal("SL"), z.literal("SG"), z.literal("SX"), z.literal("SK"), z.literal("SI"), z.literal("SB"), z.literal("SO"), z.literal("ZA"), z.literal("GS"), z.literal("SS"), z.literal("ES"), z.literal("LK"), z.literal("SD"), z.literal("SR"), z.literal("SJ"), z.literal("SZ"), z.literal("SE"), z.literal("CH"), z.literal("SY"), z.literal("TW"), z.literal("TJ"), z.literal("TZ"), z.literal("TH"), z.literal("TL"), z.literal("TG"), z.literal("TK"), z.literal("TO"), z.literal("TT"), z.literal("TN"), z.literal("TR"), z.literal("TM"), z.literal("TC"), z.literal("TV"), z.literal("UG"), z.literal("UA"), z.literal("AE"), z.literal("GB"), z.literal("UM"), z.literal("US"), z.literal("UY"), z.literal("UZ"), z.literal("VU"), z.literal("VE"), z.literal("VN"), z.literal("VG"), z.literal("VI"), z.literal("WF"), z.literal("EH"), z.literal("YE"), z.literal("ZM"), z.literal("ZW"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_artist/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema2();
    var getGetAlbumsSchema = require_operation_get_albums_schema();
    var getGetRelatedArtistsSchema = require_operation_get_related_artists_schema();
    var getGetTopTracksSchema = require_operation_get_top_tracks_schema();
    var getSearchSchema = require_operation_search_schema2();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "addSongToQueue" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAlbumsSchema({ ...helpers, parameters: effectiveParams }),
        getGetRelatedArtistsSchema({ ...helpers, parameters: effectiveParams }),
        getGetTopTracksSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_library/operation_get_liked_tracks.schema.js
var require_operation_get_liked_tracks_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_library/operation_get_liked_tracks.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("library"),
          operation: z.literal("getLikedTracks"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_library/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_library/index.schema.js"(exports2, module2) {
    var getGetLikedTracksSchema = require_operation_get_liked_tracks_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "addSongToQueue" } : parameters;
      return getGetLikedTracksSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_my_data/operation_get_following_artists.schema.js
var require_operation_get_following_artists_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_my_data/operation_get_following_artists.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("myData"),
          operation: z.literal("getFollowingArtists"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_my_data/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_my_data/index.schema.js"(exports2, module2) {
    var getGetFollowingArtistsSchema = require_operation_get_following_artists_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "addSongToQueue" } : parameters;
      return getGetFollowingArtistsSchema({ ...helpers, parameters: effectiveParams });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_add_song_to_queue.schema.js
var require_operation_add_song_to_queue_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_add_song_to_queue.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("player").default("player"),
          operation: z.literal("addSongToQueue").default("addSongToQueue"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_currently_playing.schema.js
var require_operation_currently_playing_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_currently_playing.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("player").default("player"),
          operation: z.literal("currentlyPlaying")
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_next_song.schema.js
var require_operation_next_song_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_next_song.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("player").default("player"),
          operation: z.literal("nextSong")
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_pause.schema.js
var require_operation_pause_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_pause.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("player").default("player"),
          operation: z.literal("pause")
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_previous_song.schema.js
var require_operation_previous_song_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_previous_song.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("player").default("player"),
          operation: z.literal("previousSong")
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_recently_played.schema.js
var require_operation_recently_played_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_recently_played.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("player").default("player"),
          operation: z.literal("recentlyPlayed"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_resume.schema.js
var require_operation_resume_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_resume.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("player").default("player"),
          operation: z.literal("resume")
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_start_music.schema.js
var require_operation_start_music_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_start_music.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("player").default("player"),
          operation: z.literal("startMusic"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_volume.schema.js
var require_operation_volume_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/operation_volume.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("player").default("player"),
          operation: z.literal("volume"),
          volumePercent: numberOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_player/index.schema.js"(exports2, module2) {
    var getAddSongToQueueSchema = require_operation_add_song_to_queue_schema();
    var getCurrentlyPlayingSchema = require_operation_currently_playing_schema();
    var getNextSongSchema = require_operation_next_song_schema();
    var getPauseSchema = require_operation_pause_schema();
    var getPreviousSongSchema = require_operation_previous_song_schema();
    var getRecentlyPlayedSchema = require_operation_recently_played_schema();
    var getResumeSchema = require_operation_resume_schema();
    var getStartMusicSchema = require_operation_start_music_schema();
    var getVolumeSchema = require_operation_volume_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "addSongToQueue" } : parameters;
      return z.union([
        getAddSongToQueueSchema({ ...helpers, parameters: effectiveParams }),
        getCurrentlyPlayingSchema({ ...helpers, parameters: effectiveParams }),
        getNextSongSchema({ ...helpers, parameters: effectiveParams }),
        getPauseSchema({ ...helpers, parameters: effectiveParams }),
        getPreviousSongSchema({ ...helpers, parameters: effectiveParams }),
        getRecentlyPlayedSchema({ ...helpers, parameters: effectiveParams }),
        getResumeSchema({ ...helpers, parameters: effectiveParams }),
        getStartMusicSchema({ ...helpers, parameters: effectiveParams }),
        getVolumeSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_add.schema.js
var require_operation_add_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_add.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("playlist"),
          operation: z.literal("add"),
          id: stringOrExpression.optional(),
          trackID: stringOrExpression.optional(),
          additionalFields: z.object({ position: numberOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("playlist"),
          operation: z.literal("create"),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ description: stringOrExpression.optional(), public: booleanOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("playlist"),
          operation: z.literal("delete"),
          id: stringOrExpression.optional(),
          trackID: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("playlist"),
          operation: z.literal("get"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_get_tracks.schema.js
var require_operation_get_tracks_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_get_tracks.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("playlist"),
          operation: z.literal("getTracks"),
          id: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_get_user_playlists.schema.js
var require_operation_get_user_playlists_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_get_user_playlists.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("playlist"),
          operation: z.literal("getUserPlaylists"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_search.schema.js
var require_operation_search_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("playlist"),
          operation: z.literal("search"),
          query: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ market: z.union([z.literal("AF"), z.literal("AX"), z.literal("AL"), z.literal("DZ"), z.literal("AS"), z.literal("AD"), z.literal("AO"), z.literal("AI"), z.literal("AQ"), z.literal("AG"), z.literal("AR"), z.literal("AM"), z.literal("AW"), z.literal("AU"), z.literal("AT"), z.literal("AZ"), z.literal("BS"), z.literal("BH"), z.literal("BD"), z.literal("BB"), z.literal("BY"), z.literal("BE"), z.literal("BZ"), z.literal("BJ"), z.literal("BM"), z.literal("BT"), z.literal("BO"), z.literal("BQ"), z.literal("BA"), z.literal("BW"), z.literal("BV"), z.literal("BR"), z.literal("IO"), z.literal("BN"), z.literal("BG"), z.literal("BF"), z.literal("BI"), z.literal("CV"), z.literal("KH"), z.literal("CM"), z.literal("CA"), z.literal("KY"), z.literal("CF"), z.literal("TD"), z.literal("CL"), z.literal("CN"), z.literal("CX"), z.literal("CC"), z.literal("CO"), z.literal("KM"), z.literal("CD"), z.literal("CG"), z.literal("CK"), z.literal("CR"), z.literal("CI"), z.literal("HR"), z.literal("CU"), z.literal("CW"), z.literal("CY"), z.literal("CZ"), z.literal("DK"), z.literal("DJ"), z.literal("DM"), z.literal("DO"), z.literal("EC"), z.literal("EG"), z.literal("SV"), z.literal("GQ"), z.literal("ER"), z.literal("EE"), z.literal("ET"), z.literal("FK"), z.literal("FO"), z.literal("FJ"), z.literal("FI"), z.literal("FR"), z.literal("GF"), z.literal("PF"), z.literal("TF"), z.literal("GA"), z.literal("GM"), z.literal("GE"), z.literal("DE"), z.literal("GH"), z.literal("GI"), z.literal("GR"), z.literal("GL"), z.literal("GD"), z.literal("GP"), z.literal("GU"), z.literal("GT"), z.literal("GG"), z.literal("GN"), z.literal("GW"), z.literal("GY"), z.literal("HT"), z.literal("HM"), z.literal("VA"), z.literal("HN"), z.literal("HK"), z.literal("HU"), z.literal("IS"), z.literal("IN"), z.literal("ID"), z.literal("IR"), z.literal("IQ"), z.literal("IE"), z.literal("IM"), z.literal("IL"), z.literal("IT"), z.literal("JM"), z.literal("JP"), z.literal("JE"), z.literal("JO"), z.literal("KZ"), z.literal("KE"), z.literal("KI"), z.literal("KP"), z.literal("KR"), z.literal("KW"), z.literal("KG"), z.literal("LA"), z.literal("LV"), z.literal("LB"), z.literal("LS"), z.literal("LR"), z.literal("LY"), z.literal("LI"), z.literal("LT"), z.literal("LU"), z.literal("MO"), z.literal("MK"), z.literal("MG"), z.literal("MW"), z.literal("MY"), z.literal("MV"), z.literal("ML"), z.literal("MT"), z.literal("MH"), z.literal("MQ"), z.literal("MR"), z.literal("MU"), z.literal("YT"), z.literal("MX"), z.literal("FM"), z.literal("MD"), z.literal("MC"), z.literal("MN"), z.literal("ME"), z.literal("MS"), z.literal("MA"), z.literal("MZ"), z.literal("MM"), z.literal("NA"), z.literal("NR"), z.literal("NP"), z.literal("NL"), z.literal("NC"), z.literal("NZ"), z.literal("NI"), z.literal("NE"), z.literal("NG"), z.literal("NU"), z.literal("NF"), z.literal("MP"), z.literal("NO"), z.literal("OM"), z.literal("PK"), z.literal("PW"), z.literal("PS"), z.literal("PA"), z.literal("PG"), z.literal("PY"), z.literal("PE"), z.literal("PH"), z.literal("PN"), z.literal("PL"), z.literal("PT"), z.literal("PR"), z.literal("QA"), z.literal("RE"), z.literal("RO"), z.literal("RU"), z.literal("RW"), z.literal("BL"), z.literal("SH"), z.literal("KN"), z.literal("LC"), z.literal("MF"), z.literal("PM"), z.literal("VC"), z.literal("WS"), z.literal("SM"), z.literal("ST"), z.literal("SA"), z.literal("SN"), z.literal("RS"), z.literal("SC"), z.literal("SL"), z.literal("SG"), z.literal("SX"), z.literal("SK"), z.literal("SI"), z.literal("SB"), z.literal("SO"), z.literal("ZA"), z.literal("GS"), z.literal("SS"), z.literal("ES"), z.literal("LK"), z.literal("SD"), z.literal("SR"), z.literal("SJ"), z.literal("SZ"), z.literal("SE"), z.literal("CH"), z.literal("SY"), z.literal("TW"), z.literal("TJ"), z.literal("TZ"), z.literal("TH"), z.literal("TL"), z.literal("TG"), z.literal("TK"), z.literal("TO"), z.literal("TT"), z.literal("TN"), z.literal("TR"), z.literal("TM"), z.literal("TC"), z.literal("TV"), z.literal("UG"), z.literal("UA"), z.literal("AE"), z.literal("GB"), z.literal("UM"), z.literal("US"), z.literal("UY"), z.literal("UZ"), z.literal("VU"), z.literal("VE"), z.literal("VN"), z.literal("VG"), z.literal("VI"), z.literal("WF"), z.literal("EH"), z.literal("YE"), z.literal("ZM"), z.literal("ZW"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_playlist/index.schema.js"(exports2, module2) {
    var getAddSchema = require_operation_add_schema();
    var getCreateSchema = require_operation_create_schema();
    var getDeleteSchema = require_operation_delete_schema();
    var getGetSchema = require_operation_get_schema3();
    var getGetTracksSchema = require_operation_get_tracks_schema2();
    var getGetUserPlaylistsSchema = require_operation_get_user_playlists_schema();
    var getSearchSchema = require_operation_search_schema3();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "addSongToQueue" } : parameters;
      return z.union([
        getAddSchema({ ...helpers, parameters: effectiveParams }),
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetTracksSchema({ ...helpers, parameters: effectiveParams }),
        getGetUserPlaylistsSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_track/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_track/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("track"),
          operation: z.literal("get"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_track/operation_get_audio_features.schema.js
var require_operation_get_audio_features_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_track/operation_get_audio_features.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("track"),
          operation: z.literal("getAudioFeatures"),
          id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_track/operation_search.schema.js
var require_operation_search_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_track/operation_search.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("track"),
          operation: z.literal("search"),
          id: stringOrExpression.optional(),
          query: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ market: z.union([z.literal("AF"), z.literal("AX"), z.literal("AL"), z.literal("DZ"), z.literal("AS"), z.literal("AD"), z.literal("AO"), z.literal("AI"), z.literal("AQ"), z.literal("AG"), z.literal("AR"), z.literal("AM"), z.literal("AW"), z.literal("AU"), z.literal("AT"), z.literal("AZ"), z.literal("BS"), z.literal("BH"), z.literal("BD"), z.literal("BB"), z.literal("BY"), z.literal("BE"), z.literal("BZ"), z.literal("BJ"), z.literal("BM"), z.literal("BT"), z.literal("BO"), z.literal("BQ"), z.literal("BA"), z.literal("BW"), z.literal("BV"), z.literal("BR"), z.literal("IO"), z.literal("BN"), z.literal("BG"), z.literal("BF"), z.literal("BI"), z.literal("CV"), z.literal("KH"), z.literal("CM"), z.literal("CA"), z.literal("KY"), z.literal("CF"), z.literal("TD"), z.literal("CL"), z.literal("CN"), z.literal("CX"), z.literal("CC"), z.literal("CO"), z.literal("KM"), z.literal("CD"), z.literal("CG"), z.literal("CK"), z.literal("CR"), z.literal("CI"), z.literal("HR"), z.literal("CU"), z.literal("CW"), z.literal("CY"), z.literal("CZ"), z.literal("DK"), z.literal("DJ"), z.literal("DM"), z.literal("DO"), z.literal("EC"), z.literal("EG"), z.literal("SV"), z.literal("GQ"), z.literal("ER"), z.literal("EE"), z.literal("ET"), z.literal("FK"), z.literal("FO"), z.literal("FJ"), z.literal("FI"), z.literal("FR"), z.literal("GF"), z.literal("PF"), z.literal("TF"), z.literal("GA"), z.literal("GM"), z.literal("GE"), z.literal("DE"), z.literal("GH"), z.literal("GI"), z.literal("GR"), z.literal("GL"), z.literal("GD"), z.literal("GP"), z.literal("GU"), z.literal("GT"), z.literal("GG"), z.literal("GN"), z.literal("GW"), z.literal("GY"), z.literal("HT"), z.literal("HM"), z.literal("VA"), z.literal("HN"), z.literal("HK"), z.literal("HU"), z.literal("IS"), z.literal("IN"), z.literal("ID"), z.literal("IR"), z.literal("IQ"), z.literal("IE"), z.literal("IM"), z.literal("IL"), z.literal("IT"), z.literal("JM"), z.literal("JP"), z.literal("JE"), z.literal("JO"), z.literal("KZ"), z.literal("KE"), z.literal("KI"), z.literal("KP"), z.literal("KR"), z.literal("KW"), z.literal("KG"), z.literal("LA"), z.literal("LV"), z.literal("LB"), z.literal("LS"), z.literal("LR"), z.literal("LY"), z.literal("LI"), z.literal("LT"), z.literal("LU"), z.literal("MO"), z.literal("MK"), z.literal("MG"), z.literal("MW"), z.literal("MY"), z.literal("MV"), z.literal("ML"), z.literal("MT"), z.literal("MH"), z.literal("MQ"), z.literal("MR"), z.literal("MU"), z.literal("YT"), z.literal("MX"), z.literal("FM"), z.literal("MD"), z.literal("MC"), z.literal("MN"), z.literal("ME"), z.literal("MS"), z.literal("MA"), z.literal("MZ"), z.literal("MM"), z.literal("NA"), z.literal("NR"), z.literal("NP"), z.literal("NL"), z.literal("NC"), z.literal("NZ"), z.literal("NI"), z.literal("NE"), z.literal("NG"), z.literal("NU"), z.literal("NF"), z.literal("MP"), z.literal("NO"), z.literal("OM"), z.literal("PK"), z.literal("PW"), z.literal("PS"), z.literal("PA"), z.literal("PG"), z.literal("PY"), z.literal("PE"), z.literal("PH"), z.literal("PN"), z.literal("PL"), z.literal("PT"), z.literal("PR"), z.literal("QA"), z.literal("RE"), z.literal("RO"), z.literal("RU"), z.literal("RW"), z.literal("BL"), z.literal("SH"), z.literal("KN"), z.literal("LC"), z.literal("MF"), z.literal("PM"), z.literal("VC"), z.literal("WS"), z.literal("SM"), z.literal("ST"), z.literal("SA"), z.literal("SN"), z.literal("RS"), z.literal("SC"), z.literal("SL"), z.literal("SG"), z.literal("SX"), z.literal("SK"), z.literal("SI"), z.literal("SB"), z.literal("SO"), z.literal("ZA"), z.literal("GS"), z.literal("SS"), z.literal("ES"), z.literal("LK"), z.literal("SD"), z.literal("SR"), z.literal("SJ"), z.literal("SZ"), z.literal("SE"), z.literal("CH"), z.literal("SY"), z.literal("TW"), z.literal("TJ"), z.literal("TZ"), z.literal("TH"), z.literal("TL"), z.literal("TG"), z.literal("TK"), z.literal("TO"), z.literal("TT"), z.literal("TN"), z.literal("TR"), z.literal("TM"), z.literal("TC"), z.literal("TV"), z.literal("UG"), z.literal("UA"), z.literal("AE"), z.literal("GB"), z.literal("UM"), z.literal("US"), z.literal("UY"), z.literal("UZ"), z.literal("VU"), z.literal("VE"), z.literal("VN"), z.literal("VG"), z.literal("VI"), z.literal("WF"), z.literal("EH"), z.literal("YE"), z.literal("ZM"), z.literal("ZW"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_track/index.schema.js
var require_index_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/resource_track/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema4();
    var getGetAudioFeaturesSchema = require_operation_get_audio_features_schema();
    var getSearchSchema = require_operation_search_schema4();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "addSongToQueue" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAudioFeaturesSchema({ ...helpers, parameters: effectiveParams }),
        getSearchSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/spotify/v1/index.schema.js
var getAlbumSchema = require_index_schema();
var getArtistSchema = require_index_schema2();
var getLibrarySchema = require_index_schema3();
var getMyDataSchema = require_index_schema4();
var getPlayerSchema = require_index_schema5();
var getPlaylistSchema = require_index_schema6();
var getTrackSchema = require_index_schema7();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "player" } : parameters;
  return z.union([
    getAlbumSchema({ ...helpers, parameters: effectiveParams }),
    getArtistSchema({ ...helpers, parameters: effectiveParams }),
    getLibrarySchema({ ...helpers, parameters: effectiveParams }),
    getMyDataSchema({ ...helpers, parameters: effectiveParams }),
    getPlayerSchema({ ...helpers, parameters: effectiveParams }),
    getPlaylistSchema({ ...helpers, parameters: effectiveParams }),
    getTrackSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
