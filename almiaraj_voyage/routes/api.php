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
Route::post('/services', [ServiceController::class, 'store']);
Route::post('/hotels', [HotelController::class, 'store']);
Route::post('/voyages', [VoyageController::class, 'store']);
Route::post('/hajj-omras', [HajjOmraController::class, 'store']);
Route::post('/billets', [BilletController::class, 'store']);

Route::middleware('auth:sanctum')->get('/clients', [ClientController::class, 'index']);

require __DIR__.'/auth.php';
