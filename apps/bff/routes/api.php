<?php

use App\Http\Controllers\Api\AncillaryController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ExperienceProfileController;
use App\Http\Controllers\Api\FareController;
use App\Http\Controllers\Api\FlightSearchController;
use App\Http\Controllers\Api\TenantConfigController;
use Illuminate\Support\Facades\Route;

Route::get('/experience-profile', ExperienceProfileController::class);
Route::get('/tenant-config', TenantConfigController::class);
Route::post('/flights/search', FlightSearchController::class);
Route::post('/fares', FareController::class);
Route::post('/ancillaries', AncillaryController::class);
Route::post('/booking/confirm', BookingController::class);
