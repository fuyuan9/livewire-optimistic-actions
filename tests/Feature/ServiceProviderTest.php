<?php

namespace Fuyuan9\Livewire\OptimisticActions\Tests\Feature;

use Fuyuan9\Livewire\OptimisticActions\Tests\TestCase;
use Illuminate\Support\Facades\Blade;

class ServiceProviderTest extends TestCase
{
    /** @test */
    public function it_registers_config()
    {
        $this->assertNotNull(config('livewire-optimistic-actions'));
        $this->assertFalse(config('livewire-optimistic-actions.auto_inject'));
    }

    /** @test */
    public function it_registers_blade_directive()
    {
        $directives = Blade::getCustomDirectives();
        $this->assertArrayHasKey('livewireOptimisticActions', $directives);
    }
}
