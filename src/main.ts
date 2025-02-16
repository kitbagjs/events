export type EmitterOptions = {
  broadcastChannel?: string
}

type Handler<T = any> = (...payload: T[]) => void

type Events = Record<string, unknown>

export type GlobalEventHandler<T extends Events> = (event: GlobalEvent<T>) => void

export type GlobalEvent<T extends Events> = {
  [K in keyof T]: {
    kind: K,
    payload: T[K],
  }
}[keyof T]

export type NextOptions = {
  timeout?: number
}

export type EmitterOnOptions = {
  signal?: AbortSignal
}

export type EmitterOnceOptions = {
  signal?: AbortSignal
}

export class EmitterTimeoutError extends Error {
  constructor(event: string, timeout: number) {
    super(`Timeout waiting for ${event} event after ${timeout}ms`)
  }
}

type EmitterState = {
  channel?: BroadcastChannel | null
}

function getBroadcastChannel(useBroadcastChannel: string = ''): BroadcastChannel | null {
  if(useBroadcastChannel) {
    return new BroadcastChannel(useBroadcastChannel)
  }

  return null
}

export function createEmitter<T extends Events>(options?: EmitterOptions) {
  type Event = keyof T
  type EventPayload<E extends Event> = T[E]
  type Handlers = Set<Handler>

  const handlers = new Map<Event, Handlers>()
  const globalHandlers = new Set<GlobalEventHandler<T>>()
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

  function on(globalEventHandler: GlobalEventHandler<T>, options?: EmitterOnOptions): () => void
  function on<E extends Event>(event: E, handler: Handler<EventPayload<E>>, options?: EmitterOnOptions): () => void
  function on<E extends Event>(globalHandlerOrEvent: E | GlobalEventHandler<T>, handlerOrOptions?: Handler<EventPayload<E>> | EmitterOnOptions, options?: EmitterOnOptions): () => void {
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

  function once(globalEventHandler: GlobalEventHandler<T>, options?: EmitterOnceOptions): () => void
  function once<E extends Event>(event: E, handler: Handler<EventPayload<E>>, options?: EmitterOnceOptions): () => void
  function once<E extends Event>(globalHandlerOrEvent: E | GlobalEventHandler<T>, handlerOrOptions?: Handler<EventPayload<E>> | EmitterOnceOptions, options?: EmitterOnceOptions): () => void {
    if (isGlobalEventHandler(globalHandlerOrEvent)) {
      const globalHandlerOptions = typeof handlerOrOptions === 'object' ? handlerOrOptions : {}

      const callback: GlobalEventHandler<T> = (args) => {
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

    const callback: Handler<EventPayload<E>> = (args) => {
      off(event, callback)
      handler(args)
    }

    return addEventHandler(event, callback, handlerOptions)
  }

  function next(options?: NextOptions): Promise<GlobalEvent<T>>
  function next<E extends Event>(event: E, options?: NextOptions): Promise<EventPayload<E>>
  function next<E extends Event>(eventOrOptions?: E | NextOptions, options?: NextOptions): Promise<GlobalEvent<T> |EventPayload<E>> {
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

  function off(globalEventHandler: GlobalEventHandler<T>): void
  function off<E extends Event>(event: E): void
  function off<E extends Event>(event: E, handler: Handler<EventPayload<E>>): void
  function off<E extends Event>(globalHandlerOrEvent: E, handler?: Handler<EventPayload<E>>): void {
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

  function emit<E extends Event>(event: undefined extends EventPayload<E> ? E : never): void
  function emit<E extends Event>(event: E, payload: EventPayload<E>): void
  function emit<E extends Event>(event: E, payload?: EventPayload<E>): void {
    state.channel?.postMessage({ event, payload })

    onEvent(event, payload!)
  }

  function clear(): void {
    handlers.clear()
    globalHandlers.clear()
  }

  function isGlobalEventHandler(value: unknown): value is GlobalEventHandler<T> {
    return typeof value === 'function'
  }

  function onEvent<E extends Event>(event: E, payload: EventPayload<E>): void {
    handlers.get(event)?.forEach(handler => handler(payload))

    globalHandlers.forEach(handler => handler({
      kind: event,
      payload,
    }))
  }

  function addGlobalHandler(globalEventHandler: GlobalEventHandler<T>, options?: EmitterOnOptions): () => void {
    const { signal } = options ?? {}

    if(signal?.aborted) {
      return () => {}
    }

    globalHandlers.add(globalEventHandler)

    signal?.addEventListener('abort', () => off(globalEventHandler))

    return () => off(globalEventHandler)
  }

  function addEventHandler<E extends Event>(event: E, handler: Handler<EventPayload<E>>, options?: EmitterOnOptions): () => void {
    const { signal } = options ?? {}

    if(signal?.aborted) {
      return () => {}
    }

    const existing = handlers.get(event)

    if (existing) {
      existing.add(handler)
    } else {
      handlers.set(event, new Set([handler]))
    }

    if(signal) {
      signal.addEventListener('abort', () => off(event, handler))
    }

    return () => off(event, handler)
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