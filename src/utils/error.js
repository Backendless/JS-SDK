export class BackendlessError extends Error {
  constructor(code, message, details) {
    super(message)

    this.name = 'Backendless Error'
    this.code = code
    this.message = message
    this.details = details
  }
}
