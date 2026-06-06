/**
 * Retrieve a value from an object using a dot-notated path (e.g., 'foo.bar.0.baz').
 */
export function getValueByPath(obj: any, path: string): any {
  if (!path) return obj;
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
}

/**
 * Set a value in an object at a dot-notated path (e.g., 'foo.bar.0.baz').
 * Mutates the original object.
 */
export function setValueByPath(obj: any, path: string, value: any): any {
  if (!path) return obj;
  const parts = path.split(".");
  const lastPart = parts.pop()!;
  let current = obj;

  for (const part of parts) {
    if (current[part] === undefined || current[part] === null) {
      // If the next key looks like a number index, initialize as array, otherwise object
      const nextIsIndex = !isNaN(Number(part));
      current[part] = nextIsIndex ? [] : {};
    }
    current = current[part];
  }

  current[lastPart] = value;
  return obj;
}
