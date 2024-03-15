import { expect, test, vi } from 'vitest'
import { createEmitter } from './main'

async function timeout(delay: number = 0): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), delay)
  })
}

test('calls the handler when an event is emitted', () => {
  const handler = vi.fn()
  const emitter = createEmitter<{ hello: void }>()

  emitter.on('hello', handler)

  emitter.emit('hello')

  expect(handler).toBeCalled()
  expect(handler).toBeCalledWith(undefined)
})

test('calls global handler when any event is emitted', () => {
  const handler = vi.fn()
  const emitter = createEmitter<{ 
    hello: void,
    goodbye: void,
  }>()

  emitter.on(handler)

  emitter.emit('hello')
  emitter.emit('goodbye')

  expect(handler).toBeCalledTimes(2)
})

test('calls the handler one time when once is used', () => {
  const handler = vi.fn()
  const emitter = createEmitter<{ hello: void }>()

  emitter.once('hello', handler)

  emitter.emit('hello')
  emitter.emit('hello')

  expect(handler).toHaveBeenCalledOnce()
})

test('stops calling the handler when off is called', () => {
  const handler = vi.fn()
  const emitter = createEmitter<{ hello: void }>()

  emitter.on('hello', handler)

  emitter.emit('hello')
  emitter.emit('hello')
  emitter.off('hello', handler)
  emitter.emit('hello')

  expect(handler).toHaveBeenCalledTimes(2)
})

test('stops calling global handler when off is called', () => {
  const handler = vi.fn()
  const emitter = createEmitter<{ hello: void }>()

  emitter.on(handler)

  emitter.emit('hello')
  emitter.emit('hello')
  emitter.off(handler)
  emitter.emit('hello')

  expect(handler).toHaveBeenCalledTimes(2)
})

test('stops calling the handler when returned off is called', () => {
  const handler = vi.fn()
  const emitter = createEmitter<{ hello: void }>()

  const off = emitter.on('hello', handler)

  emitter.emit('hello')
  emitter.emit('hello')
  off()
  emitter.emit('hello')

  expect(handler).toHaveBeenCalledTimes(2)
})

test('stops calling global handler when returned off is called', () => {
  const handler = vi.fn()
  const emitter = createEmitter<{ hello: void }>()

  const off = emitter.on(handler)

  emitter.emit('hello')
  emitter.emit('hello')
  off()
  emitter.emit('hello')

  expect(handler).toHaveBeenCalledTimes(2)
})

test('stops calling all handlers when clear is called', () => {
  const handler = vi.fn()
  const emitter = createEmitter<{ hello: void }>()

  emitter.on('hello', handler)
  emitter.on(handler)

  emitter.emit('hello')
  emitter.clear()
  emitter.emit('hello')

  expect(handler).toHaveBeenCalledTimes(2)
})

test('event handler is called on multiple emitters when using useBroadcastChannel', async () => {
  const handler = vi.fn()
  const emitterA = createEmitter<{ hello: void }>({ broadcastChannel: 'my-channel' })
  const emitterB = createEmitter<{ hello: void }>({ broadcastChannel: 'my-channel' })

  emitterA.on('hello', handler)
  emitterB.on('hello', handler)

  emitterA.emit('hello')

  await timeout()

  expect(handler).toHaveBeenCalledTimes(2)
})