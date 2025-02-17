import { EmitterTimeoutError } from './errors'
import { 
  EmitterOptions,
  EmitterEvents,
  EventHandler,
  GlobalEventHandler,
  EmitterOnOptions,
  EmitterOnceOptions,
  EmitterNextOptions,
  GlobalEventHandlerResponse,
  EventPayload,
} from './types'

type EmitterState = {
  channel?: BroadcastChannel | null
}

export function createEmitter<TEvents extends EmitterEvents>(options?: EmitterOptions) {
  type TEvent = keyof TEvents

  const handlers = new Map<TEvent, Set<EventHandler>>()
  const globalHandlers = new Set<GlobalEventHandler<TEvents>>()
  const state: EmitterState = {}

  if(options) {
    setOptions(options)
  }

  function setOptions(options: EmitterOptions): void {
    const channel = getBroadcastChannel(options.broadcastChannel)

    if(channel) {
      channel.onmessage = onBroadcastChannelMessage
    }
    
    state.channel = channel
  }

  function onBroadcastChannelMessage({data}: MessageEvent) {
    const { event, payload } = data

    onEvent(event, payload)
  }

  function on(globalEventHandler: GlobalEventHandler<TEvents>, options?: EmitterOnOptions): () => void
  function on<E extends TEvent>(event: E, handler: EventHandler<EventPayload<TEvents, E>>, options?: EmitterOnOptions): () => void
  function on<E extends TEvent>(globalHandlerOrEvent: E | GlobalEventHandler<TEvents>, handlerOrOptions?: EventHandler<EventPayload<TEvents, E>> | EmitterOnOptions, options?: EmitterOnOptions): () => void {
    if (isGlobalEventHandler(globalHandlerOrEvent)) {
      const globalHandlerOptions = typeof handlerOrOptions === 'object' ? handlerOrOptions : {}

      return addGlobalHandler(globalHandlerOrEvent, globalHandlerOptions)
    }

    const handler = typeof handlerOrOptions === 'function' ? handlerOrOptions : undefined
    const event = globalHandlerOrEvent
    const handlerOptions = options ?? {}

    if (!handler) {
      throw new Error(`Handler must be given for ${String(event)} event`)
    }

    return addEventHandler(event, handler, handlerOptions)
  }

  function once(globalEventHandler: GlobalEventHandler<TEvents>, options?: EmitterOnceOptions): () => void
  function once<E extends TEvent>(event: E, handler: EventHandler<EventPayload<TEvents, E>>, options?: EmitterOnceOptions): () => void
  function once<E extends TEvent>(globalHandlerOrEvent: E | GlobalEventHandler<TEvents>, handlerOrOptions?: EventHandler<EventPayload<TEvents, E>> | EmitterOnceOptions, options?: EmitterOnceOptions): () => void {
    if (isGlobalEventHandler(globalHandlerOrEvent)) {
      const globalHandlerOptions = typeof handlerOrOptions === 'object' ? handlerOrOptions : {}

      const callback: GlobalEventHandler<TEvents> = (args) => {
        off(callback)
        globalHandlerOrEvent(args)
      }

      return addGlobalHandler(callback, globalHandlerOptions)
    }

    const event = globalHandlerOrEvent
    const handler = typeof handlerOrOptions === 'function' ? handlerOrOptions : undefined
    const handlerOptions = options ?? {}

    if (!handler) {
      throw new Error(`Handler must be given for ${String(event)} event`)
    }

    const callback: EventHandler<EventPayload<TEvents, E>> = (args) => {
      off(event, callback)
      handler(args)
    }

    return addEventHandler(event, callback, handlerOptions)
  }

  function next(options?: EmitterNextOptions): Promise<GlobalEventHandlerResponse<TEvents>>
  function next<E extends TEvent>(event: E, options?: EmitterNextOptions): Promise<EventPayload<TEvents, E>>
  function next<E extends TEvent>(eventOrOptions?: E | EmitterNextOptions, options?: EmitterNextOptions): Promise<GlobalEventHandlerResponse<TEvents> |EventPayload<TEvents, E>> {
    const event = typeof eventOrOptions === 'string' ? eventOrOptions : undefined
    const { timeout } = typeof eventOrOptions === 'object' ? eventOrOptions : options ?? {}

    if(event) {
      return new Promise((resolve, reject) => {
        once(event, resolve)

        if(timeout) {
          setTimeout(() => {
            reject(new EmitterTimeoutError(event, timeout))
          }, timeout)
        }
      })
    }

    return new Promise((resolve, reject) => {
      once(resolve)

      if(timeout) {
        setTimeout(() => {
          reject(new EmitterTimeoutError('global', timeout))
        }, timeout)
      }
    })
  }

  function off(globalEventHandler: GlobalEventHandler<TEvents>): void
  function off<E extends TEvent>(event: E): void
  function off<E extends TEvent>(event: E, handler: EventHandler<EventPayload<TEvents, E>>): void
  function off<E extends TEvent>(globalHandlerOrEvent: E, handler?: EventHandler<EventPayload<TEvents, E>>): void {
    if (isGlobalEventHandler(globalHandlerOrEvent)) {
      globalHandlers.delete(globalHandlerOrEvent)
      return
    }

    const event = globalHandlerOrEvent
    const eventHandlers = handlers.get(event)

    if (handler) {
      eventHandlers?.delete(handler)
      return
    }
    
    eventHandlers?.clear()
  }

  function emit<E extends TEvent>(event: undefined extends EventPayload<TEvents, E> ? E : never): void
  function emit<E extends TEvent>(event: E, payload: EventPayload<TEvents, E>): void
  function emit<E extends TEvent>(event: E, payload?: EventPayload<TEvents, E>): void {
    state.channel?.postMessage({ event, payload })

    onEvent(event, payload!)
  }

  function clear(): void {
    handlers.clear()
    globalHandlers.clear()
  }

  function isGlobalEventHandler(value: unknown): value is GlobalEventHandler<TEvents> {
    return typeof value === 'function'
  }

  function onEvent<E extends TEvent>(event: E, payload: EventPayload<TEvents, E>): void {
    handlers.get(event)?.forEach(handler => handler(payload))

    globalHandlers.forEach(handler => handler({
      kind: event,
      payload,
    }))
  }

  function addGlobalHandler(globalEventHandler: GlobalEventHandler<TEvents>, options?: EmitterOnOptions): () => void {
    const { signal } = options ?? {}

    if(signal?.aborted) {
      return () => {}
    }

    globalHandlers.add(globalEventHandler)

    const offHandler = () => off(globalEventHandler)

    signal?.addEventListener('abort', offHandler)

    return offHandler
  }

  function addEventHandler<E extends TEvent>(event: E, handler: EventHandler<EventPayload<TEvents, E>>, options?: EmitterOnOptions): () => void {
    const { signal } = options ?? {}

    if(signal?.aborted) {
      return () => {}
    }

    if(!handlers.has(event)){
      handlers.set(event, new Set())
    }
    
    handlers.get(event)?.add(handler)

    const offHandler = () => off(event, handler)

    signal?.addEventListener('abort', offHandler)

    return offHandler
  }

  return {
    on,
    off,
    once,
    next,
    emit,
    clear,
    setOptions,
  }
}

function getBroadcastChannel(useBroadcastChannel: string = ''): BroadcastChannel | null {
  if(useBroadcastChannel) {
    return new BroadcastChannel(useBroadcastChannel)
  }

  return null
}