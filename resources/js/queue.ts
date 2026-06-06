import { OptimisticPatch, applyPatch } from "./patches";

export type OptimisticMutation = {
  id: string;
  componentId: string;
  actionName?: string;
  status: "pending" | "committed" | "failed";
  createdAt: number;
  patches: OptimisticPatch[];
};

export class MutationQueue {
  private mutations: OptimisticMutation[] = [];

  /**
   * Enqueue a new optimistic mutation.
   */
  enqueue(mutation: OptimisticMutation): void {
    this.mutations.push(mutation);
  }

  /**
   * Get all pending mutations for a specific component.
   */
  getPendingForComponent(componentId: string): OptimisticMutation[] {
    return this.mutations.filter(
      (m) => m.componentId === componentId && m.status === "pending",
    );
  }

  /**
   * Resolve the oldest pending mutation matching the component and action name.
   */
  resolve(componentId: string, actionName: string, success: boolean): void {
    const index = this.mutations.findIndex(
      (m) =>
        m.componentId === componentId &&
        m.actionName === actionName &&
        m.status === "pending",
    );

    if (index !== -1) {
      if (success) {
        this.mutations[index].status = "committed";
      } else {
        this.mutations[index].status = "failed";
      }
      // Remove it from the queue
      this.mutations.splice(index, 1);
    }
  }

  /**
   * Clear all mutations for a component (e.g. on component removal).
   */
  clearComponent(componentId: string): void {
    this.mutations = this.mutations.filter(
      (m) => m.componentId !== componentId,
    );
  }

  /**
   * Rebase state from a canonical source by applying all pending mutations sequentially.
   */
  rebase(componentId: string, canonicalState: any): any {
    let state = JSON.parse(JSON.stringify(canonicalState));
    const pendings = this.getPendingForComponent(componentId);

    for (const mutation of pendings) {
      for (const patch of mutation.patches) {
        state = applyPatch(state, patch);
      }
    }

    return state;
  }

  /**
   * Internal helper to inspect mutations (mostly for testing).
   */
  getMutations(): OptimisticMutation[] {
    return this.mutations;
  }
}
