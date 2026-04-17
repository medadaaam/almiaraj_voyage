<?php

use App\Http\Controllers\BilletController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\HajjOmraController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\VoyageController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
// For testing only - remove in production
Route::post('/services', [ServiceController::class, 'store'])->withoutMiddleware(['auth:sanctum']); 
Route::apiResource('hotels', HotelController::class);
Route::apiResource('voyages', VoyageController::class);
Route::apiResource('billets', BilletController::class);
Route::apiResource('hajj-omra', HajjOmraController::class);

require __DIR__.'/auth.php';
