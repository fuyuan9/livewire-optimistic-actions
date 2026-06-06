import { getValueByPath, setValueByPath } from "./paths";

export type OptimisticPatch =
  | { type: "increment"; path: string; by: number }
  | { type: "decrement"; path: string; by: number }
  | { type: "set"; path: string; value: any }
  | { type: "remove"; path: string; key: string; value: any };

/**
 * Apply an optimistic patch to the given state object.
 * Returns a new state object (immutable update).
 */
export function applyPatch(state: any, patch: OptimisticPatch): any {
  // Deep clone state to ensure we don't mutate input state references
  const newState = JSON.parse(JSON.stringify(state));
  const currentValue = getValueByPath(newState, patch.path);

  switch (patch.type) {
    case "increment": {
      const num =
        typeof currentValue === "number"
          ? currentValue
          : Number(currentValue) || 0;
      setValueByPath(newState, patch.path, num + patch.by);
      break;
    }
    case "decrement": {
      const num =
        typeof currentValue === "number"
          ? currentValue
          : Number(currentValue) || 0;
      setValueByPath(newState, patch.path, num - patch.by);
      break;
    }
    case "set": {
      setValueByPath(newState, patch.path, patch.value);
      break;
    }
    case "remove": {
      if (Array.isArray(currentValue)) {
        const filtered = currentValue.filter((item) => {
          if (item && typeof item === "object") {
            // If it is an object, look for the target key
            return String(item[patch.key]) !== String(patch.value);
          }
          // If it is a primitive, directly compare the string value
          return String(item) !== String(patch.value);
        });
        setValueByPath(newState, patch.path, filtered);
      }
      break;
    }
  }

  return newState;
}
