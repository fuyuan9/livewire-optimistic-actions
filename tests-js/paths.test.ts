import { describe, it, expect } from "vitest";
import { getValueByPath, setValueByPath } from "../resources/js/paths";

describe("paths.ts helpers", () => {
  describe("getValueByPath", () => {
    it("gets simple properties", () => {
      const obj = { likes: 10, status: "active" };
      expect(getValueByPath(obj, "likes")).toBe(10);
      expect(getValueByPath(obj, "status")).toBe("active");
    });

    it("gets nested properties", () => {
      const obj = { user: { profile: { name: "Alice" } } };
      expect(getValueByPath(obj, "user.profile.name")).toBe("Alice");
    });

    it("gets array elements by index", () => {
      const obj = {
        todos: [
          { id: 1, title: "Buy milk" },
          { id: 2, title: "Clean room" },
        ],
      };
      expect(getValueByPath(obj, "todos.0.title")).toBe("Buy milk");
      expect(getValueByPath(obj, "todos.1.id")).toBe(2);
    });

    it("returns undefined for non-existent paths", () => {
      const obj = { likes: 10 };
      expect(getValueByPath(obj, "comments.0.id")).toBeUndefined();
    });
  });

  describe("setValueByPath", () => {
    it("sets simple properties", () => {
      const obj: any = { likes: 10 };
      setValueByPath(obj, "likes", 11);
      expect(obj.likes).toBe(11);
    });

    it("sets nested properties", () => {
      const obj = { user: { profile: { name: "Alice" } } };
      setValueByPath(obj, "user.profile.name", "Bob");
      expect(obj.user.profile.name).toBe("Bob");
    });

    it("sets values in array elements", () => {
      const obj = { todos: [{ id: 1, title: "Buy milk" }] };
      setValueByPath(obj, "todos.0.title", "Buy organic milk");
      expect(obj.todos[0].title).toBe("Buy organic milk");
    });

    it("creates missing nested paths on the fly", () => {
      const obj: any = {};
      setValueByPath(obj, "user.profile.name", "Alice");
      expect(obj.user.profile.name).toBe("Alice");
    });
  });
});
