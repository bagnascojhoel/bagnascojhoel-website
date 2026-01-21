export class ExternalServiceError extends Error {
  constructor(
    message: string,
    public readonly service: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ExternalServiceError';
    Object.setPrototypeOf(this, ExternalServiceError.prototype);
  }
}
