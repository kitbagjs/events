# @kitbag/events
A simple lightweight event bus written in Typescript. 

## Get Started
```
npm i --save @kitbag/events
```

Create an emitter
```typescript
import { createEmitter } from '@kitbag/events'

type Events = {
  hello: 'world'
}

const emitter = createEmitter<Events>()

emitter.on('hello', value => {
  console.log(value) // "world"
})

emitter.emit('hello', 'world')
```

## Events
The `Events` type defines what events can be emitted and their payload.

```typescript
type Events = {
  ping: 'pong',
  userCreated: User,
  eventWithNoPayload: void,
}
```

## Usage
```typescript

import { createEmitter } from '@kitbag/events'

type Events = {
  hello: 'world'
}

const emitter = createEmitter<Events>()

// define a global event handler. Every event emitted will trigger this callback
emitter.on(event => {
  console.log(event) // { kind: 'hello', payload: 'world' }
})

// define a handler for a single event called "hello"
emitter.on('hello', value => {
  console.log(value) // "world"
})

// listen for a single event and then automatically remove the handler
emitter.once(...)

// emitter.on returns the off method for removing an event handler
const off = emitter.on(...)

// manually remove an event handler
const handler = (value) => console.log(value)
const globalHandler = (event) => console.log(event)

emitter.on('hello', handler)
emitter.on(globalHandler)

emitter.off('hello', handler)
emitter.off(globalHandler)

// remove all event handlers
emitter.clear()