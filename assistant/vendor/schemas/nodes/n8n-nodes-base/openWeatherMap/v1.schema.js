// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/openWeatherMap/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    operation: z.union([z.literal("currentWeather"), z.literal("5DayForecast")]).optional(),
    format: z.union([z.literal("imperial"), z.literal("metric"), z.literal("standard"), expressionSchema]).optional(),
    locationSelection: z.union([z.literal("cityName"), z.literal("cityId"), z.literal("coordinates"), z.literal("zipCode"), expressionSchema]).optional(),
    cityName: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "locationSelection": ["cityName"] } }, defaults: { "locationSelection": "cityName" } }),
    cityId: resolveSchema({ parameters, schema: numberOrExpression, required: false, displayOptions: { "show": { "locationSelection": ["cityId"] } }, defaults: { "locationSelection": "cityName" } }),
    latitude: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "locationSelection": ["coordinates"] } }, defaults: { "locationSelection": "cityName" } }),
    longitude: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "locationSelection": ["coordinates"] } }, defaults: { "locationSelection": "cityName" } }),
    zipCode: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "locationSelection": ["zipCode"] } }, defaults: { "locationSelection": "cityName" } }),
    language: stringOrExpression.optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
