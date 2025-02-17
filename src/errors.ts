/**
 * An error thrown when a timeout occurs while waiting for an event to be emitted.
 * @group Errors
 */
export class EmitterTimeoutError extends Error {
  constructor(event: string, timeout: number) {
    super(`Timeout waiting for ${event} event after ${timeout}ms`)
  }
}
