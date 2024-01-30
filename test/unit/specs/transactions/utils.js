import { prepareMockRequest } from '../../helpers/sandbox'

export function prepareSuccessResponse(results) {
  return prepareMockRequest(() => ({
    body: {
      success: true,
      error  : null,
      results: results || {}
    }
  }))
}

export function prepareErrorResponse(message, operation, code) {
  return prepareMockRequest(() => ({
    body: {
      success: false,
      results: null,
      error  : {
        message,
        code,
        operation
      },
    }
  }))
}

