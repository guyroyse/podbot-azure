import 'dotenv/config'

export const config = {
  port: process.env.PORT ?? 3001,
  nodeEnv: process.env.NODE_ENV ?? 'dev',

  // OpenAI (local development)
  openaiApiKey: process.env.OPENAI_API_KEY,

  // Azure OpenAI (production with managed identity)
  azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  azureOpenAIDeployment: process.env.AZURE_OPENAI_DEPLOYMENT,
  azureClientId: process.env.AZURE_CLIENT_ID,

  // AMS
  amsBaseUrl: process.env.AMS_BASE_URL ?? 'http://localhost:8000',
  amsContextWindowMax: process.env.AMS_CONTEXT_WINDOW_MAX ? parseInt(process.env.AMS_CONTEXT_WINDOW_MAX) : 4000
}
