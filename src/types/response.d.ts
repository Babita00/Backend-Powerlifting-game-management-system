export type SuccessPayload<T> = {
  success: true
  message?: string
  data?: T
  meta?: T
}

export type ErrorPayload = {
  success: false
  message: string
  info?: unknown
}
