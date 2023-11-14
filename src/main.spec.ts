import { expect, test, vi } from 'vitest'
import { createEmitter } from './main'

test('calls the callback when an event is emitted', () => {
  const callback = vi.fn()
  const emitter = createEmitter<{ hello: void }>()

  emitter.on('hello', callback)

  emitter.emit('hello')

  expect(callback).toBeCalled()
  expect(callback).toBeCalledWith(undefined)
})