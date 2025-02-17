export type EmitterOptions = {
  broadcastChannel?: string
}

export type EmitterNextOptions = {
  timeout?: number
}

export type EmitterOnOptions = {
  signal?: AbortSignal
}

export type EmitterOnceOptions = {
  signal?: AbortSignal
}

export type EventHandler<T = any> = (...payload: T[]) => void

export type EventPayload<TEvents extends EmitterEvents, TEvent extends keyof TEvents> = TEvents[TEvent]

export type EmitterEvents = Record<string, unknown>

export type GlobalEventHandler<T extends EmitterEvents> = (event: GlobalEventHandlerResponse<T>) => void

export type GlobalEventHandlerResponse<T extends EmitterEvents> = {
  [K in keyof T]: {
    kind: K,
    payload: T[K],
  }
}[keyof T]