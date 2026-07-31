/**
 * Qwen Cloud Node - Version 1.1
 * Discriminator: resource=image, operation=generate
 */


interface Credentials {
  alibabaCloudApi: CredentialReference;
}

/** Creates an image from a text prompt */
export type LcAlibabaCloudV11ImageGenerateParams = {
  resource: 'image';
  operation: 'generate';
/**
 * Model
 * @searchListMethod imageGenerationModelSearch
 * @default {"mode":"list","value":""}
 */
    modelId?: { __rl: true; mode: 'list' | 'id'; value: string; cachedResultName?: string };
/**
 * The text prompt describing the image to generate
 */
    prompt: string | Expression<string>;
/**
 * Whether to download the generated image as binary data. When disabled, only the image URL is returned.
 * @default true
 */
    downloadImage?: boolean | Expression<boolean>;
/**
 * Options
 * @default {}
 */
    imageOptions?: {
    /** The size of the generated image
     * @displayOptions.show { /modelId: ["z-image-turbo", "wan2.6-t2i"] }
     * @default 1024*1024
     */
    size?: '1024*1024' | '720*1280' | '1280*720' | Expression<string>;
    /** The size of the generated image
     * @displayOptions.show { /modelId: ["qwen-image", "qwen-image-plus", "qwen-image-max"] }
     * @default 1664*928
     */
    size?: '1104*1472' | '1328*1328' | '1472*1104' | '1664*928' | '928*1664' | Expression<string>;
    /** Whether to automatically extend and enhance the prompt
     * @default false
     */
    promptExtend?: boolean | Expression<boolean>;
  };
};

export interface LcAlibabaCloudV11ImageGenerateSubnodeConfig {
  tools?: ToolInstance[];
}

export type LcAlibabaCloudV11ImageGenerateNode = {
  type: '@n8n/n8n-nodes-langchain.alibabaCloud';
  version: 1.1;
  isTrigger: true;
  config: NodeConfig<LcAlibabaCloudV11ImageGenerateParams> & { credentials?: Credentials } & { subnodes?: LcAlibabaCloudV11ImageGenerateSubnodeConfig };
};