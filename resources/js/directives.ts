import { OptimisticPatch } from "./patches";

/**
 * Parse optimistic:* attributes from an HTML element.
 */
export function parseOptimisticAttributes(el: HTMLElement): OptimisticPatch[] {
  const patches: OptimisticPatch[] = [];

  for (const attr of Array.from(el.attributes)) {
    const name = attr.name;
    const val = attr.value;

    if (name === "optimistic:increment") {
      patches.push({ type: "increment", path: val, by: 1 });
    } else if (name === "optimistic:decrement") {
      patches.push({ type: "decrement", path: val, by: 1 });
    } else if (name === "optimistic:set") {
      const idx = val.indexOf(",");
      if (idx !== -1) {
        const path = val.slice(0, idx).trim();
        const rawVal = val.slice(idx + 1).trim();

        let castedVal: any = rawVal;
        if (rawVal === "true") castedVal = true;
        else if (rawVal === "false") castedVal = false;
        else if (!isNaN(Number(rawVal)) && rawVal !== "")
          castedVal = Number(rawVal);

        patches.push({ type: "set", path, value: castedVal });
      }
    } else if (name === "optimistic:remove") {
      const parts = val.split(",").map((p) => p.trim());
      if (parts.length >= 3) {
        const path = parts[0];
        const key = parts[1];
        const value = parts.slice(2).join(",");

        let castedVal: any = value;
        if (value === "true") castedVal = true;
        else if (value === "false") castedVal = false;
        else if (!isNaN(Number(value)) && value !== "")
          castedVal = Number(value);

        patches.push({ type: "remove", path, key, value: castedVal });
      }
    }
  }

  return patches;
}
