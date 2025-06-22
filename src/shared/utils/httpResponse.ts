export function badRequest(error: string, details?: any) {
  return {
    statusCode: 400,
    body: JSON.stringify({
      error,
      ...(details && { details }),
    }),
  };
}

export function success(statusCode = 200, data: any) {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
}

export function internalError(message = "Error interno") {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: message }),
  };
}
