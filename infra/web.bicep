metadata description = 'Creates an Azure Static Web App with integrated Azure Functions backend.'

param location string = resourceGroup().location
param resourceToken string
param openAiEndpoint string
param openAiDeploymentName string
param functionsIdentityId string
param amsBaseUrl string
param applicationInsightsConnectionString string

@allowed([
  'Free'
  'Standard'
])
param sku string = 'Standard'

// Azure Static Web App
resource staticWebApp 'Microsoft.Web/staticSites@2024-11-01' = {
  name: 'swa-${resourceToken}'
  location: location
  sku: {
    name: sku
    tier: sku
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${functionsIdentityId}': {}
    }
  }
  properties: {
    repositoryUrl: ''
    branch: ''
    buildProperties: {
      appLocation: 'web'
      apiLocation: 'api'
      outputLocation: 'dist'
    }
  }
}

// Configure app settings for Azure Functions
resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2024-11-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    AZURE_OPENAI_ENDPOINT: openAiEndpoint
    AZURE_OPENAI_DEPLOYMENT_NAME: openAiDeploymentName
    AZURE_CLIENT_ID: reference(functionsIdentityId, '2023-01-31').clientId
    AMS_BASE_URL: amsBaseUrl
    AMS_CONTEXT_WINDOW_MAX: '4000'
    APPLICATIONINSIGHTS_CONNECTION_STRING: applicationInsightsConnectionString
  }
}

// Outputs
output id string = staticWebApp.id
output name string = staticWebApp.name
output uri string = 'https://${staticWebApp.properties.defaultHostname}'
output defaultHostname string = staticWebApp.properties.defaultHostname
