# Methods

## On

Register event handlers for specific events or globally.

### Event-specific handler

**Parameters:**
- `event`: Event name to listen to
- `handler`: Function called when event occurs
- `options.signal`: AbortSignal to automatically remove handler

**Returns:** Unsubscribe function

**Example:**
```ts
const unsubscribe = emitter.on('userLogin', ({ userId }) => {
  console.log(`User ${userId} logged in`)
})

// Later remove the handler
unsubscribe()
```

### Global handler

**Parameters:**
- `globalEventHandler`: Function called for all events
- `options.signal`: AbortSignal to automatically remove handler

**Returns:** Unsubscribe function

**Example:**
```ts
const unsubscribe = emitter.on(({ kind, payload }) => {
  console.log(`Event ${kind}:`, payload)
})
```

## Once

Register a one-time event handler that automatically removes itself after execution.

### Event-specific handler

**Parameters:**
- `event`: Event name to listen to
- `handler`: Function called once when event occurs
- `options.signal`: AbortSignal to automatically remove handler

**Returns:** Unsubscribe function

**Example:**
```ts
emitter.once('userLogin', ({ userId }) => {
  console.log(`First login for user ${userId}`)
})
```

### Global handler

**Parameters:**
- `globalEventHandler`: Function called once for the next event
- `options.signal`: AbortSignal to automatically remove handler

**Returns:** Unsubscribe function

## Next

Wait for the next occurrence of an event or any event.

### Wait for specific event

**Parameters:**
- `event`: Event name to wait for
- `options.timeout`: Milliseconds to wait before rejecting

**Returns:** Promise that resolves with event payload

**Example:**
```ts
try {
  const loginData = await emitter.next('userLogin', { timeout: 5000 })
  console.log('Login occurred:', loginData)
} catch (error) {
  if (error instanceof EmitterTimeoutError) {
    console.log('No login within 5 seconds')
  }
}
```

### Wait for any event

**Parameters:**
- `options.timeout`: Milliseconds to wait before rejecting

**Returns:** Promise that resolves with event info

**Example:**
```ts
const nextEvent = await emitter.next({ timeout: 10000 })
console.log(`Event ${nextEvent.kind} occurred:`, nextEvent.payload)
```

## Emit

Trigger an event with optional payload.

**Parameters:**
- `event`: Event name to emit
- `payload`: Data to pass to event handlers

**Example:**
```ts
emitter.emit('userLogin', { userId: '123', timestamp: Date.now() })
emitter.emit('userLogout', { userId: '123' })
```

## Off

Remove event handlers.

### Remove specific handler

**Parameters:**
- `event`: Event name
- `handler`: Specific handler to remove

**Example:**
```ts
const handler = (data: any) => console.log(data)
emitter.on('userLogin', handler)
emitter.off('userLogin', handler)
```

### Remove all handlers for event

**Parameters:**
- `event`: Event name to clear all handlers for

**Example:**
```ts
emitter.off('userLogin') // Removes all userLogin handlers
```

### Remove global handler

**Parameters:**
- `globalEventHandler`: Global handler to remove

**Example:**
```ts
const globalHandler = ({ kind, payload }) => console.log(kind, payload)
emitter.on(globalHandler)
emitter.off(globalHandler)
```

## Count

Get the number of registered handlers.

### Count handlers for specific event

**Parameters:**
- `event`: Event name to count handlers for
- `options.global`: Include global handlers in count

**Returns:** Number of handlers

**Example:**
```ts
const eventCount = emitter.count('userLogin')
const totalCount = emitter.count('userLogin', { global: true })
```

### Count global handlers

**Returns:** Number of global handlers

**Example:**
```ts
const globalCount = emitter.count()
```

## Clear

Remove all event handlers and global handlers.

**Example:**
```ts
emitter.clear() // Removes all handlers
```

## Set Options

Update emitter configuration after creation.

**Parameters:**
- `options.broadcastChannel`: Channel name for cross-tab communication

**Example:**
```ts
emitter.setOptions({ broadcastChannel: 'new-channel' })
```
