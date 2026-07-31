/**
 * Google Gemini Node - Version 1.2
 * Discriminator: resource=audio, operation=analyze
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Take in audio and answer questions about it */
export type LcGoogleGeminiV12AudioAnalyzeParams = {
  resource: 'audio';
  operation: 'analyze';
/**
 * Model
 * @searchListMethod audioModelSearch
 * @default {"mode":"list","value":""}
 */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * Text Input
 * @default What's in this audio?
 */
    text?: string | Expression<string>;
/**
 * Input Type
 * @default url
 */
    inputType?: 'url' | 'binary' | Expression<string>;
/**
 * URL(s) of the audio(s) to analyze, multiple URLs can be added separated by comma
 * @displayOptions.show { inputType: ["url"] }
 */
    audioUrls?: string | Expression<string>;
/**
 * Name of the binary field(s) which contains the audio(s), seperate multiple field names with commas
 * @hint The name of the input field containing the binary file data to be processed
 * @displayOptions.show { inputType: ["binary"] }
 * @default data
 */
    binaryPropertyName?: string | Expression<string>;
/**
 * Whether to simplify the response or not
 * @default true
 */
    simplify?: boolean | Expression<boolean>;
/**
 * Options
 * @default {}
 */
    options?: {
    /** Fewer tokens will result in shorter, less detailed audio description
     * @default 300
     */
    maxOutputTokens?: number | Expression<number>;
  };
};

export interface LcGoogleGeminiV12AudioAnalyzeSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV12AudioAnalyzeNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1.2;
  isTrigger: true;
  config: NodeConfig<LcGoogleGeminiV12AudioAnalyzeParams> & { credentials?: Credentials } & { subnodes?: LcGoogleGeminiV12AudioAnalyzeSubnodeConfig };
};