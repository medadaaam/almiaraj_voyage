<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate and store the service + hotel data
        $validated = $request->validate([
            'nomServ' => 'required|string',
            'description' => 'nullable|string',
            'prix' => 'required|numeric',
            'capaciteTotal' => 'required|integer',
            'placeDisponibles' => 'required|integer',
            'villeHotel' => 'required|string',
            'checkIn' => 'required|date',
            'checkOut' => 'required|date',
            'typeChambre' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Create service
        $service = Service::create($validated);

        // Create hotel associated with the service
        $hotel = Hotel::create([
            'service_id' => $service->id,
            'villeHotel' => $validated['villeHotel'],
            'checkIn' => $validated['checkIn'],
            'checkOut' => $validated['checkOut'],
            'typeChambre' => $validated['typeChambre'],
        ]);

        return response()->json(['service' => $service, 'hotel' => $hotel], 201);
    }
    
    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        //
    }
}
