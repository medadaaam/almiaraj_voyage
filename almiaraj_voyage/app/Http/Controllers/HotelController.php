<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Hotel;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    public function index()
    {
        $hotels = Hotel::with('service')->get();
        return response()->json($hotels);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // service
            'nomServ' => 'required|string',
            'description' => 'nullable|string',
            'prix' => 'required|numeric',

            // hotel
            'villeHotel' => 'required|string',

            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // 1. create service
        $service = Service::create([
            'nomServ' => $validated['nomServ'],
            'description' => $validated['description'] ?? null,
            'prix' => $validated['prix'],
        ]);

        // 2. upload image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('services', 'public/images');
            $service->image = $path;
            $service->save();
        }

        // 3. create hotel
        $hotel = Hotel::create([
            'service_id' => $service->id,
            'villeHotel' => $validated['villeHotel'],
        ]);

        return response()->json([
            'service' => $service,
            'hotel' => $hotel
        ], 201);
    }

    public function show($id)
    {
        $hotel = Hotel::with('service')->findOrFail($id);
        return response()->json($hotel);
    }

    public function update(Request $request, $id)
    {
        $hotel = Hotel::findOrFail($id);
        $service = $hotel->service;

        $validated = $request->validate([
            'nomServ' => 'required|string',
            'prix' => 'required|numeric',
        ]);

        $service->update($validated);

        return response()->json(['message' => 'Updated']);
    }

    public function destroy($id)
    {
        $hotel = Hotel::findOrFail($id);
        $hotel->service()->delete(); // حذف service
        $hotel->delete();

        return response()->json(['message' => 'Deleted']);
    }
}