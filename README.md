# Livewire Optimistic Actions

[![Latest Version on Packagist](https://img.shields.io/packagist/v/fuyuan/livewire-optimistic-actions.svg?style=flat-square)](https://packagist.org/packages/fuyuan/livewire-optimistic-actions)
[![Total Downloads](https://img.shields.io/packagist/dt/fuyuan/livewire-optimistic-actions.svg?style=flat-square)](https://packagist.org/packages/fuyuan/livewire-optimistic-actions)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

> **Declarative optimistic actions for Livewire.**  
> *Server-first, Blade-first, rebase-first.*

`livewire-optimistic-actions` is an ultra-lightweight and robust extension package that adds declarative optimistic UI updates to Laravel Livewire v3 actions.

---

## 💡 Package Concept

This package is **not** a client-side state management library. Nor does it attempt to force Livewire to work like React.

*   **The server is always the single source of truth.**
*   Optimistic changes act as a **temporary client-side overlay** until the server response is received.
*   On a successful response, the new state from the server is finalized. On failure, it automatically performs a **rebase rollback** to the original state.
*   It uses a **Rebase Model** that maintains order and reapplies pending updates even when actions are spammed or multiple requests occur concurrently.

---

## ✨ Features (v1.0)

*   **Simple Blade Attribute API**: Works simply by adding HTML attributes (`optimistic:*`).
*   **Rich Scalar Updates**: Supports `increment`, `decrement`, and `set`.
*   **Collection Operations**: Supports `remove` (instantly hiding items from a list).
*   **Pending and Failed UI States**: Indicators using `optimistic:pending` and `optimistic:failed`.
*   **Robust Rebase Model**: Instead of a simple "rollback to previous value" mechanism, it overlays unresolved optimistic updates on top of the latest server state, making it highly resilient to concurrent requests.

---

## 📦 Installation

```bash
composer require fuyuan/livewire-optimistic-actions
```

To load the assets, add the Blade directive immediately after `@livewireScripts` in your layout file (e.g., `app.blade.php`).

```blade
    @livewireScripts
    @livewireOptimisticActions
</body>
```

---

## 🎯 Common Use Cases

This package is extremely effective in scenarios where you want to hide network latency from users while ensuring automatic rollbacks in case of operation errors or communication failures.

### 1. Like, Bookmark, and Favorite Buttons on Social Media
*   **Challenge**: When a user clicks a like button, if there is a delay in the count or icon update before the server responds, they might feel the app is unresponsive and click the button repeatedly.
*   **Solution**: The moment the button is clicked, `optimistic:increment` increases the count by "+1" and activates the button visual. The request is sent in the background, and if a network or server error occurs, it automatically decrements by "-1" back to its original state.

### 2. Deleting Items from Lists or Tables (To-Do Lists, Shopping Carts, etc.)
*   **Challenge**: When deleting a product or task, waiting for the server-side database deletion to complete before updating the UI creates a sluggish user experience.
*   **Solution**: By setting `optimistic:remove`, the targeted item or row vanishes instantly from the screen. If the server-side deletion fails (e.g., lack of permission, database error), the item is automatically restored to its original place (rollback).

### 3. Immediate Status Toggle (Publish/Draft, Enable/Disable)
*   **Challenge**: When toggling an article from "Draft" to "Published", if server-side processing (CDN purging, external APIs) takes a few seconds, the delayed toggle response can confuse users.
*   **Solution**: Use `optimistic:set` to instantly change the badge or toggle state to "Published". The user can proceed with other tasks without waiting.

---

## ⚖️ Benefits of Using the Package vs. Manual Implementation

Optimistic UI updates can be implemented without this package by combining Alpine.js and Livewire. However, doing so manually introduces significant boilerplate and concurrency issues.

### Example of Manual Implementation (Without Package)

Here is how you would manually implement an optimistic update and rollback for a "Like" button:

```blade
<div x-data="{
    likes: {{ $likes }},
    prevLikes: null,
    isPending: false,
    hasFailed: false,
    async like() {
        if (this.isPending) return; // Simple debounce
        
        // 1. Save previous state and update UI optimistically
        this.prevLikes = this.likes;
        this.likes++;
        this.isPending = true;
        this.hasFailed = false;

        try {
            // 2. Perform the server-side action
            // Note: Prevent double-incrementing if Livewire updates the state automatically
            await $wire.like();
        } catch (error) {
            // 3. Rollback on failure
            this.likes = this.prevLikes;
            this.hasFailed = true;
        } finally {
            this.isPending = false;
        }
    }
}">
    <button @click="like()" :disabled="isPending">
        👍 Like
    </button>
    <span x-text="likes"></span>

    <span x-show="isPending">Saving...</span>
    <span x-show="hasFailed" style="color: red;">Failed to save.</span>
</div>
```

#### Challenges of Manual Implementation:
1. **Massive Boilerplate**: For every single feature (like, delete, toggle, etc.), you must manually define Alpine components to manage temporary variables (`prevLikes`), loading states, and error states.
2. **Broken Concurrency (Race Conditions)**: If a user clicks a button twice quickly, or if other asynchronous actions run concurrently, `prevLikes` will get overwritten with the intermediate state (`11`). Consequently, when a rollback happens, the UI reverts to an incorrect state instead of the original state (`10`).
3. **Complex List Operations**: Writing array manipulation code to "instantly hide an element and restore it on error" for a collection like a To-Do list is even more complicated.

---

### 🎁 Benefits of Using This Package

1. **HTML-Only Zero Boilerplate**:
   No need for Alpine.js `x-data` or complex JS logic. You can implement it simply by adding attributes like `optimistic:increment` or `optimistic:remove` to your existing HTML/Blade templates.
2. **Robust Concurrency (Rebase Model)**:
   Instead of just saving and restoring the last value, it uses a Git-like rebase model: **"reapply pending optimistic actions on top of the latest canonical state confirmed by the server."** This keeps the UI perfectly in sync even during button spamming or parallel actions.
3. **Declarative Loading & Error Controls**:
   Just specify `optimistic:pending="actionName"` and `optimistic:failed="actionName"` to automatically handle loading indicators and error states during async actions.

---

## 🚀 Usage

### 1. Counter Increment / Decrement (Likes, etc.)

```blade
<button 
    wire:click="like" 
    optimistic:increment="likes"
>
    👍 Like
</button>

<span>{{ $likes }}</span>

<!-- Show optimistic update progress -->
<span optimistic:pending="like" style="display: none;">Saving...</span>
<span optimistic:failed="like" style="display: none; color: red;">Failed to save.</span>
```

### 2. Set Status (Assignment)

```blade
<button 
    wire:click="publish" 
    optimistic:set="status, published"
>
    🚀 Publish
</button>

<span class="status">{{ $status }}</span>
```

### 3. Remove Item from Collection

Instantly hides elements with a specified key/value from arrays or collections.

```blade
@foreach($todos as $todo)
    <div id="todo-{{ $todo['id'] }}">
        <span>{{ $todo['title'] }}</span>
        <button 
            wire:click="deleteTodo({{ $todo['id'] }})"
            optimistic:remove="todos, id, {{ $todo['id'] }}"
        >
            Delete
        </button>
    </div>
@endforeach
```

---

## 🛠️ Docker Local Development Environment

This package includes a complete Docker environment for developing and testing PHP and JavaScript without polluting your host machine.

### Prerequisites
*   Docker & Docker Compose
*   Make (Optional but recommended)

### Development Steps
1.  Clone the repository.
2.  Build and start `docker compose`.
    ```bash
    make build
    make up
    ```
3.  Set up the environment file.
    ```bash
    cp .env.example .env
    ```
    And generate an application key:
    ```bash
    docker compose exec app ./vendor/bin/testbench key:generate
    ```
4.  Install dependencies.
    ```bash
    make composer-install
    make npm-install
    ```
5.  Build frontend assets.
    ```bash
    make build-js
    ```
6.  Run tests.
    ```bash
    make test      # Run both PHPUnit and Vitest
    make test-php  # Run PHPUnit tests only
    make test-js   # Run Vitest (TypeScript) tests only
    ```
7.  Start the demo server.
    ```bash
    make demo
    ```
    Access `http://localhost:8000` in your browser to see the interactive demo (demonstrating the likes counter, status toggles, deletion rollback behavior, etc.).


---

## 🧪 Testing

### JavaScript / TypeScript Runtime Tests (Vitest)
Tests client-side patching, dot-path resolution, and the Rebase model queue logic.
```bash
make test-js
```

### PHP Integration Tests (PHPUnit)
Tests Laravel service provider registration and Blade asset injection directive registration.
```bash
make test-php
```

---

## ⚠️ Limitations (v1.0)
*   **Offline Mode**: Not supported. Active server communication is required.
*   **Deeply Nested Collections**: Supports only simple ID removal from collections. Deep nested reconciliation is not performed.
*   **Temporary ID Replacement**: Not supported.

---

## 📄 License

Released under the MIT License. See [LICENSE.md](LICENSE.md) for details.
