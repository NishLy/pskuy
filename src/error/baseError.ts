export class BaseClientError extends Error {
  cause?: Record<string, string>;
  flatten() {
    if (this.cause) return { message: this.message, cause: this.cause };
    return undefined;
  }
}
