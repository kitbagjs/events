# Additional Details

## Events Type

The `Events` type defines what events can be emitted and their payload.

```ts
type Events = {
  ping: 'pong',
  userCreated: User,
  eventWithNoPayload: void,
}
```

## Broadcast Channel

By default Kitbag Events only emits events within the document. Alternatively, you can configure Events to use a [Broadcast Channel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) which enables you to broadcast events across different windows, tabs, frames or iframes of the same origin.

```ts
import { createEmitter } from '@kitbag/events'

const emitter = createEmitter({
  broadcastChannel: 'MyChannelName'
})
```

You can also set/change the broadcast channel after creating an emitter by using `emitter.setOptions({ broadcastChannel: 'MyChannelName '})`

## Single Event Handler

Define a handler for a single event called "hello"

```ts
emitter.on('hello', value => {
  console.log(value) // "world"
})
```

## Global Event Handler

Every event emitted will trigger this callback

```ts
emitter.on(event => {
  console.log(event) // { kind: 'hello', payload: 'world' }
})
```

## Single Use Handler

Listen for a single event and then automatically remove the handler

```ts
emitter.once(...)
```

## Removing listeners

### Return Value

Emitter.on returns the off method for removing an event handler

```ts
const off = emitter.on(...)
```

### Manually remove an event handler

```ts
const handler = (value) => console.log(value)
const globalHandler = (event) => console.log(event)

emitter.on('hello', handler)
emitter.on(globalHandler)

emitter.off('hello', handler)
emitter.off(globalHandler)
```

### Remove all handlers for a given event

```ts
const handler1 = (value) => console.log(value)
const handler2 = (value) => console.log(value)

emitter.on('hello', handler1)
emitter.on('hello', handler2)

emitter.off('hello')
```

### Remove all handlers for all events

```ts
emitter.clear()
```
