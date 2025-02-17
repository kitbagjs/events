# Types: GlobalEventHandlerResponse\<T\>

```ts
type GlobalEventHandlerResponse<T> = { [K in keyof T]: { kind: K; payload: T[K] } }[keyof T];
```

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`EmitterEvents`](EmitterEvents.md) |
