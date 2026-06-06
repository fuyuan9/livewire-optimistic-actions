import { describe, it, expect } from "vitest";
import { parseOptimisticAttributes } from "../resources/js/directives";

describe("directives.ts helpers", () => {
  it("parses increment and decrement", () => {
    const el = document.createElement("button");
    el.setAttribute("optimistic:increment", "likes");
    el.setAttribute("optimistic:decrement", "unlikes");

    const patches = parseOptimisticAttributes(el);

    expect(patches).toHaveLength(2);
    expect(patches).toContainEqual({ type: "increment", path: "likes", by: 1 });
    expect(patches).toContainEqual({
      type: "decrement",
      path: "unlikes",
      by: 1,
    });
  });

  it("parses set with different type casting", () => {
    const el = document.createElement("button");
    el.setAttribute("optimistic:set", "status, true");

    let patches = parseOptimisticAttributes(el);
    expect(patches[0]).toEqual({ type: "set", path: "status", value: true });

    el.setAttribute("optimistic:set", "count, 42");
    patches = parseOptimisticAttributes(el);
    expect(patches[0]).toEqual({ type: "set", path: "count", value: 42 });

    el.setAttribute("optimistic:set", "name, Alice");
    patches = parseOptimisticAttributes(el);
    expect(patches[0]).toEqual({ type: "set", path: "name", value: "Alice" });
  });

  it("parses remove with different type casting", () => {
    const el = document.createElement("button");
    el.setAttribute("optimistic:remove", "todos, id, 123");

    const patches = parseOptimisticAttributes(el);
    expect(patches).toHaveLength(1);
    expect(patches[0]).toEqual({
      type: "remove",
      path: "todos",
      key: "id",
      value: 123,
    });
  });
});
