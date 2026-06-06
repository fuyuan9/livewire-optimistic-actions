# Release Notes - v1.0.1

This is the initial preview release of `livewire-optimistic-actions`.

## What's New
*   **Declarative Blade Attributes**: Added support for:
    *   `optimistic:increment="property"`
    *   `optimistic:decrement="property"`
    *   `optimistic:set="property, value"`
    *   `optimistic:remove="arrayProperty, matchingKey, targetValue"`
*   **Pending/Failed Indicators**: Elements decorated with `optimistic:pending` and `optimistic:failed` are automatically managed by the queue manager.
*   **Rebase Engine**: Implemented FIFO queue that automatically tracks pending mutations, resolves completed ones, and rebases outstanding ones on top of new canonical server snapshots.
*   **Docker Dev Environment**: Included zero-configuration Docker Compose environment containing PHP 8.3 CLI, Node 22, MySQL, Redis, and Mailpit.
*   **PHP & JS Unit Test Suites**: Fully covered by PHPUnit and Vitest.
