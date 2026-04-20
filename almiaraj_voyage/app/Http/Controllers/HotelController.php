<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class HotelController extends Controller
{
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            
            // 1. Create service first (this gets an auto-increment ID)
            $service = Service::create([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
                'image' => null,
            ]);

            // 2. Create hotel with the SAME ID as the service
            $hotel = Hotel::create([
                'id' => $service->id,  // CRITICAL: Use the service's ID
                'villeHotel' => $request->villeHotel,
            ]);

            // 3. Handle image if exists
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('hotels', 'public');
                $service->image = $imagePath;
                $service->save();
            }
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hotel created successfully',
                'data' => [
                    'service' => $service,
                    'hotel' => $hotel
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create hotel',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}