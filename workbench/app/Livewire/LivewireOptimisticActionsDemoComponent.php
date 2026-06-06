<?php

namespace Workbench\App\Livewire;

use Livewire\Component;

class LivewireOptimisticActionsDemoComponent extends Component
{
    public $likes = 10;
    public $status = 'draft';
    public $todos = [
        ['id' => 1, 'title' => 'Buy milk'],
        ['id' => 2, 'title' => 'Clean room'],
        ['id' => 3, 'title' => 'Read a book'],
    ];

    public function like()
    {
        sleep(1); // Simulate network latency
        $this->likes++;
    }

    public function unlike()
    {
        sleep(1);
        $this->likes--;
    }

    public function publish()
    {
        sleep(1);
        $this->status = 'published';
    }

    public function deleteTodo($id)
    {
        sleep(1);
        
        // Simulating server-side failure for specific todo (ID: 3) to test rollback/rebase
        if ($id === 3) {
            $this->addError('todo', 'Could not delete item 3 (Simulated Server Error)');
            return;
        }

        $this->todos = array_values(array_filter($this->todos, function ($todo) use ($id) {
            return $todo['id'] !== $id;
        }));
    }

    public function render()
    {
        return view('livewire.livewire-optimistic-actions-demo-component');
    }
}
