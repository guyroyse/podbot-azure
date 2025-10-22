metadata description = 'Creates user-assigned managed identities for the application.'

param resourceToken string

// User-assigned managed identity for AMS Container App
resource amsIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2024-11-30' = {
  name: 'id-ams-${resourceToken}'
  location: resourceGroup().location
}

// User-assigned managed identity for Azure Functions
resource functionsIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2024-11-30' = {
  name: 'id-functions-${resourceToken}'
  location: resourceGroup().location
}

// AMS Identity Outputs
output amsIdentityId string = amsIdentity.id
output amsIdentityName string = amsIdentity.name
output amsPrincipalId string = amsIdentity.properties.principalId
output amsClientId string = amsIdentity.properties.clientId

// Functions Identity Outputs
output functionsIdentityId string = functionsIdentity.id
output functionsIdentityName string = functionsIdentity.name
output functionsPrincipalId string = functionsIdentity.properties.principalId
output functionsClientId string = functionsIdentity.properties.clientId
