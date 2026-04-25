<?php

use App\Http\Controllers\BilletController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DestinationController;
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
Route::post('/services', [ServiceController::class, 'store']);
Route::post('/hotels', [HotelController::class, 'store']);
Route::post('/voyages', [VoyageController::class, 'store']);
Route::post('/hajj-omras', [HajjOmraController::class, 'store']);
Route::post('/billets', [BilletController::class, 'store']);


Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{id}/services', [DestinationController::class, 'getServices']);


Route::get('/billets', [BilletController::class, 'index']);
Route::get('/omraHajj', [HajjOmraController::class, 'index']);
Route::get('/voyages', [VoyageController::class, 'index']);
Route::get('/hotels', [HotelController::class, 'index']);

Route::get('/omraHajj/{id}', [HajjOmraController::class, 'show']);
Route::get('/billets/{id}', [BilletController::class, 'show']);
Route::get('/hotels/{id}', [HotelController::class, 'show']);
Route::get('/voyages/{id}', [VoyageController::class, 'show']);


Route::middleware('auth:sanctum')->get('/clients', [ClientController::class, 'index']);

require __DIR__.'/auth.php';
