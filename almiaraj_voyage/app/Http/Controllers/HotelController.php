<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Service;
use App\Models\HajjOmra;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HotelController extends Controller
{

    public function indexCl()
    {
        $hotels = Hotel::with(['service', 'destination'])->paginate(3);

        $data = $hotels->getCollection()->map(function ($h) {
            return [
                'id' => $h->id,
                'name' => $h->service->nomServ,
                'location' => $h->villeHotel . ', ' . ($h->destination->pays ?? ''),
                'image' => $h->service->image,
                'prix' => $h->service->prix,
                'oldPrix' => $h->service->oldPrix,
                'rating' => $h->service->rating,
                'enVedette' => $h->service->enVedette,
                'amenities' => explode(',', $h->amenities ?? ''),
            ];
        });

        return response()->json([
            'data' => $data,
            'current_page' => $hotels->currentPage(),
            'last_page' => $hotels->lastPage(),
            'total' => $hotels->total(),
        ]);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            // Validate request
            // $validated = $request->validate([
            //     'nomServ' => 'required|string|max:255',
            //     'description' => 'nullable|string',
            //     'prix' => 'required|numeric|min:0',
            //     'villeHotel'=> 'required|string',
            //     'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            // ]);
             $destination = Destination::find($request->destination_id);
            // 1. Create service first
            $service = Service::create([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
                'type' => 'hotel',
                'image' => null,
            ]);

            // 2. Create hotel with the same ID
            $hotel = Hotel::create([
                'id' => $service->id,
                'destination_id' => $request->destination_id,
                'villeHotel' => $request->villeHotel
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
                'message' => 'Hotel creé avec succés',
                'data' => [
                    'service' => $service,
                    'hajjOmra' => $hotel
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create Hotel',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showCl($id)
    {
        $hotel = Hotel::with(['service','destination'])->findOrFail($id);
        return response()->json($hotel);
    }
}
