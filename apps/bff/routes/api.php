<?php

use App\Http\Controllers\Api\AncillaryController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ExperienceProfileController;
use App\Http\Controllers\Api\FareController;
use App\Http\Controllers\Api\FlightOffersController;
use App\Http\Controllers\Api\FlightRoutesController;
use App\Http\Controllers\Api\FlightSearchController;
use App\Http\Controllers\Api\LowFareCalendarController;
use App\Http\Controllers\Api\TenantConfigController;
use Illuminate\Support\Facades\Route;

Route::get('/experience-profile', ExperienceProfileController::class);
Route::get('/tenant-config', TenantConfigController::class);
Route::get('/flights/routes', FlightRoutesController::class);
Route::post('/flights/calendar', LowFareCalendarController::class);
Route::post('/flights/offers', FlightOffersController::class);
Route::post('/flights/search', FlightSearchController::class);
Route::post('/fares', FareController::class);
Route::post('/ancillaries', AncillaryController::class);
Route::post('/booking/confirm', BookingController::class);
