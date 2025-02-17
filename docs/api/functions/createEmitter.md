# Functions: createEmitter()

```ts
function createEmitter<TEvents>(options?): object
```

## Type Parameters

| Type Parameter |
| ------ |
| `TEvents` *extends* [`EmitterEvents`](../types/EmitterEvents.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options`? | [`EmitterOptions`](../types/EmitterOptions.md) |

## Returns

`object`

### clear()

```ts
clear: () => void;
```

#### Returns

`void`

### emit()

```ts
emit: <E>(event) => void<E>(event, payload) => void;
```

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `undefined` *extends* `EventPayload`\<`TEvents`, `E`\> ? `E` : `never` |

#### Returns

`void`

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `E` |
| `payload` | `EventPayload`\<`TEvents`, `E`\> |

#### Returns

`void`

### next()

```ts
next: (options?) => Promise<GlobalEventHandlerResponse<TEvents>><E>(event, options?) => Promise<EventPayload<TEvents, E>>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options`? | [`EmitterNextOptions`](../types/EmitterNextOptions.md) |

#### Returns

`Promise`\<[`GlobalEventHandlerResponse`](../types/GlobalEventHandlerResponse.md)\<`TEvents`\>\>

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `E` |
| `options`? | [`EmitterNextOptions`](../types/EmitterNextOptions.md) |

#### Returns

`Promise`\<`EventPayload`\<`TEvents`, `E`\>\>

### off()

```ts
off: (globalEventHandler) => void<E>(event) => void<E>(event, handler) => void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `globalEventHandler` | [`GlobalEventHandler`](../types/GlobalEventHandler.md)\<`TEvents`\> |

#### Returns

`void`

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `E` |

#### Returns

`void`

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `E` |
| `handler` | [`EventHandler`](../types/EventHandler.md)\<`EventPayload`\<`TEvents`, `E`\>\> |

#### Returns

`void`

### on()

```ts
on: (globalEventHandler, options?) => () => void<E>(event, handler, options?) => () => void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `globalEventHandler` | [`GlobalEventHandler`](../types/GlobalEventHandler.md)\<`TEvents`\> |
| `options`? | [`EmitterOnOptions`](../types/EmitterOnOptions.md) |

#### Returns

`Function`

##### Returns

`void`

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `E` |
| `handler` | [`EventHandler`](../types/EventHandler.md)\<`EventPayload`\<`TEvents`, `E`\>\> |
| `options`? | [`EmitterOnOptions`](../types/EmitterOnOptions.md) |

#### Returns

`Function`

##### Returns

`void`

### once()

```ts
once: (globalEventHandler, options?) => () => void<E>(event, handler, options?) => () => void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `globalEventHandler` | [`GlobalEventHandler`](../types/GlobalEventHandler.md)\<`TEvents`\> |
| `options`? | [`EmitterOnceOptions`](../types/EmitterOnceOptions.md) |

#### Returns

`Function`

##### Returns

`void`

#### Type Parameters

| Type Parameter |
| ------ |
| `E` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `E` |
| `handler` | [`EventHandler`](../types/EventHandler.md)\<`EventPayload`\<`TEvents`, `E`\>\> |
| `options`? | [`EmitterOnceOptions`](../types/EmitterOnceOptions.md) |

#### Returns

`Function`

##### Returns

`void`

### setOptions()

```ts
setOptions: (options) => void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`EmitterOptions`](../types/EmitterOptions.md) |

#### Returns

`void`
