# Getting Started

## Installation

Install Kitbag Events with your favorite package manager:

```bash
# bun
bun add @kitbag/events
# yarn
yarn add @kitbag/events
# npm
npm install @kitbag/events
```

## Basic Usage

Create an emitter with typed events:

```ts
import { createEmitter } from '@kitbag/events'

type Events = {
  userLogin: { userId: string; timestamp: number }
  userLogout: { userId: string }
  messageReceived: { from: string; content: string }
}

const emitter = createEmitter<Events>()
```

## Event Handling

### Listen to specific events:

```ts
// Listen to user login events
emitter.on('userLogin', ({ userId, timestamp }) => {
  console.log(`User ${userId} logged in at ${timestamp}`)
})

// Listen to message events
emitter.on('messageReceived', ({ from, content }) => {
  console.log(`Message from ${from}: ${content}`)
})
```

### Global event handler (runs on all events):

```ts
emitter.on(({ kind, payload }) => {
  console.log(`Event ${kind} occurred:`, payload)
})
```

### One-time event listeners:

```ts
emitter.once('userLogin', ({ userId }) => {
  console.log(`First login for user ${userId}`)
})
```

## Emitting Events

```ts
// Emit user login
emitter.emit('userLogin', { userId: '123', timestamp: Date.now() })

// Emit message
emitter.emit('messageReceived', { from: 'alice', content: 'Hello world!' })
```

## Waiting for Events

```ts
// Wait for next user login
const loginData = await emitter.next('userLogin')
console.log('Next login:', loginData)

// Wait for any event with timeout
const nextEvent = await emitter.next({ timeout: 5000 })
console.log('Next event:', nextEvent)
```

## Cleanup

```ts
// Remove specific handler
const handler = (data: any) => console.log(data)
emitter.on('userLogin', handler)
emitter.off('userLogin', handler)

// Remove all handlers for an event
emitter.off('userLogin')

// Clear all handlers
emitter.clear()
```

## Abort Signal Support

```ts
const controller = new AbortController()

emitter.on('userLogin', ({ userId }) => {
  console.log(`User ${userId} logged in`)
}, { signal: controller.signal })

// Later, abort the listener
controller.abort()
```
