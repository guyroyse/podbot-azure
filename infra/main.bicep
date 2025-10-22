targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment which is used to generate a short unique hash used in all resources.')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))

// ==============================================================================
// FOUNDATION: Resource Group
// ==============================================================================

resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${environmentName}'
  location: location
}

// ==============================================================================
// ENVIRONMENT: Shared Infrastructure & Services
// ==============================================================================

// Container Apps environment for hosting AMS
module containerAppsEnvironment './containers.bicep' = {
  name: 'container-apps-env'
  scope: resourceGroup
  params: {
    resourceToken: resourceToken
    logAnalyticsWorkspaceId: monitoring.outputs.logAnalyticsWorkspaceId
  }
}

// Monitor application with Azure Monitor (Application Insights)
module monitoring './monitoring.bicep' = {
  name: 'monitoring'
  scope: resourceGroup
  params: {
    resourceToken: resourceToken
  }
}

// User-assigned managed identities
module identities './identities.bicep' = {
  name: 'identities'
  scope: resourceGroup
  params: {
    resourceToken: resourceToken
  }
}

// ==============================================================================
// APPLICATION: Core Services
// ==============================================================================

// Azure OpenAI Service
module openAi './openai.bicep' = {
  name: 'openai'
  scope: resourceGroup
  params: {
    resourceToken: resourceToken
    functionsPrincipalId: identities.outputs.functionsPrincipalId
    amsPrincipalId: identities.outputs.amsPrincipalId
  }
}

// Azure Managed Redis (Redis Enterprise)
module redis './redis.bicep' = {
  name: 'redis'
  scope: resourceGroup
  params: {
    resourceToken: resourceToken
    principalId: identities.outputs.amsPrincipalId
  }
}

// Agent Memory Server (AMS) Container App
module ams './ams.bicep' = {
  name: 'ams'
  scope: resourceGroup
  params: {
    resourceToken: resourceToken
    containerAppsEnvironmentId: containerAppsEnvironment.outputs.id
    identityId: identities.outputs.amsIdentityId
    identityClientId: identities.outputs.amsClientId
    redisHost: redis.outputs.hostName
    redisPort: redis.outputs.port
    openAiEndpoint: openAi.outputs.endpoint
    gpt4oDeploymentName: openAi.outputs.gpt4oDeploymentName
    gpt4oMiniDeploymentName: openAi.outputs.gpt4oMiniDeploymentName
    embeddingDeploymentName: openAi.outputs.embeddingDeploymentName
  }
}

// Static Web App with integrated Azure Functions
module web './web.bicep' = {
  name: 'web'
  scope: resourceGroup
  params: {
    resourceToken: resourceToken
    openAiEndpoint: openAi.outputs.endpoint
    openAiDeploymentName: openAi.outputs.gpt4oMiniDeploymentName
    functionsIdentityId: identities.outputs.functionsIdentityId
    amsBaseUrl: ams.outputs.uri
    applicationInsightsConnectionString: monitoring.outputs.applicationInsightsConnectionString
  }
}

// ==============================================================================
// OUTPUTS: Deployment Information
// ==============================================================================

output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_RESOURCE_GROUP string = resourceGroup.name

output AZURE_OPENAI_ENDPOINT string = openAi.outputs.endpoint
output AZURE_OPENAI_GPT4O_DEPLOYMENT string = openAi.outputs.gpt4oDeploymentName
output AZURE_OPENAI_GPT4O_MINI_DEPLOYMENT string = openAi.outputs.gpt4oMiniDeploymentName
output AZURE_OPENAI_EMBEDDING_DEPLOYMENT string = openAi.outputs.embeddingDeploymentName

output REDIS_HOSTNAME string = redis.outputs.hostName
output REDIS_PORT int = redis.outputs.port

output AMS_URI string = ams.outputs.uri
output AMS_IDENTITY_CLIENT_ID string = identities.outputs.amsClientId

output WEB_URI string = web.outputs.uri
output APPLICATIONINSIGHTS_CONNECTION_STRING string = monitoring.outputs.applicationInsightsConnectionString
