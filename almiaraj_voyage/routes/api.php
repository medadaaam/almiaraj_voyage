<?php

use App\Http\Controllers\BilletController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\HajjOmraController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\VoyageController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
// For testing only - remove in production
Route::post('/services', [ServiceController::class, 'store'])->withoutMiddleware(['auth:sanctum']); 
Route::apiResource('hotels', HotelController::class);
Route::apiResource('voyages', VoyageController::class);
Route::apiResource('billets', BilletController::class);
Route::apiResource('hajj-omra', HajjOmraController::class);
Route::apiResource('reservations', ReservationController::class);

require __DIR__.'/auth.php';
