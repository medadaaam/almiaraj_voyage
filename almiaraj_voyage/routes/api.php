<?php


use App\Http\Controllers\ClientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\ServiceController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
// For testing only - remove in production
Route::post('/services', [ServiceController::class, 'store'])->withoutMiddleware(['auth:sanctum']); 

require __DIR__.'/auth.php';
