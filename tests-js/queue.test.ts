import { describe, it, expect } from "vitest";
import { MutationQueue, OptimisticMutation } from "../resources/js/queue";

describe("MutationQueue", () => {
  it("enqueues and retrieves pending mutations", () => {
    const queue = new MutationQueue();
    const mutation: OptimisticMutation = {
      id: "1",
      componentId: "comp-1",
      actionName: "like",
      status: "pending",
      createdAt: Date.now(),
      patches: [{ type: "increment", path: "likes", by: 1 }],
    };

    queue.enqueue(mutation);
    const pendings = queue.getPendingForComponent("comp-1");

    expect(pendings).toHaveLength(1);
    expect(pendings[0].id).toBe("1");
  });

  it("resolves pending mutations on success", () => {
    const queue = new MutationQueue();
    queue.enqueue({
      id: "1",
      componentId: "comp-1",
      actionName: "like",
      status: "pending",
      createdAt: Date.now(),
      patches: [{ type: "increment", path: "likes", by: 1 }],
    });

    queue.resolve("comp-1", "like", true);

    expect(queue.getPendingForComponent("comp-1")).toHaveLength(0);
    expect(queue.getMutations()).toHaveLength(0);
  });

  it("resolves oldest mutation first (FIFO)", () => {
    const queue = new MutationQueue();
    queue.enqueue({
      id: "1",
      componentId: "comp-1",
      actionName: "like",
      status: "pending",
      createdAt: Date.now(),
      patches: [{ type: "increment", path: "likes", by: 1 }],
    });
    queue.enqueue({
      id: "2",
      componentId: "comp-1",
      actionName: "like",
      status: "pending",
      createdAt: Date.now() + 10,
      patches: [{ type: "increment", path: "likes", by: 1 }],
    });

    // Resolve one 'like' action
    queue.resolve("comp-1", "like", true);

    const pendings = queue.getPendingForComponent("comp-1");
    expect(pendings).toHaveLength(1);
    expect(pendings[0].id).toBe("2"); // ID '2' remains pending, '1' resolved
  });

  it("rebases state from canonical source", () => {
    const queue = new MutationQueue();
    const canonicalState = { likes: 10, status: "idle" };

    queue.enqueue({
      id: "1",
      componentId: "comp-1",
      actionName: "like",
      status: "pending",
      createdAt: Date.now(),
      patches: [
        { type: "increment", path: "likes", by: 1 },
        { type: "set", path: "status", value: "liking" },
      ],
    });

    const rebased = queue.rebase("comp-1", canonicalState);

    expect(rebased.likes).toBe(11);
    expect(rebased.status).toBe("liking");
    expect(canonicalState.likes).toBe(10); // canonical untouched
  });
});
