import { describe, it, expect } from "vitest";
import { applyPatch } from "../resources/js/patches";

describe("patches.ts helpers", () => {
  it("applies increment patch", () => {
    const state = { likes: 10 };
    const nextState = applyPatch(state, {
      type: "increment",
      path: "likes",
      by: 1,
    });
    expect(nextState.likes).toBe(11);
    expect(state.likes).toBe(10); // Check immutability
  });

  it("applies decrement patch", () => {
    const state = { likes: 10 };
    const nextState = applyPatch(state, {
      type: "decrement",
      path: "likes",
      by: 1,
    });
    expect(nextState.likes).toBe(9);
  });

  it("applies set patch", () => {
    const state = { status: "idle" };
    const nextState = applyPatch(state, {
      type: "set",
      path: "status",
      value: "publishing",
    });
    expect(nextState.status).toBe("publishing");
  });

  describe("remove patch", () => {
    it("removes item from primitive array", () => {
      const state = { tags: ["php", "livewire", "alpine"] };
      const nextState = applyPatch(state, {
        type: "remove",
        path: "tags",
        key: "",
        value: "livewire",
      });
      expect(nextState.tags).toEqual(["php", "alpine"]);
    });

    it("removes item from object array by key/value", () => {
      const state = {
        todos: [
          { id: 1, title: "Buy milk" },
          { id: 2, title: "Clean room" },
        ],
      };
      const nextState = applyPatch(state, {
        type: "remove",
        path: "todos",
        key: "id",
        value: 2,
      });
      expect(nextState.todos).toEqual([{ id: 1, title: "Buy milk" }]);
    });
  });
});
