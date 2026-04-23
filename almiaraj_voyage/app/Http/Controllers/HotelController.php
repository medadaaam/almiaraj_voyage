<?php

namespace App\Http\Controllers;

use App\Models\HajjOmra;
use App\Models\Service;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HotelController extends Controller
{
    // Get all hotels
    public function index()
    {
        $hotels = Service::with('hotel')->where('type', 'hotel')->get();
        return response()->json($hotels);
    }

    // Get single hotel
    public function show($id)
    {
        $hotel = Service::with('hotel')->where('id', $id)->where('type', 'hotel')->firstOrFail();
        return response()->json($hotel);
    }

    // Store new hotel
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            // Validate request
            $validated = $request->validate([
                'nomServ' => 'required|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'required|numeric|min:0',
                'location' => 'required|string|max:255',
                'rating' => 'required|numeric|min:0|max:5',
                'type' => 'required|string|max:100',
                'amenities' => 'nullable|array',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // 1. Create service first
            $service = Service::create([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
                'type' => 'hotel',
                'image' => null,
            ]);

            // 2. Create hajj/omra with the same ID
            $hajjOmra = HajjOmra::create([
                'id' => $service->id,
                'location' => $request->location,
                'rating' => $request->rating,
                'type' => $request->type,
                'amenities' => json_encode($request->amenities ?? []),
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
                'data' => $service->load('hotel')
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

    // Update hotel
    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            
            $service = Service::where('id', $id)->where('type', 'hotel')->firstOrFail();
            $hotel = Hotel::where('id', $id)->firstOrFail();
            
            $validated = $request->validate([
                'nomServ' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'sometimes|numeric|min:0',
                'location' => 'sometimes|string|max:255',
                'rating' => 'sometimes|numeric|min:0|max:5',
                'type' => 'sometimes|string|max:100',
                'amenities' => 'nullable|array',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            
            // Update service
            $service->update($request->only(['nomServ', 'description', 'prix']));
            
            // Update hotel
            $hotelData = $request->only(['location', 'rating', 'type']);
            if ($request->has('amenities')) {
                $hotelData['amenities'] = json_encode($request->amenities);
            }
            $hotel->update($hotelData);
            
            // Handle image update
            if ($request->hasFile('image')) {
                // Delete old image
                if ($service->image && Storage::disk('public')->exists($service->image)) {
                    Storage::disk('public')->delete($service->image);
                }
                
                $image = $request->file('image');
                $imagePath = $image->store('hotels', 'public');
                $service->image = $imagePath;
                $service->save();
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Hotel updated successfully',
                'data' => $service->fresh('hotel')
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update hotel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete hotel
    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            
            $service = Service::where('id', $id)->where('type', 'hotel')->firstOrFail();
            $hotel = Hotel::where('id', $id)->firstOrFail();
            
            // Delete image
            if ($service->image && Storage::disk('public')->exists($service->image)) {
                Storage::disk('public')->delete($service->image);
            }
            
            // Delete hotel and service
            $hotel->delete();
            $service->delete();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Hotel deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete hotel',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
