export class RpcError {
  /**
   * @param httpResponseCode HTTP response code returned by the server (4xx or 5xx).
   * @param errorCode Application-specific error code.
   * @param message Optional error message (not user facing).
   */
  constructor(
    readonly httpResponseCode: number,
    readonly errorCode: string,
    readonly message?: string) {}
}
