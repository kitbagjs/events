export type EmitterOptions = {
  broadcastChannel?: string
}

type Handler<T = any> = (...payload: T[]) => void

type Events = Record<string, unknown>

type GlobalEvent<T extends Events> = {
  [K in keyof T]: {
    kind: K,
    payload: T[K],
  }
}[keyof T]

function getBroadcastChannel(useBroadcastChannel: string = ''): BroadcastChannel | null {
  if(useBroadcastChannel) {
    return new BroadcastChannel(useBroadcastChannel)
  }

  return null
}

export function createEmitter<T extends Events>({ broadcastChannel: useBroadcastChannel }: EmitterOptions = {}) {
  type Event = keyof T
  type EventPayload<E extends Event> = T[E]
  type Handlers = Set<Handler>
  type GlobalEventHandler = (event: GlobalEvent<T>) => void

  const handlers = new Map<Event, Handlers>()
  const globalHandlers = new Set<GlobalEventHandler>()
  const broadcast = getBroadcastChannel(useBroadcastChannel)

  if(broadcast) {
    broadcast.onmessage = ({ data }) => {
      const { event, payload } = data

      onEvent(event, payload)
    }
  }

  function on(globalEventHandler: GlobalEventHandler): () => void
  function on<E extends Event>(event: E, handler: Handler<EventPayload<E>>): () => void
  function on<E extends Event>(globalHandlerOrEvent: E | GlobalEventHandler, handler?: Handler<EventPayload<E>>): () => void {
    if (isGlobalEventHandler(globalHandlerOrEvent)) {
      globalHandlers.add(globalHandlerOrEvent)
      
      return () => off(globalHandlerOrEvent)
    }

    const event = globalHandlerOrEvent

    if (!handler) {
      throw new Error(`Handler must be given for ${String(event)} event`)
    }

    const existing = handlers.get(event)

    if (existing) {
      existing.add(handler)
    } else {
      handlers.set(event, new Set([handler]))
    }

    return () => off(event, handler)
  }

  function once(globalEventHandler: GlobalEventHandler): void
  function once<E extends Event>(event: E, handler: Handler<EventPayload<E>>): void
  function once<E extends Event>(globalHandlerOrEvent: E | GlobalEventHandler, handler?: Handler<EventPayload<E>>): void {
    if (isGlobalEventHandler(globalHandlerOrEvent)) {
      const callback: GlobalEventHandler = (args) => {
        off(callback)
        globalHandlerOrEvent(args)
      }

      on(callback)
      return
    }
    
    const event = globalHandlerOrEvent

    if (!handler) {
      throw new Error(`Handler must be given for ${String(event)} event`)
    }

    const callback: Handler<EventPayload<E>> = (args) => {
      off(event, callback)
      handler(args)
    }

    on(event, callback)
  }

  function off(globalEventHandler: GlobalEventHandler): void
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
  }

  function emit<E extends Event>(event: undefined extends EventPayload<E> ? E : never): void
  function emit<E extends Event>(event: E, payload: EventPayload<E>): void
  function emit<E extends Event>(event: E, payload?: EventPayload<E>): void {
    if(broadcast) {
      broadcast.postMessage({ event, payload })
    }

    onEvent(event, payload!)
  }

  function clear(): void {
    handlers.clear()
    globalHandlers.clear()
  }

  function isGlobalEventHandler(value: unknown): value is GlobalEventHandler {
    return typeof value === 'function'
  }

  function onEvent<E extends Event>(event: E, payload: EventPayload<E>): void {
    handlers.get(event)?.forEach(handler => handler(payload))

    globalHandlers.forEach(handler => handler({
      kind: event,
      payload,
    }))
  }

  return {
    on,
    off,
    once,
    emit,
    clear,
  }
}