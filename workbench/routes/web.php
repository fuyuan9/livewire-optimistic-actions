<?php

use Illuminate\Support\Facades\Route;
use Workbench\App\Livewire\LivewireOptimisticActionsDemoComponent;

Route::middleware('web')->group(function () {
    Route::get('/', LivewireOptimisticActionsDemoComponent::class);
});
