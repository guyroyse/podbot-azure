param resourceToken string
param functionsPrincipalId string
param amsPrincipalId string

// Azure OpenAI Service
var accountName = 'oai-${resourceToken}'
var location = resourceGroup().location

resource openAiAccount 'Microsoft.CognitiveServices/accounts@2025-06-01' = {
  name: accountName
  location: location
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: accountName
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
    }
  }
}

// Model Deployment: gpt-4o (for AMS primary generation)
resource gpt4oDeployment 'Microsoft.CognitiveServices/accounts/deployments@2025-06-01' = {
  parent: openAiAccount
  name: 'gpt-4o'
  sku: {
    name: 'Standard'
    capacity: 30
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4o'
      version: '2024-08-06'
    }
  }
}

// Model Deployment: gpt-4o-mini (for AMS fast tasks and Azure Functions chatbot)
resource gpt4oMiniDeployment 'Microsoft.CognitiveServices/accounts/deployments@2025-06-01' = {
  parent: openAiAccount
  name: 'gpt-4o-mini'
  sku: {
    name: 'Standard'
    capacity: 30
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4o-mini'
      version: '2024-07-18'
    }
  }
  dependsOn: [
    gpt4oDeployment
  ]
}

// Model Deployment: text-embedding-3-small (for AMS semantic search)
resource embeddingDeployment 'Microsoft.CognitiveServices/accounts/deployments@2025-06-01' = {
  parent: openAiAccount
  name: 'text-embedding-3-small'
  sku: {
    name: 'Standard'
    capacity: 30
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'text-embedding-3-small'
      version: '1'
    }
  }
  dependsOn: [
    gpt4oMiniDeployment
  ]
}

// Assign Cognitive Services OpenAI User role to the Functions identity
var cognitiveServicesOpenAIUserRoleId = '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd'
var functionsRoleAssignmentName = guid(openAiAccount.id, functionsPrincipalId, cognitiveServicesOpenAIUserRoleId)
var roleDefinitionId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', cognitiveServicesOpenAIUserRoleId)

resource functionsRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: functionsRoleAssignmentName
  scope: openAiAccount
  properties: {
    roleDefinitionId: roleDefinitionId
    principalId: functionsPrincipalId
    principalType: 'ServicePrincipal'
  }
}

// Assign Cognitive Services OpenAI User role to the AMS identity
resource amsRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(openAiAccount.id, amsPrincipalId, cognitiveServicesOpenAIUserRoleId)
  scope: openAiAccount
  properties: {
    roleDefinitionId: roleDefinitionId
    principalId: amsPrincipalId
    principalType: 'ServicePrincipal'
  }
}

// Outputs
output id string = openAiAccount.id
output name string = openAiAccount.name
output endpoint string = openAiAccount.properties.endpoint
output gpt4oDeploymentName string = gpt4oDeployment.name
output gpt4oMiniDeploymentName string = gpt4oMiniDeployment.name
output embeddingDeploymentName string = embeddingDeployment.name
