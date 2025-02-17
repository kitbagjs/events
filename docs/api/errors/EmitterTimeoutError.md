# Errors: EmitterTimeoutError

An error thrown when a timeout occurs while waiting for an event to be emitted.

## Extends

- `Error`

## Constructors

### new EmitterTimeoutError()

```ts
new EmitterTimeoutError(event, timeout): EmitterTimeoutError
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |
| `timeout` | `number` |

#### Returns

[`EmitterTimeoutError`](EmitterTimeoutError.md)

#### Overrides

```ts
Error.constructor
```

## Methods

### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void
```

Create .stack property on a target object

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `targetObject` | `object` |
| `constructorOpt`? | `Function` |

#### Returns

`void`

#### Inherited from

```ts
Error.captureStackTrace
```

## Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="message"></a> `message` | `public` | `string` | - | `Error.message` |
| <a id="name"></a> `name` | `public` | `string` | - | `Error.name` |
| <a id="stack"></a> `stack?` | `public` | `string` | - | `Error.stack` |
| <a id="preparestacktrace"></a> `prepareStackTrace?` | `static` | (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any` | Optional override for formatting stack traces **See** https://v8.dev/docs/stack-trace-api#customizing-stack-traces | `Error.prepareStackTrace` |
| <a id="stacktracelimit"></a> `stackTraceLimit` | `static` | `number` | - | `Error.stackTraceLimit` |
