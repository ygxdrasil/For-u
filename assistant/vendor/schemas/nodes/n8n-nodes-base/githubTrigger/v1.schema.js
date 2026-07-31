// ../../../../tmp/claude-0/-home-user-For-u/0e645656-0d7d-5e05-bba0-bc0cbe899eb0/scratchpad/nodesrc/node_modules/n8n-nodes-base/dist/node-definitions/nodes/n8n-nodes-base/githubTrigger/v1.schema.js
module.exports = function getSchema({ parameters, z, expressionSchema, stringOrExpression, numberOrExpression, booleanOrExpression, resourceLocatorValueSchema, resourceMapperValueSchema, filterValueSchema, assignmentCollectionValueSchema, iDataObjectSchema }) {
  const parametersSchema = z.object({
    authentication: z.union([z.literal("accessToken"), z.literal("oAuth2"), expressionSchema]).optional(),
    owner: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
    repository: z.union([z.object({ __rl: z.literal(true), mode: z.union([z.literal("list"), z.literal("url"), z.literal("name")]), value: z.union([z.string(), z.number()]), cachedResultName: z.string().optional(), cachedResultUrl: z.string().optional() }), expressionSchema]).optional(),
    events: z.array(z.union([z.literal("*"), z.literal("check_run"), z.literal("check_suite"), z.literal("commit_comment"), z.literal("create"), z.literal("delete"), z.literal("deploy_key"), z.literal("deployment"), z.literal("deployment_status"), z.literal("fork"), z.literal("github_app_authorization"), z.literal("gollum"), z.literal("installation"), z.literal("installation_repositories"), z.literal("issue_comment"), z.literal("issues"), z.literal("label"), z.literal("marketplace_purchase"), z.literal("member"), z.literal("membership"), z.literal("meta"), z.literal("milestone"), z.literal("org_block"), z.literal("organization"), z.literal("page_build"), z.literal("project"), z.literal("project_card"), z.literal("project_column"), z.literal("public"), z.literal("pull_request"), z.literal("pull_request_review"), z.literal("pull_request_review_comment"), z.literal("push"), z.literal("release"), z.literal("repository"), z.literal("repository_import"), z.literal("repository_vulnerability_alert"), z.literal("security_advisory"), z.literal("star"), z.literal("status"), z.literal("team"), z.literal("team_add"), z.literal("watch")])).optional(),
    options: z.object({ insecureSSL: booleanOrExpression.optional() }).optional()
  });
  return z.object({
    parameters: parametersSchema.optional()
  });
};
