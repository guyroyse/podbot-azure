function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function login(username: string, password: string): Promise<boolean> {
  // Simulate network delay
  await delay(250)

  // Simple password check
  return !!username && password === 'password'
}
