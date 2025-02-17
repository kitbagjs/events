import { describe, expectTypeOf, test, vi } from "vitest";
import { createEmitter } from "../src/createEmitter";
import { EmitterNextOptions, EventHandler, EventPayload, GlobalEventHandlerResponse } from "../src/types";

type Events = {
  ping: void,
  hello: string,
  user: { name: string }
}

describe('emitter.on', () => {
  test('has the correct return type', () => {
    const emitter = createEmitter<Events>()
    const response = emitter.on('ping', vi.fn())

    type Source = typeof response
    type Expected = () => void

    expectTypeOf<Source>().toEqualTypeOf<Expected>()

    const globalResponse = emitter.on(vi.fn())

    type GlobalSource = typeof globalResponse
    type GlobalExpected = () => void

    expectTypeOf<GlobalSource>().toEqualTypeOf<GlobalExpected>()
  })

  test('has the correct payload', () => {
    const emitter = createEmitter<Events>()

    emitter.on('ping', payload => {
      expectTypeOf<typeof payload>().toEqualTypeOf<void>()
    })

    emitter.on('hello', payload => {
      expectTypeOf<typeof payload>().toEqualTypeOf<string>()
    })

    emitter.on('user', payload => {
      expectTypeOf<typeof payload>().toEqualTypeOf<{ name: string }>()
    })

    emitter.on(payload => {
      type Expected = GlobalEventHandlerResponse<Events>
      expectTypeOf<typeof payload>().toEqualTypeOf<Expected>()
    })
  })
})

describe('emitter.once', () => {
  test('has the correct return type', () => {
    const emitter = createEmitter<Events>()
    const response = emitter.once('hello', vi.fn())

    type Source = typeof response
    type Expected = () => void

    expectTypeOf<Source>().toEqualTypeOf<Expected>()

    const globalResponse = emitter.once(vi.fn())

    type GlobalSource = typeof globalResponse
    type GlobalExpected = () => void

    expectTypeOf<GlobalSource>().toEqualTypeOf<GlobalExpected>()
  })

  test('has the correct payload', () => {
    const emitter = createEmitter<Events>()

    emitter.once('ping', payload => {
      expectTypeOf<typeof payload>().toEqualTypeOf<void>()
    })

    emitter.once('hello', payload => {
      expectTypeOf<typeof payload>().toEqualTypeOf<string>()
    })

    emitter.once('user', payload => {
      expectTypeOf<typeof payload>().toEqualTypeOf<{ name: string }>()
    })

    emitter.once(payload => {
      type Expected = GlobalEventHandlerResponse<Events>
      expectTypeOf<typeof payload>().toEqualTypeOf<Expected>()
    })
  })
})

describe('emitter.next', () => {

  // note: The `Parameters` type only tests the last overload. So we cannot test the global handler parameters.
  test('has the correct arguments', () => {
    const emitter = createEmitter<Events>()

    type Source = Parameters<typeof emitter.next>
    type Expected = [event: keyof Events, options?: EmitterNextOptions]

    expectTypeOf<Source>().toEqualTypeOf<Expected>()
  })

  test('has the correct return type', () => {
    const emitter = createEmitter<Events>()

    const ping = emitter.next('ping')
    expectTypeOf<typeof ping>().toEqualTypeOf<Promise<void>>()

    const hello = emitter.next('hello')
    expectTypeOf<typeof hello>().toEqualTypeOf<Promise<string>>()

    const user = emitter.next('user')
    expectTypeOf<typeof user>().toEqualTypeOf<Promise<{ name: string }>>()

    const global = emitter.next()
    expectTypeOf<typeof global>().toEqualTypeOf<Promise<GlobalEventHandlerResponse<Events>>>()
  })
})

describe('emitter.off', () => {

  // note: The `Parameters` type only tests the last overload. So we cannot test the global handler parameters.
  test('has the correct arguments', () => {
    const emitter = createEmitter<Events>()

    type Source = Parameters<typeof emitter.off>
    type Expected = [event: keyof Events, handler: EventHandler<EventPayload<Events, keyof Events>>]

    expectTypeOf<Source>().toEqualTypeOf<Expected>()
  })

  test('has the correct return type', () => {
    const emitter = createEmitter<Events>()
    const eventResponse = emitter.off('hello')

    type Source = typeof eventResponse
    type Expected = void

    expectTypeOf<Source>().toEqualTypeOf<Expected>()

    const eventHandlerResponse = emitter.off('hello', vi.fn())

    type EventHandlerSource = typeof eventHandlerResponse
    type EventHandlerExpected = void

    expectTypeOf<EventHandlerSource>().toEqualTypeOf<EventHandlerExpected>()

    const globalResponse = emitter.off(vi.fn())

    type GlobalSource = typeof globalResponse
    type GlobalExpected = void

    expectTypeOf<GlobalSource>().toEqualTypeOf<GlobalExpected>()
  })
})

describe('emitter.clear', () => {
  test('has the correct arguments', () => {
    const emitter = createEmitter<Events>()

    type Source = Parameters<typeof emitter.clear>
    type Expected = []

    expectTypeOf<Source>().toEqualTypeOf<Expected>()
  })

  test('has the correct return type', () => {
    const emitter = createEmitter<Events>()
    const response = emitter.clear()

    type Source = typeof response
    type Expected = void

    expectTypeOf<Source>().toEqualTypeOf<Expected>()
  })
})

describe('emitter.emit', () => {
  test('has the correct return type', () => {
    const emitter = createEmitter<Events>()
    const response = emitter.emit('ping')

    type Source = typeof response
    type Expected = void

    expectTypeOf<Source>().toEqualTypeOf<Expected>()
  })
})

describe('emitter.setOptions', () => {
  test('has the correct return type', () => {
    const emitter = createEmitter<Events>()
    const response = emitter.setOptions({})

    type Source = typeof response
    type Expected = void

    expectTypeOf<Source>().toEqualTypeOf<Expected>()
  })
})
