<?php

use App\Http\Controllers\BilletController;
use App\Http\Controllers\ClientController ;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\HajjOmraController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\MessageController;
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
    Route::post('/reservations/hotel', [ReservationController::class, 'storeHotel']);
    Route::post('/billets/reserver', [ReservationController::class, 'storeBillet']);
    Route::get('/my-reservations', [ReservationController::class, 'myReservations']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
});



Route::post('/contact/message', [MessageController::class, 'store']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-messages', [MessageController::class, 'myMessages']);
    Route::get('/client/messages/{id}', [MessageController::class, 'showForClient']);
    Route::post('/client/messages/{id}/reply', [MessageController::class, 'reply']);

});

Route::post('/services', [ServiceController::class, 'store']);

Route::prefix('client')->group(function () {
    Route::get('/voyages', [VoyageController::class, 'indexCl']);
    Route::get('/hotels', [HotelController::class, 'indexCl']);
    Route::get('/hajj-omras', [HajjOmraController::class, 'indexCl']);
    Route::get('/billets', [BilletController::class, 'indexCl']);
});

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
Route::prefix('hotels')->group(function () {
    Route::get('/', [HotelController::class, 'index']);
    Route::get('/{id}', [HotelController::class, 'show']);
    Route::post('/', [HotelController::class, 'store']);
    Route::put('/{id}', [HotelController::class, 'update']);
    Route::delete('/{id}', [HotelController::class, 'destroy']);
});
Route::prefix('hajj-omras')->group(function () {
    Route::get('/', [HajjOmraController::class, 'index']);
    Route::get('/{id}', [HajjOmraController::class, 'show']);
    Route::post('/', [HajjOmraController::class, 'store']);
    Route::put('/{id}', [HajjOmraController::class, 'update']);
    Route::delete('/{id}', [HajjOmraController::class, 'destroy']);
});
Route::prefix('billets')->group(function () {
    Route::get('/', [BilletController::class, 'index']);
    Route::get('/{id}', [BilletController::class, 'show']);
    Route::post('/', [BilletController::class, 'store']);
    Route::put('/{id}', [BilletController::class, 'update']);
    Route::delete('/{id}', [BilletController::class, 'destroy']);
});

Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/search', [VoyageController::class, 'searchDestinations']);
Route::post('/voyages', [VoyageController::class, 'store']);

require __DIR__.'/auth.php';
