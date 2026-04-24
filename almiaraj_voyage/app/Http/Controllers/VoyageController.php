<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Voyage;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VoyageController extends Controller
{
    // Get all destinations for select
    public function getDestinations()
    {
        $destinations = Destination::orderBy('pays')->orderBy('nom')->get();
        return response()->json($destinations);
    }

    // Search destinations
    public function searchDestinations(Request $request)
    {
        $search = $request->get('q');
        $destinations = Destination::where('nom', 'like', "%{$search}%")
            ->orWhere('pays', 'like', "%{$search}%")
            ->orderBy('pays')
            ->orderBy('nom')
            ->get();
        return response()->json($destinations);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            
            // Calculer la durée automatiquement
            $dateDepart = Carbon::parse($request->dateDepartV);
            $dateRetour = Carbon::parse($request->dateRetourV);
            $dureeJours = $dateDepart->diffInDays($dateRetour);
            $duree = $dureeJours . ' jours / ' . ($dureeJours - 1) . ' nuits';
            
            $validated = $request->validate([
                'nomServ' => 'required|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'required|numeric|min:0',
                'destination_id' => 'required|exists:destinations,id',
                'dateDepartV' => 'required|date',
                'dateRetourV' => 'required|date|after_or_equal:dateDepartV',
                'programme' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            
            // Get destination
            $destination = Destination::find($request->destination_id);
            
            // 1. Create service first
            $service = Service::create([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
                'type' => 'voyage',
                'image' => null,
            ]);

            // 2. Create voyage with the SAME ID as the service
            $voyage = Voyage::create([
                'id' => $service->id,
                'destination_id' => $request->destination_id,
                'destinationV' => $destination->nom . ', ' . $destination->pays,
                'dateDepartV' => $request->dateDepartV,
                'dateRetourV' => $request->dateRetourV,
                'programme' => $request->programme,
                'duree' => $duree,
            ]);

            // 3. Handle image if exists
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('voyages', 'public');
                $service->image = $imagePath;
                $service->save();
            }
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Voyage created successfully',
                'data' => $service->load('voyage.destination')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create voyage',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}