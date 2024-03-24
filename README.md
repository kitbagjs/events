# @kitbag/events

A simple lightweight event bus written in Typescript.

[![Npm Version](https://img.shields.io/npm/v/@kitbag/events.svg)](https://www.npmjs.org/package/kitbag/events)
![Github Status](https://github.com/kitbagjs/events/actions/workflows/release.yml/badge.svg)
[![Zip Size](https://img.badgesize.io/https:/unpkg.com/@kitbag/events/dist/kitbag-events?compression=gzip)](https:/unpkg.com/@kitbag/events/dist/kitbag-events)
<!-- [![Netlify Status](https://api.netlify.com/api/v1/badges/d6033c76-88c3-4963-b24f-7a0bda20f271/deploy-status)](https://app.netlify.com/sites/kitbag-mapper/deploys) -->

Get started with the [documentation](https://kitbag-events.netlify.app/)

## Get Started

### Install

```bash
# bun
bun add @kitbag/events
# yarn
yarn add @kitbag/events
# npm
npm install @kitbag/events
```

### Create an Emitter

```ts
import { createEmitter } from '@kitbag/events'

type Events = {
  hello: 'world'
}

export const emitter = createEmitter<Events>()
```

### Add Listeners

```ts
emitter.on('hello', value => {
  console.log(value)
})
```

### Emit Events

```ts
emitter.emit('hello', 'world')
// console logs "world"
```

## Events

The `Events` type defines what events can be emitted and their payload.

```ts
type Events = {
  ping: 'pong',
  userCreated: User,
  eventWithNoPayload: void,
}
```

## Usage

### Broadcast Channel

By default Kitbag Events only emits events within the document. Alternatively, you can configure Events to use a [Broadcast Channel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) which enables you to broadcast events across different windows, tabs, frames or iframes of the same origin.

```ts
import { createEmitter } from '@kitbag/events'

const emitter = createEmitter({
  broadcastChannel: 'MyChannelName'
})
```

### Single Event Handler

Define a handler for a single event called "hello"

```ts
emitter.on('hello', value => {
  console.log(value) // "world"
})
```

### Global Event Handler

Every event emitted will trigger this callback

```ts
emitter.on(event => {
  console.log(event) // { kind: 'hello', payload: 'world' }
})
```

### Single Use Handler

Listen for a single event and then automatically remove the handler

```ts
emitter.once(...)
```

### Removing listeners

Emitter.on returns the off method for removing an event handler

```ts
const off = emitter.on(...)
```

Manually remove an event handler

```ts
const handler = (value) => console.log(value)
const globalHandler = (event) => console.log(event)

emitter.on('hello', handler)
emitter.on(globalHandler)

emitter.off('hello', handler)
emitter.off(globalHandler)
```

Remove all event handlers

```ts
emitter.clear()
```
