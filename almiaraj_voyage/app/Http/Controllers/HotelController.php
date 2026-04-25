<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Hotel;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class HotelController extends Controller
{
    public function index()
    {
        $hotels = Hotel::with(['service', 'destination'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $hotels
        ]);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            // Simple validation like voyage (no image validation here)
            $validated = $request->validate([
                'nomServ' => 'required|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'required|numeric|min:0',
                'rating' => 'nullable|numeric|min:0|max:5',
                'destination_id' => 'required|exists:destinations,id',
                'amenities' => 'nullable|json',
                // No image validation here - just like voyage
            ]);

            // Handle image - exactly like voyage
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('hotels', 'public');
            }

            // Create service (same as voyage)
            $service = Service::create([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
                'type' => 'hotel',
                'image' => $imagePath,
                'rating' => $request->rating ?? 0,
            ]);

            // Decode amenities
            $amenities = json_decode($request->amenities, true);

            // Create hotel
            $hotel = Hotel::create([
                'id' => $service->id,
                'destination_id' => $request->destination_id,
                'amenities' => $amenities,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hôtel créé avec succès',
                'data' => $service->load('hotel.destination')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'hôtel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $hotel = Hotel::with(['service', 'destination'])->find($id);

            if (!$hotel) {
                return response()->json([
                    'success' => false,
                    'message' => 'Hôtel non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $hotel
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $hotel = Hotel::findOrFail($id);
            $service = Service::findOrFail($id);

            // Simple validation like voyage
            $validated = $request->validate([
                'nomServ' => 'required|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'required|numeric|min:0',
                'rating' => 'nullable|numeric|min:0|max:5',
                'destination_id' => 'required|exists:destinations,id',
                'amenities' => 'nullable|json',
            ]);

            // Update service
            $service->update([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
                'rating' => $request->rating ?? 0,
            ]);

            // Handle image update - exactly like voyage
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($service->image && Storage::disk('public')->exists($service->image)) {
                    Storage::disk('public')->delete($service->image);
                }
                
                $image = $request->file('image');
                $service->image = $image->store('hotels', 'public');
                $service->save();
            }

            // Decode amenities
            $amenities = json_decode($request->amenities, true);

            // Update hotel
            $hotel->update([
                'destination_id' => $request->destination_id,
                'amenities' => $amenities,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hôtel modifié avec succès',
                'data' => $service->load('hotel.destination')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $hotel = Hotel::findOrFail($id);
            $service = Service::findOrFail($id);

            // Delete image if exists (same as voyage)
            if ($service->image && Storage::disk('public')->exists($service->image)) {
                Storage::disk('public')->delete($service->image);
            }

            // Delete hotel
            $hotel->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hôtel supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}