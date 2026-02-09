# Null / undefined checks

Prefer `!= null` instead of `!== undefined` when checking for “absence” of a value.

`!= null` checks both `null` and `undefined` in a single expression, which matches the intent in most cases.

```ts
// ✓ Prefer – concise, handles both null and undefined
if (value != null) { ... }
if (value == null) { ... }

// ✗ Avoid – unless null and undefined must be treated differently
if (value !== undefined) { ... }
if (value === undefined) { ... }
```

Use `!== undefined` or `=== undefined` only when `null` and `undefined` have strictly different meanings in that context (which is rare).
