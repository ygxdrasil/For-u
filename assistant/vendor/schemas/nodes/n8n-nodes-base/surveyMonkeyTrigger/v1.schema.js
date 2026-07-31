// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/surveyMonkeyTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema, resolveSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
    objectType: z.union([z.literal("collector"), z.literal("survey"), expressionSchema]).optional(),
    event: resolveSchema({ parameters, schema: z.union([z.literal("collector_created"), z.literal("collector_deleted"), z.literal("collector_updated"), z.literal("response_completed"), z.literal("response_created"), z.literal("response_deleted"), z.literal("response_disqualified"), z.literal("response_overquota"), z.literal("response_updated"), z.literal("survey_created"), z.literal("survey_deleted"), z.literal("survey_updated"), expressionSchema]), required: false, displayOptions: { "show": { "objectType": ["survey", "collector"] } }, defaults: { "objectType": "" } }),
    surveyIds: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "show": { "objectType": ["survey"] }, "hide": { "event": ["survey_created"] } }, defaults: { "objectType": "", "event": "" } }),
    surveyId: resolveSchema({ parameters, schema: stringOrExpression, required: false, displayOptions: { "show": { "objectType": ["collector"] } }, defaults: { "objectType": "" } }),
    collectorIds: resolveSchema({ parameters, schema: z.array(z.string()), required: false, displayOptions: { "show": { "objectType": ["collector"] } }, defaults: { "objectType": "" } }),
    resolveData: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "event": ["response_completed"] } }, defaults: { "event": "" } }),
    onlyAnswers: resolveSchema({ parameters, schema: booleanOrExpression, required: false, displayOptions: { "show": { "resolveData": [true], "event": ["response_completed"] } }, defaults: { "resolveData": true, "event": "" } })
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
