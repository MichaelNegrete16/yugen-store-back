/**
 * Error lanzado cuando la pasarela responde con un estado HTTP de error.
 * `status` permite distinguir un rechazo del medio de pago (4xx) de una
 * caída real de la pasarela (5xx), que deben tratarse distinto.
 */
export class GatewayResponseError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'GatewayResponseError';
  }

  /** Un 4xx significa que la pasarela procesó la petición y la rechazó. */
  get isRejection(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}
