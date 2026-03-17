export interface ApiResponse<T = unknown> {
  payload: T
  message: string
  isOk: boolean
}
