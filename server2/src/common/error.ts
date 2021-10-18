
export interface HttpError {
  readonly httpStatusCode: number;
  readonly code: string;
  readonly message?: string;
}

export function isHttpError(object: any): object is HttpError {
  return typeof object === 'object' && object.httpStatusCode !== undefined;
}

export function httpError({httpStatusCode, code, message}: {
  httpStatusCode?: number, code: string,
  message?: string,
}): HttpError {
  return {code, httpStatusCode: httpStatusCode ?? 400, message};
}