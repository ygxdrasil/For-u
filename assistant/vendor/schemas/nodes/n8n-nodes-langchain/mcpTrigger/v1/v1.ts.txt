/**
 * MCP Server Trigger Node - Version 1
 * Expose n8n tools as an MCP Server endpoint
 */


export interface LcMcpTriggerV1Params {
/**
 * The way to authenticate
 * @builderHint Default to 'none'. n8n exposes inbound trigger URLs publicly by design. Only select an authentication method when the user explicitly asks to authenticate inbound traffic.
 * @default none
 */
    authentication?: 'none' | 'n8nOAuth2' | 'bearerAuth' | 'headerAuth' | Expression<string>;
/**
 * Whether the triggering user must also have permission to execute the workflow in the project it belongs to
 * @displayOptions.show { authentication: ["n8nOAuth2"] }
 * @default true
 */
    requireExecuteAccess?: boolean | Expression<boolean>;
/**
 * The base path for this MCP server
 */
    path: string | Expression<string>;
}

export interface LcMcpTriggerV1SubnodeConfig {
  tools?: ToolInstance[];
}

export interface LcMcpTriggerV1Credentials {
  httpBearerAuth: CredentialReference;
  httpHeaderAuth: CredentialReference;
}

interface LcMcpTriggerV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.mcpTrigger';
  version: 1;
}

export type LcMcpTriggerV1ParamsNode = LcMcpTriggerV1NodeBase & {
  config: NodeConfig<LcMcpTriggerV1Params> & { credentials?: LcMcpTriggerV1Credentials } & { subnodes?: LcMcpTriggerV1SubnodeConfig };
};

export type LcMcpTriggerV1Node = LcMcpTriggerV1ParamsNode;