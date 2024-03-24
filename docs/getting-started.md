# Getting Started

## Installation

Install Kitbag Events with your favorite package manager

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
