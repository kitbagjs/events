# Types: EventPayload\<TEvents, TEvent\>

```ts
type EventPayload<TEvents, TEvent> = TEvents[TEvent];
```

## Type Parameters

| Type Parameter |
| ------ |
| `TEvents` *extends* [`EmitterEvents`](EmitterEvents.md) |
| `TEvent` *extends* keyof `TEvents` |
