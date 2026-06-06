<?php

namespace Fuyuan9\Livewire\OptimisticActions\Tests;

use Orchestra\Testbench\TestCase as Orchestra;
use Fuyuan9\Livewire\OptimisticActions\LivewireOptimisticActionsServiceProvider;
use Livewire\LivewireServiceProvider;

class TestCase extends Orchestra
{
    /**
     * Get package providers.
     *
     * @param  \Illuminate\Foundation\Application  $app
     * @return array
     */
    protected function getPackageProviders($app)
    {
        return [
            LivewireServiceProvider::class,
            LivewireOptimisticActionsServiceProvider::class,
        ];
    }

    /**
     * Define environment setup.
     *
     * @param  \Illuminate\Foundation\Application  $app
     * @return void
     */
    protected function getEnvironmentSetUp($app)
    {
        // Setup default database or configuration if needed
    }
}
