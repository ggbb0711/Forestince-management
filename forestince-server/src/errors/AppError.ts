export class AppError extends Error {
  readonly status: number
  readonly isOk: boolean

  constructor(message: string, status: number, isOk = false) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.isOk = isOk
  }
}
