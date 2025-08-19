# Kitbag Events Documentation

Welcome to the Kitbag Events documentation. This package provides a simple, lightweight event bus written in TypeScript with cross-tab broadcasting support.

## Documentation Structure

### Getting Started
- **Getting Started** (`/getting-started`) - Complete introduction with examples
- **Methods** (`/methods`) - Comprehensive API reference
- **Broadcasting Events** (`/broadcasting-events`) - Cross-tab communication guide

### API Reference
- **Functions** - `createEmitter` function documentation
- **Types** - All TypeScript type definitions
- **Errors** - Error classes and handling

## Quick Start

```ts
import { createEmitter } from '@kitbag/events'

type Events = {
  userLogin: { userId: string }
  messageReceived: { content: string }
}

const emitter = createEmitter<Events>()

emitter.on('userLogin', ({ userId }) => {
  console.log(`User ${userId} logged in`)
})

emitter.emit('userLogin', { userId: '123' })
```

## Key Features

- **Type Safe**: Full TypeScript support with typed events
- **Cross-Tab Support**: Built-in broadcasting across browser tabs
- **Rich API**: on, off, once, next, emit, count, clear methods
- **Abort Support**: Automatic cleanup with AbortSignal
- **Promise Based**: Async event waiting with timeout support
- **Zero Dependencies**: Lightweight and fast

## Need Help?

- [GitHub Issues](https://github.com/kitbagjs/events/issues)
- [Discord Community](https://discord.gg/zw7dpcc5HV)
- [NPM Package](https://www.npmjs.com/package/@kitbag/events)
