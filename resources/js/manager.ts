import { MutationQueue, OptimisticMutation } from "./queue";
import { parseOptimisticAttributes } from "./directives";
import { applyStateToComponent } from "./livewire-adapter";
import { applyPatch } from "./patches";

const failedActionsMap = new Map<string, Set<string>>();

function getFailedActions(componentId: string): Set<string> {
  if (!failedActionsMap.has(componentId)) {
    failedActionsMap.set(componentId, new Set());
  }
  return failedActionsMap.get(componentId)!;
}

export class OptimisticManager {
  private queue: MutationQueue;

  constructor(queue: MutationQueue) {
    this.queue = queue;
    this.setupClickListener();
    this.setupMorphObserver();
  }

  private setupClickListener() {
    window.addEventListener(
      "click",
      (e) => {
        const target = e.target as HTMLElement;
        const triggerEl = target.closest(
          "[wire\\:click], [optimistic\\:increment], [optimistic\\:decrement], [optimistic\\:set], [optimistic\\:remove]",
        ) as HTMLElement;

        console.log("[Optimistic] Click detected on:", target);
        console.log("[Optimistic] Closest trigger element:", triggerEl);

        if (!triggerEl) return;

        const patches = parseOptimisticAttributes(triggerEl);
        console.log("[Optimistic] Parsed patches:", patches);
        if (patches.length === 0) return;

        const componentEl = triggerEl.closest("[wire\\:id]") as HTMLElement;
        console.log("[Optimistic] Closest component element:", componentEl);
        if (!componentEl) return;

        const componentId = componentEl.getAttribute("wire:id");
        console.log("[Optimistic] Component ID:", componentId);
        if (!componentId) return;

        const Livewire = (window as any).Livewire;
        console.log("[Optimistic] Livewire global object:", Livewire);
        if (!Livewire) return;

        const componentWire = Livewire.find(componentId);
        if (!componentWire) return;
        const component = componentWire.__instance;
        console.log(
          "[Optimistic] Livewire component instance ID:",
          component ? component.id : "null",
        );
        if (!component) return;

        // Extract action name from wire:click to associate it
        const wireClickAttr = triggerEl.getAttribute("wire:click") || "";
        const actionName = wireClickAttr.split("(")[0].trim();

        // Clear previous failed state for this action upon retry
        if (actionName) {
          getFailedActions(componentId).delete(actionName);
        }

        // Read current local state (which might already contain other pending optimistic mutations)
        const keys = Object.keys(component.ephemeral || {});
        console.log("[Optimistic] Ephemeral data keys:", keys);
        const currentState: any = {};
        for (const key of keys) {
          currentState[key] = component.ephemeral[key];
        }
        console.log(
          "[Optimistic] Current state before patches:",
          JSON.stringify(currentState),
        );

        // Apply new patches locally
        let nextState = currentState;
        for (const patch of patches) {
          nextState = applyPatch(nextState, patch);
        }
        console.log(
          "[Optimistic] Next state after applying patches:",
          JSON.stringify(nextState),
        );

        applyStateToComponent(component, nextState);
        console.log("[Optimistic] State applied to component.");

        // Enqueue the new optimistic mutation
        const mutation: OptimisticMutation = {
          id: Math.random().toString(36).substring(2, 9),
          componentId,
          actionName,
          status: "pending",
          createdAt: Date.now(),
          patches,
        };

        this.queue.enqueue(mutation);

        // Sync the UI representation (pending/failed states)
        this.syncUI(component);
      },
      true,
    ); // Use capture phase to run before Livewire handles clicks
  }

  private setupMorphObserver() {
    document.addEventListener("livewire:init", () => {
      const Livewire = (window as any).Livewire;
      if (!Livewire) return;

      // Whenever Livewire morphs the DOM, re-sync our pending/failed elements
      Livewire.hook("morph.updated", ({ component }: any) => {
        if (component) {
          this.syncUI(component);
        }
      });

      Livewire.hook("component.init", ({ component }: any) => {
        this.syncUI(component);
      });
    });
  }

  /**
   * Show/hide [optimistic:pending] and [optimistic:failed] elements based on queue state.
   */
  public syncUI(component: any) {
    const componentId = component.id;
    const componentEl = component.el;
    if (!componentEl) return;

    const pendings = this.queue.getPendingForComponent(componentId);
    const isPending = pendings.length > 0;
    const failedActions = getFailedActions(componentId);

    // Sync [optimistic:pending]
    const pendingEls = componentEl.querySelectorAll("[optimistic\\:pending]");
    pendingEls.forEach((el: any) => {
      const actionName = el.getAttribute("optimistic:pending");
      if (actionName) {
        const hasActionPending = pendings.some(
          (m) => m.actionName === actionName,
        );
        el.style.display = hasActionPending ? "" : "none";
      } else {
        el.style.display = isPending ? "" : "none";
      }
    });

    // Sync [optimistic:failed]
    const failedEls = componentEl.querySelectorAll("[optimistic\\:failed]");
    failedEls.forEach((el: any) => {
      const actionName = el.getAttribute("optimistic:failed");
      if (actionName) {
        const hasActionFailed = failedActions.has(actionName);
        el.style.display = hasActionFailed ? "" : "none";
      } else {
        const hasAnyFailed = failedActions.size > 0;
        el.style.display = hasAnyFailed ? "" : "none";
      }
    });
  }

  /**
   * Mark an action as failed (used by the adapter).
   */
  public markActionFailed(componentId: string, actionName: string) {
    if (actionName) {
      getFailedActions(componentId).add(actionName);
    }
  }
}
export { failedActionsMap };
