<div class="container">
    <h2>Livewire Optimistic</h2>
    <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 1rem;">Token: {{ csrf_token() }}</div>
    <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 1rem;">Session ID: {{ session()->getId() }}</div>
    
    <!-- Likes Section -->
    <div style="margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1.5rem;">
        <h3>Likes Counter</h3>
        <div class="counter" x-text="$wire.likes">{{ $likes }}</div>
        
        <button 
            wire:click="like" 
            optimistic:increment="likes"
        >
            👍 Like
        </button>
        <button 
            wire:click="unlike" 
            optimistic:decrement="likes"
            class="unlike"
        >
            👎 Unlike
        </button>

        <div optimistic:pending="like" class="pending">Processing like...</div>
        <div optimistic:pending="unlike" class="pending">Processing unlike...</div>
        <div optimistic:failed="like" class="failed">Failed to update like!</div>
    </div>

    <!-- Status Section -->
    <div style="margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1.5rem;">
        <h3>Status Mutation</h3>
        <div style="margin: 1.5rem 0;">
            Current Status: 
            <span class="status-badge" :class="$wire.status === 'published' ? 'published' : ''" x-text="$wire.status">
                {{ $status }}
            </span>
        </div>
        
        <button 
            wire:click="publish" 
            optimistic:set="status, published"
        >
            🚀 Publish Now
        </button>

        <div optimistic:pending="publish" class="pending">Publishing...</div>
        <div optimistic:failed="publish" class="failed">Failed to publish.</div>
    </div>

    <!-- Collection Section -->
    <div>
        <h3>Todo List (Remove Element)</h3>
        <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 1rem;">Tip: Deleting "Read a book" will fail and rollback.</p>
        
        @error('todo')
            <div style="color: #f87171; font-size: 0.875rem; margin-bottom: 0.75rem;">{{ $message }}</div>
        @enderror

        <div style="margin-top: 1rem; text-align: left;">
            @foreach($todos as $todo)
                <div class="todo-item" id="todo-{{ $todo['id'] }}" x-show="Array.isArray($wire.todos) && $wire.todos.some(t => t.id === {{ $todo['id'] }})">
                    <span style="font-weight: 500;">{{ $todo['title'] }}</span>
                    <button 
                        wire:click="deleteTodo({{ $todo['id'] }})"
                        optimistic:remove="todos, id, {{ $todo['id'] }}"
                        style="padding: 0.35rem 0.75rem; font-size: 0.75rem; background: #dc2626; margin: 0; box-shadow: none;"
                    >
                        Delete
                    </button>
                </div>
            @endforeach
        </div>

        <div optimistic:pending="deleteTodo" class="pending">Deleting todo...</div>
        <div optimistic:failed="deleteTodo" class="failed">Could not delete todo!</div>
    </div>
</div>
