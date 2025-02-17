export type { 
  EmitterOptions,
  EmitterEvents,
  EventHandler,
  GlobalEventHandler,
  EmitterOnOptions,
  EmitterOnceOptions,
  EmitterNextOptions,
  GlobalEventHandlerResponse,
} from './types'

export { createEmitter } from './createEmitter'
export { EmitterTimeoutError } from './errors'