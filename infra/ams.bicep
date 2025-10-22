metadata description = 'Creates an Azure Container App running the Agent Memory Server (AMS) with Redis backend.'

param location string = resourceGroup().location
param resourceToken string
param containerAppsEnvironmentId string
param identityId string
param identityClientId string
param redisHost string
param redisPort int
param openAiEndpoint string
param gpt4oDeploymentName string
param gpt4oMiniDeploymentName string
param embeddingDeploymentName string

// Agent Memory Server Container App
resource ams 'Microsoft.App/containerApps@2025-07-01' = {
  name: 'ca-ams-${resourceToken}'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identityId}': {}
    }
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironmentId
    configuration: {
      ingress: {
        external: true
        targetPort: 8000
        transport: 'http'
        allowInsecure: false
      }
    }
    template: {
      containers: [
        {
          name: 'ams'
          image: 'redis/agent-memory-server:latest'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            {
              name: 'REDIS_HOST'
              value: redisHost
            }
            {
              name: 'REDIS_PORT'
              value: string(redisPort)
            }
            {
              name: 'REDIS_SSL'
              value: 'true'
            }
            {
              name: 'AZURE_CLIENT_ID'
              value: identityClientId
            }
            {
              name: 'REDIS_USE_ENTRA_ID'
              value: 'true'
            }
            {
              name: 'AZURE_OPENAI_ENDPOINT'
              value: openAiEndpoint
            }
            {
              name: 'AZURE_OPENAI_DEPLOYMENT'
              value: gpt4oDeploymentName
            }
            {
              name: 'AZURE_OPENAI_FAST_DEPLOYMENT'
              value: gpt4oMiniDeploymentName
            }
            {
              name: 'AZURE_OPENAI_EMBEDDING_DEPLOYMENT'
              value: embeddingDeploymentName
            }
            {
              name: 'OPENAI_API_TYPE'
              value: 'azure'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
}

// Outputs
output id string = ams.id
output name string = ams.name
output uri string = 'https://${ams.properties.configuration.ingress.fqdn}'
output fqdn string = ams.properties.configuration.ingress.fqdn
