import type { Role } from '@services/podbot-service'

/**
 * Convert a role to a display name for the UI
 */
export function roleToDisplayName(role: Role): string {
  switch (role) {
    case 'user':
      return 'You'
    case 'assistant':
      return 'PodBot'
    case 'system':
      return 'System'
    default:
      return role
  }
}

/**
 * Get CSS class for a role
 */
export function roleToClass(role: Role): string {
  switch (role) {
    case 'user':
      return 'user'
    case 'assistant':
      return 'assistant'
    case 'system':
      return 'system'
    default:
      return role
  }
}

