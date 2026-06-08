<?php

namespace App\Providers;

use App\Services\Contracts\BookingProvider;
use App\Services\MockBookingProvider;
use Illuminate\Support\ServiceProvider;
use InvalidArgumentException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(BookingProvider::class, function (): BookingProvider {
            return match (config('booking.api_mode', 'mock')) {
                'mock' => new MockBookingProvider,
                default => throw new InvalidArgumentException('Unsupported booking API mode.'),
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
