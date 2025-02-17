export type { 
  EmitterOptions,
  EmitterEvents,
  EventPayload,
  EventHandler,
  GlobalEventHandler,
  EmitterOnOptions,
  EmitterOnceOptions,
  EmitterNextOptions,
  GlobalEventHandlerResponse,
} from './types'

export { createEmitter } from './createEmitter'
export { EmitterTimeoutError } from './errors'