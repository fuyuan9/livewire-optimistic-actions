<?php

namespace Fuyuan9\Livewire\OptimisticActions;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;

class LivewireOptimisticActionsServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../config/livewire-optimistic-actions.php',
            'livewire-optimistic-actions'
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(\Illuminate\Routing\Router $router): void
    {
        if ($this->app->environment('local', 'testing')) {
            if (class_exists(\Livewire\Livewire::class) && class_exists(\Workbench\App\Livewire\LivewireOptimisticActionsDemoComponent::class)) {
                \Livewire\Livewire::component('livewire-optimistic-actions-demo-component', \Workbench\App\Livewire\LivewireOptimisticActionsDemoComponent::class);
            }
        }

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../config/livewire-optimistic-actions.php' => config_path('livewire-optimistic-actions.php'),
            ], 'livewire-optimistic-actions-config');
        }

        // Register the Blade directive for injecting the built JS asset
        Blade::directive('livewireOptimisticActions', function () {
            $jsPath = __DIR__ . '/../dist/livewire-optimistic-actions.js';
            if (file_exists($jsPath)) {
                $js = file_get_contents($jsPath);
                return "<script>{$js}</script>";
            }
            return '<!-- Livewire Optimistic Actions: Asset not found. Please run npm run build -->';
        });
    }
}
