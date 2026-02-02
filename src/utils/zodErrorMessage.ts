import { ZodSafeParseError } from 'zod'

export const zodErrorMessage = (
  zodError: ZodSafeParseError<unknown>
): { message: string; data: Record<string, string[]> } => {
  const errorMap: Record<string, string[]> = {}

  zodError.error.issues.forEach(issue => {
    const rawPath = issue.path[0] ?? 'unknown'
    const path = String(rawPath)

    if (!errorMap[path]) {
      errorMap[path] = [issue.message]
    } else {
      errorMap[path].push(issue.message)
    }
  })

  return {
    message: 'Field error',
    data: errorMap,
  }
}
