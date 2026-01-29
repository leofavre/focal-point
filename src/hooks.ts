import type { Dispatch, SetStateAction } from "react";
import { useEffect, useEffectEvent, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";

/**
 * A React hook that manages UI state persisted in IndexedDB.
 *
 * This hook provides state management with automatic persistence to IndexedDB.
 * On mount, it attempts to load the persisted value from IndexedDB. If no value
 * exists or loading fails, it falls back to the provided default value.
 * Whenever the state changes, it automatically saves the new value to IndexedDB.
 *
 * @template T - The type of the state value.
 *
 * @param options - Configuration options for the hook.
 * @param options.id - A unique identifier used as the key in IndexedDB. This should
 *   be unique across all persisted UI states in the application.
 * @param options.defaultValue - The default value to use if no persisted value exists
 *   or if loading from IndexedDB fails.
 *
 * @returns A tuple containing:
 *   - `value`: The current state value (may be `undefined` during initial load).
 *   - `setter`: A state setter function compatible with React's `useState` setter.
 *
 * @example
 * ```tsx
 * const [showCodeSnippet, setShowCodeSnippet] = usePersistedUIState({
 *   id: "showCodeSnippet",
 *   defaultValue: false,
 * });
 *
 * // Use the state
 * <ToggleButton
 *   toggled={showCodeSnippet ?? false}
 *   onToggle={() => setShowCodeSnippet((prev) => !prev)}
 * />
 * ```
 *
 * @remarks
 * - The hook uses the "ui" store in IndexedDB.
 * - The value may be `undefined` during the initial load from IndexedDB.
 * - State updates are automatically persisted to IndexedDB.
 * - If IndexedDB operations fail, the hook gracefully falls back to the default value.
 */
export function usePersistedUIState<T>({
  id,
  defaultValue,
}: {
  id: string;
  defaultValue: T;
}): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
  const { getByID, update } = useIndexedDB("ui");
  const [value, setter] = useState<T>();

  const stableGetById = useEffectEvent(getByID);
  const stableUpdate = useEffectEvent(update);

  useEffect(() => {
    stableGetById(id)
      .then((data) => {
        setter(data?.value ?? defaultValue);
      })
      .catch(() => {
        setter(defaultValue);
      });
  }, [id, defaultValue]);

  useEffect(() => {
    if (value == null) return;

    stableUpdate({ id: id, value: value });
  }, [id, value]);

  return [value, setter];
}
