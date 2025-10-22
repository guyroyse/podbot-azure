param resourceToken string
param principalId string

// Azure Managed Redis Enterprise Cache
var resourceName = 'redis-${resourceToken}'
var location = resourceGroup().location

resource redisEnterprise 'Microsoft.Cache/redisEnterprise@2025-07-01' = {
  name: resourceName
  location: location
  sku: {
    name: 'Balanced_B1'
    capacity: 2
  }
  properties: {
    minimumTlsVersion: '1.2'
    highAvailability: 'Disabled'
    publicNetworkAccess: 'Enabled'
  }
}

// Redis Database (child resource)
resource database 'Microsoft.Cache/redisEnterprise/databases@2025-07-01' = {
  parent: redisEnterprise
  name: 'default'
  properties: {
    clientProtocol: 'Encrypted'
    port: 10000
    clusteringPolicy: 'EnterpriseCluster'
    evictionPolicy: 'NoEviction'
    accessKeysAuthentication: 'Disabled'
    modules: [
      {
        name: 'RediSearch'
      }
      {
        name: 'RedisJSON'
      }
    ]
  }
}

// Assign Redis Data Contributor role to the principal
var redisDataContributorRoleId = 'cd43a23e-5e26-4f21-bfc5-88e9ddd8eee1'
var roleAssignmentName = guid(redisEnterprise.id, principalId, redisDataContributorRoleId)
var roleDefinitionId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', redisDataContributorRoleId)

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: roleAssignmentName
  scope: redisEnterprise
  properties: {
    roleDefinitionId: roleDefinitionId
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}

// Outputs
output id string = redisEnterprise.id
output name string = redisEnterprise.name
output hostName string = redisEnterprise.properties.hostName
output port int = database.properties.port
output databaseId string = database.id
