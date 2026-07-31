/**
 * Anthropic Chat Model Node - Version 1.4
 * Language Model Anthropic
 */


export interface LcLmChatAnthropicV14Params {
/**
 * The model. Choose from the list, or specify an ID. &lt;a href="https://docs.anthropic.com/claude/docs/models-overview"&gt;Learn more&lt;/a&gt;.
 * @builderHint Default to claude-sonnet-4-6 (latest Sonnet); use claude-opus-4-7 when the user needs the most capable model. Never use Claude Sonnet 4.5, Claude 3.x, Claude 2, or LEGACY options — those are superseded and are not valid choices. When extended thinking is needed on Opus 4.7+, set Thinking Mode to Adaptive and choose an Effort level. The legacy Manual thinking mode is rejected by Opus 4.7.
 * @searchListMethod searchModels
 * @default {"mode":"list","value":"claude-sonnet-4-6","cachedResultName":"Claude Sonnet 4.6"}
 */
    model?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Additional options to add
 * @default {}
 */
    options?: {
    /** The maximum number of tokens to generate in the completion
     * @default 4096
     */
    maxTokensToSample?: number | Expression<number>;
    /** Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive. Not supported on newer Anthropic models (Claude Opus 4.7+, Claude Sonnet 5+) — ignored there.
     * @displayOptions.hide { thinking: [true], thinkingMode: ["adaptive", "manual"] }
     * @default 0.7
     */
    temperature?: number | Expression<number>;
    /** Used to remove "long tail" low probability responses. Defaults to -1, which disables it. Not supported on newer Anthropic models (Claude Opus 4.7+, Claude Sonnet 5+) — ignored there.
     * @displayOptions.hide { thinking: [true], thinkingMode: ["adaptive", "manual"] }
     * @default -1
     */
    topK?: number | Expression<number>;
    /** Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both. Not supported on newer Anthropic models (Claude Opus 4.7+, Claude Sonnet 5+) — ignored there.
     * @displayOptions.hide { thinking: [true], thinkingMode: ["adaptive", "manual"] }
     * @default 1
     */
    topP?: number | Expression<number>;
    /** Whether to enable thinking mode for the model
     * @default false
     */
    thinking?: boolean | Expression<boolean>;
    /** The maximum number of tokens to use for thinking
     * @displayOptions.show { thinking: [true] }
     * @default 1024
     */
    thinkingBudget?: number | Expression<number>;
    /** How extended thinking should be configured for the model
     * @default disabled
     */
    thinkingMode?: 'disabled' | 'adaptive' | 'manual' | Expression<string>;
    /** Effort level for adaptive thinking
     * @displayOptions.show { thinkingMode: ["adaptive"], /model.value: [{"_cnd":{"includes":"opus"}}] }
     * @default medium
     */
    effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max' | Expression<string>;
    /** Effort level for adaptive thinking
     * @displayOptions.show { thinkingMode: ["adaptive"], /model.value: [{"_cnd":{"regex":"^(?!.*opus).*"}}] }
     * @default medium
     */
    effort?: 'low' | 'medium' | 'high' | Expression<string>;
    /** Maximum tokens used for thinking. Manual mode is rejected by Opus 4.7+.
     * @displayOptions.show { thinkingMode: ["manual"] }
     * @default 1024
     */
    thinkingBudget?: number | Expression<number>;
    /** Whether the model should stream its response over Server-Sent Events instead of returning a single non-streamed payload. Final output shape is unchanged.
     * @default false
     */
    streaming?: boolean | Expression<boolean>;
  };
}

export interface LcLmChatAnthropicV14Credentials {
  anthropicApi: CredentialReference;
}

interface LcLmChatAnthropicV14NodeBase {
  type: '@n8n/n8n-nodes-langchain.lmChatAnthropic';
  version: 1.4;
}

export type LcLmChatAnthropicV14ParamsNode = LcLmChatAnthropicV14NodeBase & {
  config: NodeConfig<LcLmChatAnthropicV14Params> & { credentials?: LcLmChatAnthropicV14Credentials };
};

export type LcLmChatAnthropicV14Node = LcLmChatAnthropicV14ParamsNode;