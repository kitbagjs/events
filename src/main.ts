import EventsWorker from './worker?sharedworker'
import { WorkerMessage } from './worker'

export type EmitterOptions = {
  useSharedWorker?: boolean
}

type Handler<T = any> = (...payload: T[]) => void

type Events = Record<string, unknown>

type GlobalEvent<T extends Events> = {
  [K in keyof T]: {
    kind: K,
    payload: T[K],
  }
}[keyof T]

interface IEventsWorker extends Omit<SharedWorker, 'postMessage' | 'onmessage'> {
  postMessage: (message: WorkerMessage) => void,
  onmessage: (event: MessageEvent<WorkerMessage>) => void,
}

function getWorker(useSharedWorker: boolean = false): IEventsWorker | null {
  if(useSharedWorker) {
    return new EventsWorker() as IEventsWorker
  }

  return null
}

export function createEmitter<T extends Events>({useSharedWorker }: EmitterOptions = {}) {
  type Event = keyof T
  type Handlers = Set<Handler>
  type GlobalEventHandler = (event: GlobalEvent<T>) => void

  const handlers = new Map<Event, Handlers>()
  const globalHandlers = new Set<GlobalEventHandler>()
  const worker = getWorker(useSharedWorker)

  if(worker) {
    worker.port.onmessage = ({ data }) => {
      const { event, payload } = data

      onEvent(event, payload)
    }
  }

  function on(globalEventHandler: GlobalEventHandler): () => void
  function on<E extends Event>(event: E, handler: Handler<T[E]>): () => void
  function on<E extends Event>(globalHandlerOrEvent: E | GlobalEventHandler, handler?: Handler<T[E]>): () => void {
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

  function once<E extends Event>(event: E, handler: Handler<T[E]>): void {
    const callback: Handler<T[E]> = (args) => {
      off(event, callback)
      handler(args)
    }

    on(event, callback)
  }

  function off(globalEventHandler: GlobalEventHandler): void
  function off<E extends Event>(event: E, handler: Handler<T[E]>): void
  function off<E extends Event>(globalHandlerOrEvent: E, handler?: Handler<T[E]>): void {
    if (isGlobalEventHandler(globalHandlerOrEvent)) {
      globalHandlers.delete(globalHandlerOrEvent)
      return
    }

    if (!handler) {
      throw new Error(`Handler must be given for ${String(event)} event`)
    }

    handlers.get(globalHandlerOrEvent)?.delete(handler)
  }

  function emit<E extends Event>(event: undefined extends T[E] ? E : never): void
  function emit<E extends Event>(event: E, payload: T[E]): void
  function emit<E extends Event>(event: E, payload?: T[E]): void {
    if(worker) {
      worker.port.postMessage({ event, payload })
      return
    }

    onEvent(event, payload)
  }

  function clear(): void {
    handlers.clear()
    globalHandlers.clear()
  }

  function isGlobalEventHandler(value: unknown): value is GlobalEventHandler {
    return typeof value === 'function'
  }

  function onEvent<E extends Event>(event: E, payload?: T[E]): void {
    handlers.get(event)?.forEach(handler => handler(payload))

    globalHandlers.forEach(handler => handler({
      kind: event,
      payload: payload!,
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