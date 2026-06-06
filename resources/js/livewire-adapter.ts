import { MutationQueue } from "./queue";

const canonicalStates = new Map<string, any>();

/**
 * Capture the current plain canonical state of a Livewire component.
 */
export function getComponentCanonicalState(component: any): any {
  const state: any = {};
  const keys = Object.keys(component.ephemeral || {});
  for (const key of keys) {
    state[key] = component.ephemeral[key];
  }
  return state;
}

export function updateCanonicalState(component: any) {
  canonicalStates.set(component.id, getComponentCanonicalState(component));
}

export function getCanonicalState(component: any): any {
  if (!canonicalStates.has(component.id)) {
    updateCanonicalState(component);
  }
  return canonicalStates.get(component.id);
}

export function applyStateToComponent(component: any, state: any) {
  for (const key of Object.keys(state)) {
    // Mutate the Alpine reactive object directly to trigger Alpine.js reactivity instantly without triggering $wire proxy side-effects
    component.reactive[key] = state[key];
  }
}

/**
 * Register the Livewire commit hooks to handle rebase and resolution.
 */
export function registerLivewireAdapter(
  queue: MutationQueue,
  onMutationResolved: (componentId: string) => void,
  onMutationFailed: (componentId: string, actionName: string) => void,
) {
  document.addEventListener("livewire:init", () => {
    const Livewire = (window as any).Livewire;
    if (!Livewire) return;

    // Cache the initial clean state when a component is initialized
    Livewire.hook("component.init", ({ component }: any) => {
      updateCanonicalState(component);
    });

    // Hook into server commits
    Livewire.hook("commit", ({ component, commit, succeed, fail }: any) => {
      const componentId = component.id;
      const calls = commit.calls || [];

      // Strip any pending optimistic properties from commit.updates to prevent the server
      // from hydrating the component with our optimistic local state.
      const pendings = queue.getPendingForComponent(componentId);
      if (pendings.length > 0 && commit.updates) {
        for (const mutation of pendings) {
          for (const patch of mutation.patches) {
            const topLevelKey = patch.path.split(".")[0];
            if (topLevelKey in commit.updates) {
              console.log(
                `[Optimistic] Stripping pending optimistic property "${topLevelKey}" from commit.updates`,
                commit.updates,
              );
              delete commit.updates[topLevelKey];
            }
          }
        }
      }

      // Record associated action names on this commit payload
      commit._associatedActionNames = calls.map((c: any) => c.method);

      succeed((response: any) => {
        console.log(
          "[Optimistic] Succeed hook triggered. Response keys:",
          response ? Object.keys(response) : "null",
        );
        // Update the clean canonical cache with the server's new state
        updateCanonicalState(component);

        const effects = response?.effects || {};
        console.log("[Optimistic] Effects keys:", Object.keys(effects));
        if (effects.errors) {
          console.error(
            "[Optimistic] Effects errors:",
            JSON.stringify(effects.errors),
          );
        }
        const hasErrors =
          effects.errors && Object.keys(effects.errors).length > 0;
        console.log("[Optimistic] hasErrors:", hasErrors);

        // Resolve matching mutations in the queue
        const actionNames = commit._associatedActionNames || [];
        console.log("[Optimistic] Associated action names:", actionNames);
        for (const actionName of actionNames) {
          if (hasErrors) {
            console.error("[Optimistic] Resolving as FAILED:", actionName);
            queue.resolve(componentId, actionName, false);
            onMutationFailed(componentId, actionName);
          } else {
            console.log("[Optimistic] Resolving as SUCCESS:", actionName);
            queue.resolve(componentId, actionName, true);
          }
        }

        // Rebase remaining pending mutations on top of the new canonical state
        const base = getCanonicalState(component);
        console.log(
          "[Optimistic] Base (canonical) state after succeed:",
          JSON.stringify(base),
        );
        const rebased = queue.rebase(componentId, base);
        console.log(
          "[Optimistic] Rebased state after succeed:",
          JSON.stringify(rebased),
        );
        applyStateToComponent(component, rebased);

        onMutationResolved(componentId);
      });

      fail(() => {
        // Resolve matching mutations in the queue as failed
        const actionNames = commit._associatedActionNames || [];
        for (const actionName of actionNames) {
          queue.resolve(componentId, actionName, false);
          onMutationFailed(componentId, actionName);
        }

        // Rebase remaining pending mutations on top of the last known canonical state
        const base = getCanonicalState(component);
        const rebased = queue.rebase(componentId, base);
        applyStateToComponent(component, rebased);

        onMutationResolved(componentId);
      });
    });
  });
}
