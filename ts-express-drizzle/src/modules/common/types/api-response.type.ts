export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

type ApiSuccess<T> = {
  success: true
  status: number
  message?: string
  data?: T
}

type ApiError = {
  success: false
  status: number
  message?: string
  details?: {
    [field: string]: string[]
  }
}
