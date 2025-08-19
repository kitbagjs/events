# Broadcasting Events

Kitbag Events supports broadcasting events across multiple browser tabs/windows using the [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) API.

## Setup

Pass a channel name when creating your emitter:

```ts
import { createEmitter } from '@kitbag/events'

type Events = {
  userLogin: { userId: string }
  messageReceived: { content: string }
}

const emitter = createEmitter<Events>({
  broadcastChannel: 'my-app-events'
})
```

## How It Works

When you specify a `broadcastChannel`:

1. **Local emission**: Events are processed by handlers in the current tab
2. **Cross-tab broadcast**: Events are automatically sent to all other tabs using the same channel name
3. **Automatic reception**: Other tabs automatically receive and process broadcasted events

## Example: Multi-tab Chat

```ts
// Tab 1: Send message
emitter.emit('messageReceived', { content: 'Hello from Tab 1!' })

// Tab 2: Automatically receives the message
emitter.on('messageReceived', ({ content }) => {
  console.log('Message received:', content) // "Hello from Tab 1!"
})
```

## Channel Naming

Use descriptive, unique channel names to avoid conflicts:

```ts
// Good - specific to your app
broadcastChannel: 'my-chat-app-v1'

// Good - includes user context
broadcastChannel: `user-${userId}-events`

// Avoid - too generic
broadcastChannel: 'events'
```

## Use Cases

- **Real-time updates**: Sync user actions across tabs
- **Session management**: Notify all tabs when user logs out
- **Data synchronization**: Keep multiple tabs in sync
- **Notifications**: Broadcast system-wide alerts

## Structured Clone
Data sent is serialized using the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).
