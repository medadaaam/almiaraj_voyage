<?php

use App\Http\Controllers\BilletController;
use App\Http\Controllers\ClientController ;
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

// Route::middleware(['auth:sanctum'])->group(function () {
//     Route::post('/reservations', [ReservationController::class, 'store']);
//     Route::get('/reservations/{id}', [ReservationController::class, 'show']);
//     Route::get('/user', function (Request $request) {
//         return $request->user();
//     });
// });

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/reservations/voyage', [ReservationController::class, 'storeVoyage']);
    Route::get('/my-reservations', [ReservationController::class, 'myReservations']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
});



Route::post('/services', [ServiceController::class, 'store']);
Route::post('/hotels', [HotelController::class, 'store']);
// Route::post('/voyages', [VoyageController::class, 'store']);
Route::post('/hajj-omras', [HajjOmraController::class, 'store']);
Route::post('/billets', [BilletController::class, 'store']);

Route::middleware('auth:sanctum')->get('/client/profile', [ClientController::class, 'getProfile']);
Route::middleware('auth:sanctum')->put('/client/profile', [ClientController::class, 'update']);

Route::get('/destinationsCl', [DestinationController::class, 'indexCl']);
Route::get('/destinationsCl/{id}/services', [DestinationController::class, 'getServicesCl']);

Route::get('/billetsCl', [BilletController::class, 'indexCl']);
Route::get('/omraHajjCl', [HajjOmraController::class, 'indexCl']);
Route::get('/voyagesCl', [VoyageController::class, 'indexCl']);
Route::get('/hotelsCl', [HotelController::class, 'indexCl']);

Route::get('/omraHajjCl/{id}', [HajjOmraController::class, 'showCl']);
Route::get('/billetsCl/{id}', [BilletController::class, 'showCl']);
Route::get('/hotelsCl/{id}', [HotelController::class, 'showCl']);
Route::get('/voyagesCl/{id}', [VoyageController::class, 'showCl']);

Route::prefix('voyages')->group(function () {
    Route::get('/', [VoyageController::class, 'index']);
    Route::get('/{id}', [VoyageController::class, 'show']);
    Route::post('/', [VoyageController::class, 'store']);
    Route::put('/{id}', [VoyageController::class, 'update']);
    Route::delete('/{id}', [VoyageController::class, 'destroy']);
});

Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/search', [VoyageController::class, 'searchDestinations']);
Route::post('/voyages', [VoyageController::class, 'store']);

require __DIR__.'/auth.php';
