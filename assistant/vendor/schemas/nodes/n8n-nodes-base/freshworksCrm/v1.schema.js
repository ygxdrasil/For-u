var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/operation_create.schema.js
var require_operation_create_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("create").default("create"),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ address: stringOrExpression.optional(), annual_revenue: numberOrExpression.optional(), business_type_id: stringOrExpression.optional(), city: stringOrExpression.optional(), country: stringOrExpression.optional(), facebook: stringOrExpression.optional(), industry_type_id: stringOrExpression.optional(), linkedin: stringOrExpression.optional(), number_of_employees: numberOrExpression.optional(), owner_id: stringOrExpression.optional(), parent_sales_account_id: stringOrExpression.optional(), phone: stringOrExpression.optional(), state: stringOrExpression.optional(), territory_id: stringOrExpression.optional(), twitter: stringOrExpression.optional(), website: stringOrExpression.optional(), zipcode: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/operation_delete.schema.js
var require_operation_delete_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("delete"),
          accountId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/operation_get.schema.js
var require_operation_get_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("get"),
          accountId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/operation_get_all.schema.js
var require_operation_get_all_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("getAll"),
          view: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/operation_update.schema.js
var require_operation_update_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("account").default("account"),
          operation: z.literal("update"),
          accountId: stringOrExpression.optional(),
          updateFields: z.object({ address: stringOrExpression.optional(), annual_revenue: numberOrExpression.optional(), business_type_id: stringOrExpression.optional(), city: stringOrExpression.optional(), country: stringOrExpression.optional(), facebook: stringOrExpression.optional(), industry_type_id: stringOrExpression.optional(), linkedin: stringOrExpression.optional(), name: stringOrExpression.optional(), number_of_employees: numberOrExpression.optional(), owner_id: stringOrExpression.optional(), parent_sales_account_id: stringOrExpression.optional(), phone: stringOrExpression.optional(), state: stringOrExpression.optional(), territory_id: stringOrExpression.optional(), twitter: stringOrExpression.optional(), website: stringOrExpression.optional(), zipcode: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/index.schema.js
var require_index_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_account/index.schema.js"(exports2, module2) {
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/operation_create.schema.js
var require_operation_create_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("appointment"),
          operation: z.literal("create").default("create"),
          title: stringOrExpression.optional(),
          fromDate: stringOrExpression.optional(),
          endDate: stringOrExpression.optional(),
          attendees: z.object({ attendee: z.array(z.object({ type: z.union([z.literal("contact"), z.literal("user"), expressionSchema]).optional(), userId: stringOrExpression.optional(), contactId: stringOrExpression.optional() })).optional() }).optional(),
          additionalFields: z.object({ creater_id: stringOrExpression.optional(), is_allday: booleanOrExpression.optional(), latitude: stringOrExpression.optional(), location: stringOrExpression.optional(), longitude: stringOrExpression.optional(), outcome_id: stringOrExpression.optional(), targetable_id: stringOrExpression.optional(), targetable_type: z.union([z.literal("Contact"), z.literal("Deal"), z.literal("SalesAccount"), expressionSchema]).optional(), time_zone: z.union([z.literal("Africa/Abidjan"), z.literal("Africa/Accra"), z.literal("Africa/Addis_Ababa"), z.literal("Africa/Algiers"), z.literal("Africa/Asmara"), z.literal("Africa/Asmera"), z.literal("Africa/Bamako"), z.literal("Africa/Bangui"), z.literal("Africa/Banjul"), z.literal("Africa/Bissau"), z.literal("Africa/Blantyre"), z.literal("Africa/Brazzaville"), z.literal("Africa/Bujumbura"), z.literal("Africa/Cairo"), z.literal("Africa/Casablanca"), z.literal("Africa/Ceuta"), z.literal("Africa/Conakry"), z.literal("Africa/Dakar"), z.literal("Africa/Dar_es_Salaam"), z.literal("Africa/Djibouti"), z.literal("Africa/Douala"), z.literal("Africa/El_Aaiun"), z.literal("Africa/Freetown"), z.literal("Africa/Gaborone"), z.literal("Africa/Harare"), z.literal("Africa/Johannesburg"), z.literal("Africa/Juba"), z.literal("Africa/Kampala"), z.literal("Africa/Khartoum"), z.literal("Africa/Kigali"), z.literal("Africa/Kinshasa"), z.literal("Africa/Lagos"), z.literal("Africa/Libreville"), z.literal("Africa/Lome"), z.literal("Africa/Luanda"), z.literal("Africa/Lubumbashi"), z.literal("Africa/Lusaka"), z.literal("Africa/Malabo"), z.literal("Africa/Maputo"), z.literal("Africa/Maseru"), z.literal("Africa/Mbabane"), z.literal("Africa/Mogadishu"), z.literal("Africa/Monrovia"), z.literal("Africa/Nairobi"), z.literal("Africa/Ndjamena"), z.literal("Africa/Niamey"), z.literal("Africa/Nouakchott"), z.literal("Africa/Ouagadougou"), z.literal("Africa/Porto-Novo"), z.literal("Africa/Sao_Tome"), z.literal("Africa/Timbuktu"), z.literal("Africa/Tripoli"), z.literal("Africa/Tunis"), z.literal("Africa/Windhoek"), z.literal("America/Adak"), z.literal("America/Anchorage"), z.literal("America/Anguilla"), z.literal("America/Antigua"), z.literal("America/Araguaina"), z.literal("America/Argentina/Buenos_Aires"), z.literal("America/Argentina/Catamarca"), z.literal("America/Argentina/ComodRivadavia"), z.literal("America/Argentina/Cordoba"), z.literal("America/Argentina/Jujuy"), z.literal("America/Argentina/La_Rioja"), z.literal("America/Argentina/Mendoza"), z.literal("America/Argentina/Rio_Gallegos"), z.literal("America/Argentina/Salta"), z.literal("America/Argentina/San_Juan"), z.literal("America/Argentina/San_Luis"), z.literal("America/Argentina/Tucuman"), z.literal("America/Argentina/Ushuaia"), z.literal("America/Aruba"), z.literal("America/Asuncion"), z.literal("America/Atikokan"), z.literal("America/Atka"), z.literal("America/Bahia"), z.literal("America/Bahia_Banderas"), z.literal("America/Barbados"), z.literal("America/Belem"), z.literal("America/Belize"), z.literal("America/Blanc-Sablon"), z.literal("America/Boa_Vista"), z.literal("America/Bogota"), z.literal("America/Boise"), z.literal("America/Buenos_Aires"), z.literal("America/Cambridge_Bay"), z.literal("America/Campo_Grande"), z.literal("America/Cancun"), z.literal("America/Caracas"), z.literal("America/Catamarca"), z.literal("America/Cayenne"), z.literal("America/Cayman"), z.literal("America/Chicago"), z.literal("America/Chihuahua"), z.literal("America/Ciudad_Juarez"), z.literal("America/Coral_Harbour"), z.literal("America/Cordoba"), z.literal("America/Costa_Rica"), z.literal("America/Coyhaique"), z.literal("America/Creston"), z.literal("America/Cuiaba"), z.literal("America/Curacao"), z.literal("America/Danmarkshavn"), z.literal("America/Dawson"), z.literal("America/Dawson_Creek"), z.literal("America/Denver"), z.literal("America/Detroit"), z.literal("America/Dominica"), z.literal("America/Edmonton"), z.literal("America/Eirunepe"), z.literal("America/El_Salvador"), z.literal("America/Ensenada"), z.literal("America/Fort_Nelson"), z.literal("America/Fort_Wayne"), z.literal("America/Fortaleza"), z.literal("America/Glace_Bay"), z.literal("America/Godthab"), z.literal("America/Goose_Bay"), z.literal("America/Grand_Turk"), z.literal("America/Grenada"), z.literal("America/Guadeloupe"), z.literal("America/Guatemala"), z.literal("America/Guayaquil"), z.literal("America/Guyana"), z.literal("America/Halifax"), z.literal("America/Havana"), z.literal("America/Hermosillo"), z.literal("America/Indiana/Indianapolis"), z.literal("America/Indiana/Knox"), z.literal("America/Indiana/Marengo"), z.literal("America/Indiana/Petersburg"), z.literal("America/Indiana/Tell_City"), z.literal("America/Indiana/Vevay"), z.literal("America/Indiana/Vincennes"), z.literal("America/Indiana/Winamac"), z.literal("America/Indianapolis"), z.literal("America/Inuvik"), z.literal("America/Iqaluit"), z.literal("America/Jamaica"), z.literal("America/Jujuy"), z.literal("America/Juneau"), z.literal("America/Kentucky/Louisville"), z.literal("America/Kentucky/Monticello"), z.literal("America/Knox_IN"), z.literal("America/Kralendijk"), z.literal("America/La_Paz"), z.literal("America/Lima"), z.literal("America/Los_Angeles"), z.literal("America/Louisville"), z.literal("America/Lower_Princes"), z.literal("America/Maceio"), z.literal("America/Managua"), z.literal("America/Manaus"), z.literal("America/Marigot"), z.literal("America/Martinique"), z.literal("America/Matamoros"), z.literal("America/Mazatlan"), z.literal("America/Mendoza"), z.literal("America/Menominee"), z.literal("America/Merida"), z.literal("America/Metlakatla"), z.literal("America/Mexico_City"), z.literal("America/Miquelon"), z.literal("America/Moncton"), z.literal("America/Monterrey"), z.literal("America/Montevideo"), z.literal("America/Montreal"), z.literal("America/Montserrat"), z.literal("America/Nassau"), z.literal("America/New_York"), z.literal("America/Nipigon"), z.literal("America/Nome"), z.literal("America/Noronha"), z.literal("America/North_Dakota/Beulah"), z.literal("America/North_Dakota/Center"), z.literal("America/North_Dakota/New_Salem"), z.literal("America/Nuuk"), z.literal("America/Ojinaga"), z.literal("America/Panama"), z.literal("America/Pangnirtung"), z.literal("America/Paramaribo"), z.literal("America/Phoenix"), z.literal("America/Port-au-Prince"), z.literal("America/Port_of_Spain"), z.literal("America/Porto_Acre"), z.literal("America/Porto_Velho"), z.literal("America/Puerto_Rico"), z.literal("America/Punta_Arenas"), z.literal("America/Rainy_River"), z.literal("America/Rankin_Inlet"), z.literal("America/Recife"), z.literal("America/Regina"), z.literal("America/Resolute"), z.literal("America/Rio_Branco"), z.literal("America/Rosario"), z.literal("America/Santa_Isabel"), z.literal("America/Santarem"), z.literal("America/Santiago"), z.literal("America/Santo_Domingo"), z.literal("America/Sao_Paulo"), z.literal("America/Scoresbysund"), z.literal("America/Shiprock"), z.literal("America/Sitka"), z.literal("America/St_Barthelemy"), z.literal("America/St_Johns"), z.literal("America/St_Kitts"), z.literal("America/St_Lucia"), z.literal("America/St_Thomas"), z.literal("America/St_Vincent"), z.literal("America/Swift_Current"), z.literal("America/Tegucigalpa"), z.literal("America/Thule"), z.literal("America/Thunder_Bay"), z.literal("America/Tijuana"), z.literal("America/Toronto"), z.literal("America/Tortola"), z.literal("America/Vancouver"), z.literal("America/Virgin"), z.literal("America/Whitehorse"), z.literal("America/Winnipeg"), z.literal("America/Yakutat"), z.literal("America/Yellowknife"), z.literal("Antarctica/Casey"), z.literal("Antarctica/Davis"), z.literal("Antarctica/DumontDUrville"), z.literal("Antarctica/Macquarie"), z.literal("Antarctica/Mawson"), z.literal("Antarctica/McMurdo"), z.literal("Antarctica/Palmer"), z.literal("Antarctica/Rothera"), z.literal("Antarctica/South_Pole"), z.literal("Antarctica/Syowa"), z.literal("Antarctica/Troll"), z.literal("Antarctica/Vostok"), z.literal("Arctic/Longyearbyen"), z.literal("Asia/Aden"), z.literal("Asia/Almaty"), z.literal("Asia/Amman"), z.literal("Asia/Anadyr"), z.literal("Asia/Aqtau"), z.literal("Asia/Aqtobe"), z.literal("Asia/Ashgabat"), z.literal("Asia/Ashkhabad"), z.literal("Asia/Atyrau"), z.literal("Asia/Baghdad"), z.literal("Asia/Bahrain"), z.literal("Asia/Baku"), z.literal("Asia/Bangkok"), z.literal("Asia/Barnaul"), z.literal("Asia/Beirut"), z.literal("Asia/Bishkek"), z.literal("Asia/Brunei"), z.literal("Asia/Calcutta"), z.literal("Asia/Chita"), z.literal("Asia/Choibalsan"), z.literal("Asia/Chongqing"), z.literal("Asia/Chungking"), z.literal("Asia/Colombo"), z.literal("Asia/Dacca"), z.literal("Asia/Damascus"), z.literal("Asia/Dhaka"), z.literal("Asia/Dili"), z.literal("Asia/Dubai"), z.literal("Asia/Dushanbe"), z.literal("Asia/Famagusta"), z.literal("Asia/Gaza"), z.literal("Asia/Harbin"), z.literal("Asia/Hebron"), z.literal("Asia/Ho_Chi_Minh"), z.literal("Asia/Hong_Kong"), z.literal("Asia/Hovd"), z.literal("Asia/Irkutsk"), z.literal("Asia/Istanbul"), z.literal("Asia/Jakarta"), z.literal("Asia/Jayapura"), z.literal("Asia/Jerusalem"), z.literal("Asia/Kabul"), z.literal("Asia/Kamchatka"), z.literal("Asia/Karachi"), z.literal("Asia/Kashgar"), z.literal("Asia/Kathmandu"), z.literal("Asia/Katmandu"), z.literal("Asia/Khandyga"), z.literal("Asia/Kolkata"), z.literal("Asia/Krasnoyarsk"), z.literal("Asia/Kuala_Lumpur"), z.literal("Asia/Kuching"), z.literal("Asia/Kuwait"), z.literal("Asia/Macao"), z.literal("Asia/Macau"), z.literal("Asia/Magadan"), z.literal("Asia/Makassar"), z.literal("Asia/Manila"), z.literal("Asia/Muscat"), z.literal("Asia/Nicosia"), z.literal("Asia/Novokuznetsk"), z.literal("Asia/Novosibirsk"), z.literal("Asia/Omsk"), z.literal("Asia/Oral"), z.literal("Asia/Phnom_Penh"), z.literal("Asia/Pontianak"), z.literal("Asia/Pyongyang"), z.literal("Asia/Qatar"), z.literal("Asia/Qostanay"), z.literal("Asia/Qyzylorda"), z.literal("Asia/Rangoon"), z.literal("Asia/Riyadh"), z.literal("Asia/Saigon"), z.literal("Asia/Sakhalin"), z.literal("Asia/Samarkand"), z.literal("Asia/Seoul"), z.literal("Asia/Shanghai"), z.literal("Asia/Singapore"), z.literal("Asia/Srednekolymsk"), z.literal("Asia/Taipei"), z.literal("Asia/Tashkent"), z.literal("Asia/Tbilisi"), z.literal("Asia/Tehran"), z.literal("Asia/Tel_Aviv"), z.literal("Asia/Thimbu"), z.literal("Asia/Thimphu"), z.literal("Asia/Tokyo"), z.literal("Asia/Tomsk"), z.literal("Asia/Ujung_Pandang"), z.literal("Asia/Ulaanbaatar"), z.literal("Asia/Ulan_Bator"), z.literal("Asia/Urumqi"), z.literal("Asia/Ust-Nera"), z.literal("Asia/Vientiane"), z.literal("Asia/Vladivostok"), z.literal("Asia/Yakutsk"), z.literal("Asia/Yangon"), z.literal("Asia/Yekaterinburg"), z.literal("Asia/Yerevan"), z.literal("Atlantic/Azores"), z.literal("Atlantic/Bermuda"), z.literal("Atlantic/Canary"), z.literal("Atlantic/Cape_Verde"), z.literal("Atlantic/Faeroe"), z.literal("Atlantic/Faroe"), z.literal("Atlantic/Jan_Mayen"), z.literal("Atlantic/Madeira"), z.literal("Atlantic/Reykjavik"), z.literal("Atlantic/South_Georgia"), z.literal("Atlantic/St_Helena"), z.literal("Atlantic/Stanley"), z.literal("Australia/ACT"), z.literal("Australia/Adelaide"), z.literal("Australia/Brisbane"), z.literal("Australia/Broken_Hill"), z.literal("Australia/Canberra"), z.literal("Australia/Currie"), z.literal("Australia/Darwin"), z.literal("Australia/Eucla"), z.literal("Australia/Hobart"), z.literal("Australia/LHI"), z.literal("Australia/Lindeman"), z.literal("Australia/Lord_Howe"), z.literal("Australia/Melbourne"), z.literal("Australia/NSW"), z.literal("Australia/North"), z.literal("Australia/Perth"), z.literal("Australia/Queensland"), z.literal("Australia/South"), z.literal("Australia/Sydney"), z.literal("Australia/Tasmania"), z.literal("Australia/Victoria"), z.literal("Australia/West"), z.literal("Australia/Yancowinna"), z.literal("Brazil/Acre"), z.literal("Brazil/DeNoronha"), z.literal("Brazil/East"), z.literal("Brazil/West"), z.literal("CET"), z.literal("CST6CDT"), z.literal("Canada/Atlantic"), z.literal("Canada/Central"), z.literal("Canada/Eastern"), z.literal("Canada/Mountain"), z.literal("Canada/Newfoundland"), z.literal("Canada/Pacific"), z.literal("Canada/Saskatchewan"), z.literal("Canada/Yukon"), z.literal("Chile/Continental"), z.literal("Chile/EasterIsland"), z.literal("Cuba"), z.literal("EET"), z.literal("EST"), z.literal("EST5EDT"), z.literal("Egypt"), z.literal("Eire"), z.literal("Etc/GMT"), z.literal("Etc/GMT+0"), z.literal("Etc/GMT+1"), z.literal("Etc/GMT+10"), z.literal("Etc/GMT+11"), z.literal("Etc/GMT+12"), z.literal("Etc/GMT+2"), z.literal("Etc/GMT+3"), z.literal("Etc/GMT+4"), z.literal("Etc/GMT+5"), z.literal("Etc/GMT+6"), z.literal("Etc/GMT+7"), z.literal("Etc/GMT+8"), z.literal("Etc/GMT+9"), z.literal("Etc/GMT-0"), z.literal("Etc/GMT-1"), z.literal("Etc/GMT-10"), z.literal("Etc/GMT-11"), z.literal("Etc/GMT-12"), z.literal("Etc/GMT-13"), z.literal("Etc/GMT-14"), z.literal("Etc/GMT-2"), z.literal("Etc/GMT-3"), z.literal("Etc/GMT-4"), z.literal("Etc/GMT-5"), z.literal("Etc/GMT-6"), z.literal("Etc/GMT-7"), z.literal("Etc/GMT-8"), z.literal("Etc/GMT-9"), z.literal("Etc/GMT0"), z.literal("Etc/Greenwich"), z.literal("Etc/UCT"), z.literal("Etc/UTC"), z.literal("Etc/Universal"), z.literal("Etc/Zulu"), z.literal("Europe/Amsterdam"), z.literal("Europe/Andorra"), z.literal("Europe/Astrakhan"), z.literal("Europe/Athens"), z.literal("Europe/Belfast"), z.literal("Europe/Belgrade"), z.literal("Europe/Berlin"), z.literal("Europe/Bratislava"), z.literal("Europe/Brussels"), z.literal("Europe/Bucharest"), z.literal("Europe/Budapest"), z.literal("Europe/Busingen"), z.literal("Europe/Chisinau"), z.literal("Europe/Copenhagen"), z.literal("Europe/Dublin"), z.literal("Europe/Gibraltar"), z.literal("Europe/Guernsey"), z.literal("Europe/Helsinki"), z.literal("Europe/Isle_of_Man"), z.literal("Europe/Istanbul"), z.literal("Europe/Jersey"), z.literal("Europe/Kaliningrad"), z.literal("Europe/Kiev"), z.literal("Europe/Kirov"), z.literal("Europe/Kyiv"), z.literal("Europe/Lisbon"), z.literal("Europe/Ljubljana"), z.literal("Europe/London"), z.literal("Europe/Luxembourg"), z.literal("Europe/Madrid"), z.literal("Europe/Malta"), z.literal("Europe/Mariehamn"), z.literal("Europe/Minsk"), z.literal("Europe/Monaco"), z.literal("Europe/Moscow"), z.literal("Europe/Nicosia"), z.literal("Europe/Oslo"), z.literal("Europe/Paris"), z.literal("Europe/Podgorica"), z.literal("Europe/Prague"), z.literal("Europe/Riga"), z.literal("Europe/Rome"), z.literal("Europe/Samara"), z.literal("Europe/San_Marino"), z.literal("Europe/Sarajevo"), z.literal("Europe/Saratov"), z.literal("Europe/Simferopol"), z.literal("Europe/Skopje"), z.literal("Europe/Sofia"), z.literal("Europe/Stockholm"), z.literal("Europe/Tallinn"), z.literal("Europe/Tirane"), z.literal("Europe/Tiraspol"), z.literal("Europe/Ulyanovsk"), z.literal("Europe/Uzhgorod"), z.literal("Europe/Vaduz"), z.literal("Europe/Vatican"), z.literal("Europe/Vienna"), z.literal("Europe/Vilnius"), z.literal("Europe/Volgograd"), z.literal("Europe/Warsaw"), z.literal("Europe/Zagreb"), z.literal("Europe/Zaporozhye"), z.literal("Europe/Zurich"), z.literal("GB"), z.literal("GB-Eire"), z.literal("GMT"), z.literal("GMT+0"), z.literal("GMT-0"), z.literal("GMT0"), z.literal("Greenwich"), z.literal("HST"), z.literal("Hongkong"), z.literal("Iceland"), z.literal("Indian/Antananarivo"), z.literal("Indian/Chagos"), z.literal("Indian/Christmas"), z.literal("Indian/Cocos"), z.literal("Indian/Comoro"), z.literal("Indian/Kerguelen"), z.literal("Indian/Mahe"), z.literal("Indian/Maldives"), z.literal("Indian/Mauritius"), z.literal("Indian/Mayotte"), z.literal("Indian/Reunion"), z.literal("Iran"), z.literal("Israel"), z.literal("Jamaica"), z.literal("Japan"), z.literal("Kwajalein"), z.literal("Libya"), z.literal("MET"), z.literal("MST"), z.literal("MST7MDT"), z.literal("Mexico/BajaNorte"), z.literal("Mexico/BajaSur"), z.literal("Mexico/General"), z.literal("NZ"), z.literal("NZ-CHAT"), z.literal("Navajo"), z.literal("PRC"), z.literal("PST8PDT"), z.literal("Pacific/Apia"), z.literal("Pacific/Auckland"), z.literal("Pacific/Bougainville"), z.literal("Pacific/Chatham"), z.literal("Pacific/Chuuk"), z.literal("Pacific/Easter"), z.literal("Pacific/Efate"), z.literal("Pacific/Enderbury"), z.literal("Pacific/Fakaofo"), z.literal("Pacific/Fiji"), z.literal("Pacific/Funafuti"), z.literal("Pacific/Galapagos"), z.literal("Pacific/Gambier"), z.literal("Pacific/Guadalcanal"), z.literal("Pacific/Guam"), z.literal("Pacific/Honolulu"), z.literal("Pacific/Johnston"), z.literal("Pacific/Kanton"), z.literal("Pacific/Kiritimati"), z.literal("Pacific/Kosrae"), z.literal("Pacific/Kwajalein"), z.literal("Pacific/Majuro"), z.literal("Pacific/Marquesas"), z.literal("Pacific/Midway"), z.literal("Pacific/Nauru"), z.literal("Pacific/Niue"), z.literal("Pacific/Norfolk"), z.literal("Pacific/Noumea"), z.literal("Pacific/Pago_Pago"), z.literal("Pacific/Palau"), z.literal("Pacific/Pitcairn"), z.literal("Pacific/Pohnpei"), z.literal("Pacific/Ponape"), z.literal("Pacific/Port_Moresby"), z.literal("Pacific/Rarotonga"), z.literal("Pacific/Saipan"), z.literal("Pacific/Samoa"), z.literal("Pacific/Tahiti"), z.literal("Pacific/Tarawa"), z.literal("Pacific/Tongatapu"), z.literal("Pacific/Truk"), z.literal("Pacific/Wake"), z.literal("Pacific/Wallis"), z.literal("Pacific/Yap"), z.literal("Poland"), z.literal("Portugal"), z.literal("ROC"), z.literal("ROK"), z.literal("Singapore"), z.literal("Turkey"), z.literal("UCT"), z.literal("US/Alaska"), z.literal("US/Aleutian"), z.literal("US/Arizona"), z.literal("US/Central"), z.literal("US/East-Indiana"), z.literal("US/Eastern"), z.literal("US/Hawaii"), z.literal("US/Indiana-Starke"), z.literal("US/Michigan"), z.literal("US/Mountain"), z.literal("US/Pacific"), z.literal("US/Samoa"), z.literal("UTC"), z.literal("Universal"), z.literal("W-SU"), z.literal("WET"), z.literal("Zulu"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/operation_delete.schema.js
var require_operation_delete_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("appointment"),
          operation: z.literal("delete"),
          appointmentId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/operation_get.schema.js
var require_operation_get_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("appointment"),
          operation: z.literal("get"),
          appointmentId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/operation_get_all.schema.js
var require_operation_get_all_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("appointment"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ include: z.union([z.literal("appointment_attendees"), z.literal("creater"), z.literal("targetable"), expressionSchema]).optional(), filter: z.union([z.literal("past"), z.literal("upcoming"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/operation_update.schema.js
var require_operation_update_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("appointment"),
          operation: z.literal("update"),
          appointmentId: stringOrExpression.optional(),
          updateFields: z.object({ attendees: z.unknown().optional(), creater_id: stringOrExpression.optional(), endDate: stringOrExpression.optional(), is_allday: booleanOrExpression.optional(), latitude: stringOrExpression.optional(), location: stringOrExpression.optional(), longitude: stringOrExpression.optional(), outcome_id: stringOrExpression.optional(), fromDate: stringOrExpression.optional(), targetable_id: stringOrExpression.optional(), targetable_type: z.union([z.literal("Contact"), z.literal("Deal"), z.literal("SalesAccount"), expressionSchema]).optional(), time_zone: z.union([z.literal("Africa/Abidjan"), z.literal("Africa/Accra"), z.literal("Africa/Addis_Ababa"), z.literal("Africa/Algiers"), z.literal("Africa/Asmara"), z.literal("Africa/Asmera"), z.literal("Africa/Bamako"), z.literal("Africa/Bangui"), z.literal("Africa/Banjul"), z.literal("Africa/Bissau"), z.literal("Africa/Blantyre"), z.literal("Africa/Brazzaville"), z.literal("Africa/Bujumbura"), z.literal("Africa/Cairo"), z.literal("Africa/Casablanca"), z.literal("Africa/Ceuta"), z.literal("Africa/Conakry"), z.literal("Africa/Dakar"), z.literal("Africa/Dar_es_Salaam"), z.literal("Africa/Djibouti"), z.literal("Africa/Douala"), z.literal("Africa/El_Aaiun"), z.literal("Africa/Freetown"), z.literal("Africa/Gaborone"), z.literal("Africa/Harare"), z.literal("Africa/Johannesburg"), z.literal("Africa/Juba"), z.literal("Africa/Kampala"), z.literal("Africa/Khartoum"), z.literal("Africa/Kigali"), z.literal("Africa/Kinshasa"), z.literal("Africa/Lagos"), z.literal("Africa/Libreville"), z.literal("Africa/Lome"), z.literal("Africa/Luanda"), z.literal("Africa/Lubumbashi"), z.literal("Africa/Lusaka"), z.literal("Africa/Malabo"), z.literal("Africa/Maputo"), z.literal("Africa/Maseru"), z.literal("Africa/Mbabane"), z.literal("Africa/Mogadishu"), z.literal("Africa/Monrovia"), z.literal("Africa/Nairobi"), z.literal("Africa/Ndjamena"), z.literal("Africa/Niamey"), z.literal("Africa/Nouakchott"), z.literal("Africa/Ouagadougou"), z.literal("Africa/Porto-Novo"), z.literal("Africa/Sao_Tome"), z.literal("Africa/Timbuktu"), z.literal("Africa/Tripoli"), z.literal("Africa/Tunis"), z.literal("Africa/Windhoek"), z.literal("America/Adak"), z.literal("America/Anchorage"), z.literal("America/Anguilla"), z.literal("America/Antigua"), z.literal("America/Araguaina"), z.literal("America/Argentina/Buenos_Aires"), z.literal("America/Argentina/Catamarca"), z.literal("America/Argentina/ComodRivadavia"), z.literal("America/Argentina/Cordoba"), z.literal("America/Argentina/Jujuy"), z.literal("America/Argentina/La_Rioja"), z.literal("America/Argentina/Mendoza"), z.literal("America/Argentina/Rio_Gallegos"), z.literal("America/Argentina/Salta"), z.literal("America/Argentina/San_Juan"), z.literal("America/Argentina/San_Luis"), z.literal("America/Argentina/Tucuman"), z.literal("America/Argentina/Ushuaia"), z.literal("America/Aruba"), z.literal("America/Asuncion"), z.literal("America/Atikokan"), z.literal("America/Atka"), z.literal("America/Bahia"), z.literal("America/Bahia_Banderas"), z.literal("America/Barbados"), z.literal("America/Belem"), z.literal("America/Belize"), z.literal("America/Blanc-Sablon"), z.literal("America/Boa_Vista"), z.literal("America/Bogota"), z.literal("America/Boise"), z.literal("America/Buenos_Aires"), z.literal("America/Cambridge_Bay"), z.literal("America/Campo_Grande"), z.literal("America/Cancun"), z.literal("America/Caracas"), z.literal("America/Catamarca"), z.literal("America/Cayenne"), z.literal("America/Cayman"), z.literal("America/Chicago"), z.literal("America/Chihuahua"), z.literal("America/Ciudad_Juarez"), z.literal("America/Coral_Harbour"), z.literal("America/Cordoba"), z.literal("America/Costa_Rica"), z.literal("America/Coyhaique"), z.literal("America/Creston"), z.literal("America/Cuiaba"), z.literal("America/Curacao"), z.literal("America/Danmarkshavn"), z.literal("America/Dawson"), z.literal("America/Dawson_Creek"), z.literal("America/Denver"), z.literal("America/Detroit"), z.literal("America/Dominica"), z.literal("America/Edmonton"), z.literal("America/Eirunepe"), z.literal("America/El_Salvador"), z.literal("America/Ensenada"), z.literal("America/Fort_Nelson"), z.literal("America/Fort_Wayne"), z.literal("America/Fortaleza"), z.literal("America/Glace_Bay"), z.literal("America/Godthab"), z.literal("America/Goose_Bay"), z.literal("America/Grand_Turk"), z.literal("America/Grenada"), z.literal("America/Guadeloupe"), z.literal("America/Guatemala"), z.literal("America/Guayaquil"), z.literal("America/Guyana"), z.literal("America/Halifax"), z.literal("America/Havana"), z.literal("America/Hermosillo"), z.literal("America/Indiana/Indianapolis"), z.literal("America/Indiana/Knox"), z.literal("America/Indiana/Marengo"), z.literal("America/Indiana/Petersburg"), z.literal("America/Indiana/Tell_City"), z.literal("America/Indiana/Vevay"), z.literal("America/Indiana/Vincennes"), z.literal("America/Indiana/Winamac"), z.literal("America/Indianapolis"), z.literal("America/Inuvik"), z.literal("America/Iqaluit"), z.literal("America/Jamaica"), z.literal("America/Jujuy"), z.literal("America/Juneau"), z.literal("America/Kentucky/Louisville"), z.literal("America/Kentucky/Monticello"), z.literal("America/Knox_IN"), z.literal("America/Kralendijk"), z.literal("America/La_Paz"), z.literal("America/Lima"), z.literal("America/Los_Angeles"), z.literal("America/Louisville"), z.literal("America/Lower_Princes"), z.literal("America/Maceio"), z.literal("America/Managua"), z.literal("America/Manaus"), z.literal("America/Marigot"), z.literal("America/Martinique"), z.literal("America/Matamoros"), z.literal("America/Mazatlan"), z.literal("America/Mendoza"), z.literal("America/Menominee"), z.literal("America/Merida"), z.literal("America/Metlakatla"), z.literal("America/Mexico_City"), z.literal("America/Miquelon"), z.literal("America/Moncton"), z.literal("America/Monterrey"), z.literal("America/Montevideo"), z.literal("America/Montreal"), z.literal("America/Montserrat"), z.literal("America/Nassau"), z.literal("America/New_York"), z.literal("America/Nipigon"), z.literal("America/Nome"), z.literal("America/Noronha"), z.literal("America/North_Dakota/Beulah"), z.literal("America/North_Dakota/Center"), z.literal("America/North_Dakota/New_Salem"), z.literal("America/Nuuk"), z.literal("America/Ojinaga"), z.literal("America/Panama"), z.literal("America/Pangnirtung"), z.literal("America/Paramaribo"), z.literal("America/Phoenix"), z.literal("America/Port-au-Prince"), z.literal("America/Port_of_Spain"), z.literal("America/Porto_Acre"), z.literal("America/Porto_Velho"), z.literal("America/Puerto_Rico"), z.literal("America/Punta_Arenas"), z.literal("America/Rainy_River"), z.literal("America/Rankin_Inlet"), z.literal("America/Recife"), z.literal("America/Regina"), z.literal("America/Resolute"), z.literal("America/Rio_Branco"), z.literal("America/Rosario"), z.literal("America/Santa_Isabel"), z.literal("America/Santarem"), z.literal("America/Santiago"), z.literal("America/Santo_Domingo"), z.literal("America/Sao_Paulo"), z.literal("America/Scoresbysund"), z.literal("America/Shiprock"), z.literal("America/Sitka"), z.literal("America/St_Barthelemy"), z.literal("America/St_Johns"), z.literal("America/St_Kitts"), z.literal("America/St_Lucia"), z.literal("America/St_Thomas"), z.literal("America/St_Vincent"), z.literal("America/Swift_Current"), z.literal("America/Tegucigalpa"), z.literal("America/Thule"), z.literal("America/Thunder_Bay"), z.literal("America/Tijuana"), z.literal("America/Toronto"), z.literal("America/Tortola"), z.literal("America/Vancouver"), z.literal("America/Virgin"), z.literal("America/Whitehorse"), z.literal("America/Winnipeg"), z.literal("America/Yakutat"), z.literal("America/Yellowknife"), z.literal("Antarctica/Casey"), z.literal("Antarctica/Davis"), z.literal("Antarctica/DumontDUrville"), z.literal("Antarctica/Macquarie"), z.literal("Antarctica/Mawson"), z.literal("Antarctica/McMurdo"), z.literal("Antarctica/Palmer"), z.literal("Antarctica/Rothera"), z.literal("Antarctica/South_Pole"), z.literal("Antarctica/Syowa"), z.literal("Antarctica/Troll"), z.literal("Antarctica/Vostok"), z.literal("Arctic/Longyearbyen"), z.literal("Asia/Aden"), z.literal("Asia/Almaty"), z.literal("Asia/Amman"), z.literal("Asia/Anadyr"), z.literal("Asia/Aqtau"), z.literal("Asia/Aqtobe"), z.literal("Asia/Ashgabat"), z.literal("Asia/Ashkhabad"), z.literal("Asia/Atyrau"), z.literal("Asia/Baghdad"), z.literal("Asia/Bahrain"), z.literal("Asia/Baku"), z.literal("Asia/Bangkok"), z.literal("Asia/Barnaul"), z.literal("Asia/Beirut"), z.literal("Asia/Bishkek"), z.literal("Asia/Brunei"), z.literal("Asia/Calcutta"), z.literal("Asia/Chita"), z.literal("Asia/Choibalsan"), z.literal("Asia/Chongqing"), z.literal("Asia/Chungking"), z.literal("Asia/Colombo"), z.literal("Asia/Dacca"), z.literal("Asia/Damascus"), z.literal("Asia/Dhaka"), z.literal("Asia/Dili"), z.literal("Asia/Dubai"), z.literal("Asia/Dushanbe"), z.literal("Asia/Famagusta"), z.literal("Asia/Gaza"), z.literal("Asia/Harbin"), z.literal("Asia/Hebron"), z.literal("Asia/Ho_Chi_Minh"), z.literal("Asia/Hong_Kong"), z.literal("Asia/Hovd"), z.literal("Asia/Irkutsk"), z.literal("Asia/Istanbul"), z.literal("Asia/Jakarta"), z.literal("Asia/Jayapura"), z.literal("Asia/Jerusalem"), z.literal("Asia/Kabul"), z.literal("Asia/Kamchatka"), z.literal("Asia/Karachi"), z.literal("Asia/Kashgar"), z.literal("Asia/Kathmandu"), z.literal("Asia/Katmandu"), z.literal("Asia/Khandyga"), z.literal("Asia/Kolkata"), z.literal("Asia/Krasnoyarsk"), z.literal("Asia/Kuala_Lumpur"), z.literal("Asia/Kuching"), z.literal("Asia/Kuwait"), z.literal("Asia/Macao"), z.literal("Asia/Macau"), z.literal("Asia/Magadan"), z.literal("Asia/Makassar"), z.literal("Asia/Manila"), z.literal("Asia/Muscat"), z.literal("Asia/Nicosia"), z.literal("Asia/Novokuznetsk"), z.literal("Asia/Novosibirsk"), z.literal("Asia/Omsk"), z.literal("Asia/Oral"), z.literal("Asia/Phnom_Penh"), z.literal("Asia/Pontianak"), z.literal("Asia/Pyongyang"), z.literal("Asia/Qatar"), z.literal("Asia/Qostanay"), z.literal("Asia/Qyzylorda"), z.literal("Asia/Rangoon"), z.literal("Asia/Riyadh"), z.literal("Asia/Saigon"), z.literal("Asia/Sakhalin"), z.literal("Asia/Samarkand"), z.literal("Asia/Seoul"), z.literal("Asia/Shanghai"), z.literal("Asia/Singapore"), z.literal("Asia/Srednekolymsk"), z.literal("Asia/Taipei"), z.literal("Asia/Tashkent"), z.literal("Asia/Tbilisi"), z.literal("Asia/Tehran"), z.literal("Asia/Tel_Aviv"), z.literal("Asia/Thimbu"), z.literal("Asia/Thimphu"), z.literal("Asia/Tokyo"), z.literal("Asia/Tomsk"), z.literal("Asia/Ujung_Pandang"), z.literal("Asia/Ulaanbaatar"), z.literal("Asia/Ulan_Bator"), z.literal("Asia/Urumqi"), z.literal("Asia/Ust-Nera"), z.literal("Asia/Vientiane"), z.literal("Asia/Vladivostok"), z.literal("Asia/Yakutsk"), z.literal("Asia/Yangon"), z.literal("Asia/Yekaterinburg"), z.literal("Asia/Yerevan"), z.literal("Atlantic/Azores"), z.literal("Atlantic/Bermuda"), z.literal("Atlantic/Canary"), z.literal("Atlantic/Cape_Verde"), z.literal("Atlantic/Faeroe"), z.literal("Atlantic/Faroe"), z.literal("Atlantic/Jan_Mayen"), z.literal("Atlantic/Madeira"), z.literal("Atlantic/Reykjavik"), z.literal("Atlantic/South_Georgia"), z.literal("Atlantic/St_Helena"), z.literal("Atlantic/Stanley"), z.literal("Australia/ACT"), z.literal("Australia/Adelaide"), z.literal("Australia/Brisbane"), z.literal("Australia/Broken_Hill"), z.literal("Australia/Canberra"), z.literal("Australia/Currie"), z.literal("Australia/Darwin"), z.literal("Australia/Eucla"), z.literal("Australia/Hobart"), z.literal("Australia/LHI"), z.literal("Australia/Lindeman"), z.literal("Australia/Lord_Howe"), z.literal("Australia/Melbourne"), z.literal("Australia/NSW"), z.literal("Australia/North"), z.literal("Australia/Perth"), z.literal("Australia/Queensland"), z.literal("Australia/South"), z.literal("Australia/Sydney"), z.literal("Australia/Tasmania"), z.literal("Australia/Victoria"), z.literal("Australia/West"), z.literal("Australia/Yancowinna"), z.literal("Brazil/Acre"), z.literal("Brazil/DeNoronha"), z.literal("Brazil/East"), z.literal("Brazil/West"), z.literal("CET"), z.literal("CST6CDT"), z.literal("Canada/Atlantic"), z.literal("Canada/Central"), z.literal("Canada/Eastern"), z.literal("Canada/Mountain"), z.literal("Canada/Newfoundland"), z.literal("Canada/Pacific"), z.literal("Canada/Saskatchewan"), z.literal("Canada/Yukon"), z.literal("Chile/Continental"), z.literal("Chile/EasterIsland"), z.literal("Cuba"), z.literal("EET"), z.literal("EST"), z.literal("EST5EDT"), z.literal("Egypt"), z.literal("Eire"), z.literal("Etc/GMT"), z.literal("Etc/GMT+0"), z.literal("Etc/GMT+1"), z.literal("Etc/GMT+10"), z.literal("Etc/GMT+11"), z.literal("Etc/GMT+12"), z.literal("Etc/GMT+2"), z.literal("Etc/GMT+3"), z.literal("Etc/GMT+4"), z.literal("Etc/GMT+5"), z.literal("Etc/GMT+6"), z.literal("Etc/GMT+7"), z.literal("Etc/GMT+8"), z.literal("Etc/GMT+9"), z.literal("Etc/GMT-0"), z.literal("Etc/GMT-1"), z.literal("Etc/GMT-10"), z.literal("Etc/GMT-11"), z.literal("Etc/GMT-12"), z.literal("Etc/GMT-13"), z.literal("Etc/GMT-14"), z.literal("Etc/GMT-2"), z.literal("Etc/GMT-3"), z.literal("Etc/GMT-4"), z.literal("Etc/GMT-5"), z.literal("Etc/GMT-6"), z.literal("Etc/GMT-7"), z.literal("Etc/GMT-8"), z.literal("Etc/GMT-9"), z.literal("Etc/GMT0"), z.literal("Etc/Greenwich"), z.literal("Etc/UCT"), z.literal("Etc/UTC"), z.literal("Etc/Universal"), z.literal("Etc/Zulu"), z.literal("Europe/Amsterdam"), z.literal("Europe/Andorra"), z.literal("Europe/Astrakhan"), z.literal("Europe/Athens"), z.literal("Europe/Belfast"), z.literal("Europe/Belgrade"), z.literal("Europe/Berlin"), z.literal("Europe/Bratislava"), z.literal("Europe/Brussels"), z.literal("Europe/Bucharest"), z.literal("Europe/Budapest"), z.literal("Europe/Busingen"), z.literal("Europe/Chisinau"), z.literal("Europe/Copenhagen"), z.literal("Europe/Dublin"), z.literal("Europe/Gibraltar"), z.literal("Europe/Guernsey"), z.literal("Europe/Helsinki"), z.literal("Europe/Isle_of_Man"), z.literal("Europe/Istanbul"), z.literal("Europe/Jersey"), z.literal("Europe/Kaliningrad"), z.literal("Europe/Kiev"), z.literal("Europe/Kirov"), z.literal("Europe/Kyiv"), z.literal("Europe/Lisbon"), z.literal("Europe/Ljubljana"), z.literal("Europe/London"), z.literal("Europe/Luxembourg"), z.literal("Europe/Madrid"), z.literal("Europe/Malta"), z.literal("Europe/Mariehamn"), z.literal("Europe/Minsk"), z.literal("Europe/Monaco"), z.literal("Europe/Moscow"), z.literal("Europe/Nicosia"), z.literal("Europe/Oslo"), z.literal("Europe/Paris"), z.literal("Europe/Podgorica"), z.literal("Europe/Prague"), z.literal("Europe/Riga"), z.literal("Europe/Rome"), z.literal("Europe/Samara"), z.literal("Europe/San_Marino"), z.literal("Europe/Sarajevo"), z.literal("Europe/Saratov"), z.literal("Europe/Simferopol"), z.literal("Europe/Skopje"), z.literal("Europe/Sofia"), z.literal("Europe/Stockholm"), z.literal("Europe/Tallinn"), z.literal("Europe/Tirane"), z.literal("Europe/Tiraspol"), z.literal("Europe/Ulyanovsk"), z.literal("Europe/Uzhgorod"), z.literal("Europe/Vaduz"), z.literal("Europe/Vatican"), z.literal("Europe/Vienna"), z.literal("Europe/Vilnius"), z.literal("Europe/Volgograd"), z.literal("Europe/Warsaw"), z.literal("Europe/Zagreb"), z.literal("Europe/Zaporozhye"), z.literal("Europe/Zurich"), z.literal("GB"), z.literal("GB-Eire"), z.literal("GMT"), z.literal("GMT+0"), z.literal("GMT-0"), z.literal("GMT0"), z.literal("Greenwich"), z.literal("HST"), z.literal("Hongkong"), z.literal("Iceland"), z.literal("Indian/Antananarivo"), z.literal("Indian/Chagos"), z.literal("Indian/Christmas"), z.literal("Indian/Cocos"), z.literal("Indian/Comoro"), z.literal("Indian/Kerguelen"), z.literal("Indian/Mahe"), z.literal("Indian/Maldives"), z.literal("Indian/Mauritius"), z.literal("Indian/Mayotte"), z.literal("Indian/Reunion"), z.literal("Iran"), z.literal("Israel"), z.literal("Jamaica"), z.literal("Japan"), z.literal("Kwajalein"), z.literal("Libya"), z.literal("MET"), z.literal("MST"), z.literal("MST7MDT"), z.literal("Mexico/BajaNorte"), z.literal("Mexico/BajaSur"), z.literal("Mexico/General"), z.literal("NZ"), z.literal("NZ-CHAT"), z.literal("Navajo"), z.literal("PRC"), z.literal("PST8PDT"), z.literal("Pacific/Apia"), z.literal("Pacific/Auckland"), z.literal("Pacific/Bougainville"), z.literal("Pacific/Chatham"), z.literal("Pacific/Chuuk"), z.literal("Pacific/Easter"), z.literal("Pacific/Efate"), z.literal("Pacific/Enderbury"), z.literal("Pacific/Fakaofo"), z.literal("Pacific/Fiji"), z.literal("Pacific/Funafuti"), z.literal("Pacific/Galapagos"), z.literal("Pacific/Gambier"), z.literal("Pacific/Guadalcanal"), z.literal("Pacific/Guam"), z.literal("Pacific/Honolulu"), z.literal("Pacific/Johnston"), z.literal("Pacific/Kanton"), z.literal("Pacific/Kiritimati"), z.literal("Pacific/Kosrae"), z.literal("Pacific/Kwajalein"), z.literal("Pacific/Majuro"), z.literal("Pacific/Marquesas"), z.literal("Pacific/Midway"), z.literal("Pacific/Nauru"), z.literal("Pacific/Niue"), z.literal("Pacific/Norfolk"), z.literal("Pacific/Noumea"), z.literal("Pacific/Pago_Pago"), z.literal("Pacific/Palau"), z.literal("Pacific/Pitcairn"), z.literal("Pacific/Pohnpei"), z.literal("Pacific/Ponape"), z.literal("Pacific/Port_Moresby"), z.literal("Pacific/Rarotonga"), z.literal("Pacific/Saipan"), z.literal("Pacific/Samoa"), z.literal("Pacific/Tahiti"), z.literal("Pacific/Tarawa"), z.literal("Pacific/Tongatapu"), z.literal("Pacific/Truk"), z.literal("Pacific/Wake"), z.literal("Pacific/Wallis"), z.literal("Pacific/Yap"), z.literal("Poland"), z.literal("Portugal"), z.literal("ROC"), z.literal("ROK"), z.literal("Singapore"), z.literal("Turkey"), z.literal("UCT"), z.literal("US/Alaska"), z.literal("US/Aleutian"), z.literal("US/Arizona"), z.literal("US/Central"), z.literal("US/East-Indiana"), z.literal("US/Eastern"), z.literal("US/Hawaii"), z.literal("US/Indiana-Starke"), z.literal("US/Michigan"), z.literal("US/Mountain"), z.literal("US/Pacific"), z.literal("US/Samoa"), z.literal("UTC"), z.literal("Universal"), z.literal("W-SU"), z.literal("WET"), z.literal("Zulu"), expressionSchema]).optional(), title: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/index.schema.js
var require_index_schema2 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_appointment/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema2();
    var getDeleteSchema = require_operation_delete_schema2();
    var getGetSchema = require_operation_get_schema2();
    var getGetAllSchema = require_operation_get_all_schema2();
    var getUpdateSchema = require_operation_update_schema2();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/operation_create.schema.js
var require_operation_create_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("create").default("create"),
          firstName: stringOrExpression.optional(),
          lastName: stringOrExpression.optional(),
          emails: stringOrExpression.optional(),
          additionalFields: z.object({ address: stringOrExpression.optional(), campaign_id: stringOrExpression.optional(), city: stringOrExpression.optional(), contact_status_id: stringOrExpression.optional(), country: stringOrExpression.optional(), external_id: stringOrExpression.optional(), facebook: stringOrExpression.optional(), job_title: stringOrExpression.optional(), keyword: stringOrExpression.optional(), lead_source_id: stringOrExpression.optional(), lifecycle_stage_id: stringOrExpression.optional(), linkedin: stringOrExpression.optional(), medium: stringOrExpression.optional(), mobile_number: stringOrExpression.optional(), owner_id: stringOrExpression.optional(), sales_accounts: z.array(z.string()).optional(), state: stringOrExpression.optional(), subscription_status: stringOrExpression.optional(), subscription_types: stringOrExpression.optional(), territory_id: stringOrExpression.optional(), time_zone: stringOrExpression.optional(), twitter: stringOrExpression.optional(), work_number: stringOrExpression.optional(), zipcode: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/operation_delete.schema.js
var require_operation_delete_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("delete"),
          contactId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/operation_get.schema.js
var require_operation_get_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("get"),
          contactId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/operation_get_all.schema.js
var require_operation_get_all_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("getAll"),
          view: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/operation_update.schema.js
var require_operation_update_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("contact"),
          operation: z.literal("update"),
          contactId: stringOrExpression.optional(),
          updateFields: z.object({ address: stringOrExpression.optional(), campaign_id: stringOrExpression.optional(), city: stringOrExpression.optional(), contact_status_id: stringOrExpression.optional(), country: stringOrExpression.optional(), external_id: stringOrExpression.optional(), facebook: stringOrExpression.optional(), first_name: stringOrExpression.optional(), job_title: stringOrExpression.optional(), keyword: stringOrExpression.optional(), last_name: stringOrExpression.optional(), lead_source_id: stringOrExpression.optional(), lifecycle_stage_id: stringOrExpression.optional(), linkedin: stringOrExpression.optional(), medium: stringOrExpression.optional(), mobile_number: stringOrExpression.optional(), owner_id: stringOrExpression.optional(), sales_accounts: z.array(z.string()).optional(), state: stringOrExpression.optional(), subscription_status: stringOrExpression.optional(), subscription_types: stringOrExpression.optional(), territory_id: stringOrExpression.optional(), time_zone: stringOrExpression.optional(), twitter: stringOrExpression.optional(), work_number: stringOrExpression.optional(), zipcode: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/index.schema.js
var require_index_schema3 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_contact/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema3();
    var getDeleteSchema = require_operation_delete_schema3();
    var getGetSchema = require_operation_get_schema3();
    var getGetAllSchema = require_operation_get_all_schema3();
    var getUpdateSchema = require_operation_update_schema3();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/operation_create.schema.js
var require_operation_create_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("create").default("create"),
          amount: numberOrExpression.optional(),
          name: stringOrExpression.optional(),
          additionalFields: z.object({ base_currency_amount: numberOrExpression.optional(), campaign_id: stringOrExpression.optional(), currency_id: stringOrExpression.optional(), deal_payment_status_id: stringOrExpression.optional(), deal_pipeline_id: stringOrExpression.optional(), deal_product_id: stringOrExpression.optional(), deal_reason_id: stringOrExpression.optional(), deal_stage_id: stringOrExpression.optional(), deal_type_id: stringOrExpression.optional(), lead_source_id: stringOrExpression.optional(), owner_id: stringOrExpression.optional(), probability: numberOrExpression.optional(), sales_account_id: stringOrExpression.optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/operation_delete.schema.js
var require_operation_delete_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("delete"),
          dealId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/operation_get.schema.js
var require_operation_get_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("get"),
          dealId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/operation_get_all.schema.js
var require_operation_get_all_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("getAll"),
          view: stringOrExpression.optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/operation_update.schema.js
var require_operation_update_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("deal"),
          operation: z.literal("update"),
          dealId: stringOrExpression.optional(),
          updateFields: z.object({ amount: numberOrExpression.optional(), base_currency_amount: numberOrExpression.optional(), campaign_id: stringOrExpression.optional(), currency_id: stringOrExpression.optional(), deal_payment_status_id: stringOrExpression.optional(), deal_pipeline_id: stringOrExpression.optional(), deal_product_id: stringOrExpression.optional(), deal_reason_id: stringOrExpression.optional(), deal_stage_id: stringOrExpression.optional(), deal_type_id: stringOrExpression.optional(), lead_source_id: stringOrExpression.optional(), name: stringOrExpression.optional(), owner_id: stringOrExpression.optional(), probability: numberOrExpression.optional(), sales_account_id: stringOrExpression.optional(), territory_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/index.schema.js
var require_index_schema4 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_deal/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema4();
    var getDeleteSchema = require_operation_delete_schema4();
    var getGetSchema = require_operation_get_schema4();
    var getGetAllSchema = require_operation_get_all_schema4();
    var getUpdateSchema = require_operation_update_schema4();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_note/operation_create.schema.js
var require_operation_create_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_note/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("note"),
          operation: z.literal("create").default("create"),
          description: stringOrExpression.optional(),
          targetableType: z.union([z.literal("Contact"), z.literal("Deal"), z.literal("SalesAccount"), expressionSchema]).optional(),
          targetable_id: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_note/operation_delete.schema.js
var require_operation_delete_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_note/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("note"),
          operation: z.literal("delete"),
          noteId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_note/operation_update.schema.js
var require_operation_update_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_note/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("note"),
          operation: z.literal("update"),
          noteId: stringOrExpression.optional(),
          updateFields: z.object({ description: stringOrExpression.optional(), targetable_id: stringOrExpression.optional(), targetable_type: z.union([z.literal("Contact"), z.literal("Deal"), z.literal("SalesAccount"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_note/index.schema.js
var require_index_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_note/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema5();
    var getDeleteSchema = require_operation_delete_schema5();
    var getUpdateSchema = require_operation_update_schema5();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getCreateSchema({ ...helpers, parameters: effectiveParams }),
        getDeleteSchema({ ...helpers, parameters: effectiveParams }),
        getUpdateSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_sales_activity/operation_get.schema.js
var require_operation_get_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_sales_activity/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("salesActivity"),
          operation: z.literal("get"),
          salesActivityId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_sales_activity/operation_get_all.schema.js
var require_operation_get_all_schema5 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_sales_activity/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("salesActivity"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_sales_activity/index.schema.js
var require_index_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_sales_activity/index.schema.js"(exports2, module2) {
    var getGetSchema = require_operation_get_schema5();
    var getGetAllSchema = require_operation_get_all_schema5();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getGetSchema({ ...helpers, parameters: effectiveParams }),
        getGetAllSchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_search/operation_lookup.schema.js
var require_operation_lookup_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_search/operation_lookup.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("search"),
          operation: z.literal("lookup"),
          searchField: z.union([z.literal("email"), z.literal("name"), z.literal("customField"), expressionSchema]).optional(),
          customFieldName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "searchField": ["customField"] } }, defaults: { "searchField": "" } }),
          customFieldValue: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "searchField": ["customField"] } }, defaults: { "searchField": "" } }),
          fieldValue: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "searchField": ["email", "name"] } }, defaults: { "searchField": "" } }),
          options: z.object({ entities: z.array(z.union([z.literal("contact"), z.literal("deal"), z.literal("sales_account")])).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_search/operation_query.schema.js
var require_operation_query_schema = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_search/operation_query.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("search"),
          operation: z.literal("query"),
          query: stringOrExpression.optional(),
          entities: z.array(z.union([z.literal("contact"), z.literal("deal"), z.literal("sales_account"), z.literal("user")])).optional(),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } })
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_search/index.schema.js
var require_index_schema7 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_search/index.schema.js"(exports2, module2) {
    var getLookupSchema = require_operation_lookup_schema();
    var getQuerySchema = require_operation_query_schema();
    module2.exports = function getSchema2(helpers) {
      const { parameters, z } = helpers;
      const effectiveParams = parameters.operation === void 0 ? { ...parameters, operation: "create" } : parameters;
      return z.union([
        getLookupSchema({ ...helpers, parameters: effectiveParams }),
        getQuerySchema({ ...helpers, parameters: effectiveParams })
      ]);
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/operation_create.schema.js
var require_operation_create_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/operation_create.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("create").default("create"),
          title: stringOrExpression.optional(),
          dueDate: stringOrExpression.optional(),
          ownerId: stringOrExpression.optional(),
          targetableType: z.union([z.literal("Contact"), z.literal("Deal"), z.literal("SalesAccount"), expressionSchema]).optional(),
          targetable_id: stringOrExpression.optional(),
          additionalFields: z.object({ creater_id: stringOrExpression.optional(), outcome_id: stringOrExpression.optional(), task_type_id: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/operation_delete.schema.js
var require_operation_delete_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/operation_delete.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("delete"),
          taskId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/operation_get.schema.js
var require_operation_get_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/operation_get.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("get"),
          taskId: stringOrExpression.optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/operation_get_all.schema.js
var require_operation_get_all_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/operation_get_all.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("getAll"),
          returnAll: booleanOrExpression.optional(),
          limit: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "returnAll": [false] } }, defaults: { "returnAll": false } }),
          filters: z.object({ include: z.union([z.literal("owner"), z.literal("targetable"), z.literal("users"), expressionSchema]).optional(), filter: z.union([z.literal("completed"), z.literal("due_today"), z.literal("due_tomorrow"), z.literal("open"), z.literal("overdue"), expressionSchema]).optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/operation_update.schema.js
var require_operation_update_schema6 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/operation_update.schema.js"(exports2, module2) {
    module2.exports = function getSchema2({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
      return z.object({
        parameters: z.object({
          resource: z.literal("task"),
          operation: z.literal("update"),
          taskId: stringOrExpression.optional(),
          updateFields: z.object({ creater_id: stringOrExpression.optional(), dueDate: stringOrExpression.optional(), outcome_id: stringOrExpression.optional(), owner_id: stringOrExpression.optional(), targetable_id: stringOrExpression.optional(), targetable_type: z.union([z.literal("Contact"), z.literal("Deal"), z.literal("SalesAccount"), expressionSchema]).optional(), task_type_id: stringOrExpression.optional(), title: stringOrExpression.optional() }).optional()
        }).optional()
      });
    };
  }
});

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/index.schema.js
var require_index_schema8 = __commonJS({
  "../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/resource_task/index.schema.js"(exports2, module2) {
    var getCreateSchema = require_operation_create_schema6();
    var getDeleteSchema = require_operation_delete_schema6();
    var getGetSchema = require_operation_get_schema6();
    var getGetAllSchema = require_operation_get_all_schema6();
    var getUpdateSchema = require_operation_update_schema6();
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

// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/freshworksCrm/v1/index.schema.js
var getAccountSchema = require_index_schema();
var getAppointmentSchema = require_index_schema2();
var getContactSchema = require_index_schema3();
var getDealSchema = require_index_schema4();
var getNoteSchema = require_index_schema5();
var getSalesActivitySchema = require_index_schema6();
var getSearchSchema = require_index_schema7();
var getTaskSchema = require_index_schema8();
module.exports = function getSchema(helpers) {
  const { parameters, z } = helpers;
  const effectiveParams = parameters.resource === void 0 ? { ...parameters, resource: "account" } : parameters;
  return z.union([
    getAccountSchema({ ...helpers, parameters: effectiveParams }),
    getAppointmentSchema({ ...helpers, parameters: effectiveParams }),
    getContactSchema({ ...helpers, parameters: effectiveParams }),
    getDealSchema({ ...helpers, parameters: effectiveParams }),
    getNoteSchema({ ...helpers, parameters: effectiveParams }),
    getSalesActivitySchema({ ...helpers, parameters: effectiveParams }),
    getSearchSchema({ ...helpers, parameters: effectiveParams }),
    getTaskSchema({ ...helpers, parameters: effectiveParams })
  ]);
};
