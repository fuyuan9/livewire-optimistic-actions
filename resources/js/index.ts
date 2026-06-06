import { MutationQueue } from "./queue";
import { OptimisticManager } from "./manager";
import { registerLivewireAdapter } from "./livewire-adapter";

// Initialize global instances
const queue = new MutationQueue();
const manager = new OptimisticManager(queue);

// Bind Livewire lifecycle events to our optimistic queue and manager
registerLivewireAdapter(
  queue,
  (componentId) => {
    const Livewire = (window as any).Livewire;
    if (Livewire) {
      const component = Livewire.find(componentId);
      if (component) {
        manager.syncUI(component);
      }
    }
  },
  (componentId, actionName) => {
    manager.markActionFailed(componentId, actionName);
  },
);

export { queue, manager };
