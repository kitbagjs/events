export class EmitterTimeoutError extends Error {
  constructor(event: string, timeout: number) {
    super(`Timeout waiting for ${event} event after ${timeout}ms`)
  }
}
