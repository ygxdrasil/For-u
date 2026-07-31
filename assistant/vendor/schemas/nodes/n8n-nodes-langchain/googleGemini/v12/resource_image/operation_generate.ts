/**
 * Google Gemini Node - Version 1.2
 * Discriminator: resource=image, operation=generate
 */


interface Credentials {
  googlePalmApi: CredentialReference;
}

/** Creates an image from a text prompt */
export type LcGoogleGeminiV12ImageGenerateParams = {
  resource: 'image';
  operation: 'generate';
/**
 * Model
 * @searchListMethod imageGenerationModelSearch
 * @default {"mode":"list","value":"models/gemini-3.1-flash-image-preview"}
 */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * A text description of the desired image(s)
 */
    prompt?: string | Expression<string>;
/**
 * Options
 * @default {}
 */
    options?: {
    /** Number of images to generate
     * @displayOptions.show { /modelId: [{"_cnd":{"includes":"imagen"}}] }
     * @default 1
     */
    sampleCount?: number | Expression<number>;
    /** Put Output in Field
     * @hint The name of the output field to put the binary file data in
     * @default data
     */
    binaryPropertyOutput?: string | Expression<string>;
  };
};

export interface LcGoogleGeminiV12ImageGenerateSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcGoogleGeminiV12ImageGenerateNode = {
  type: '@n8n/n8n-nodes-langchain.googleGemini';
  version: 1.2;
  isTrigger: true;
  config: NodeConfig<LcGoogleGeminiV12ImageGenerateParams> & { credentials?: Credentials } & { subnodes?: LcGoogleGeminiV12ImageGenerateSubnodeConfig };
};