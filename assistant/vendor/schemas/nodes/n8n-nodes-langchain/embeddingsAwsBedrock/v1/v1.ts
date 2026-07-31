/**
 * Embeddings AWS Bedrock Node - Version 1
 * Use Embeddings AWS Bedrock
 */


export interface LcEmbeddingsAwsBedrockV1Params {
  authentication?: 'iam' | 'assumeRole' | Expression<string>;
/**
 * The model which will generate the completion. &lt;a href="https://docs.aws.amazon.com/bedrock/latest/userguide/foundation-models.html"&gt;Learn more&lt;/a&gt;.
 */
    model?: string | Expression<string>;
}

export interface LcEmbeddingsAwsBedrockV1Credentials {
  aws: CredentialReference;
  awsAssumeRole: CredentialReference;
}

interface LcEmbeddingsAwsBedrockV1NodeBase {
  type: '@n8n/n8n-nodes-langchain.embeddingsAwsBedrock';
  version: 1;
}

export type LcEmbeddingsAwsBedrockV1ParamsNode = LcEmbeddingsAwsBedrockV1NodeBase & {
  config: NodeConfig<LcEmbeddingsAwsBedrockV1Params> & { credentials?: LcEmbeddingsAwsBedrockV1Credentials };
};

export type LcEmbeddingsAwsBedrockV1Node = LcEmbeddingsAwsBedrockV1ParamsNode;