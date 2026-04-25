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
    public function index()
    {
        $voyages = Voyage::with(['service', 'destination'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $voyages
        ]);
    }
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            // Calculate duration
            $dateDepart = Carbon::parse($request->dateDepartV);
            $dateRetour = Carbon::parse($request->dateRetourV);
            $dureeJours = $dateDepart->diffInDays($dateRetour);
            $duree = $dureeJours . ' jours / ' . ($dureeJours - 1) . ' nuits';

            // Validation
            $validated = $request->validate([
                'nomServ' => 'required|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'required|numeric|min:0',
                'destination_id' => 'required|exists:destinations,id',
                'selected_cities' => 'nullable|json',
                'dateDepartV' => 'required|date',
                'dateRetourV' => 'required|date|after_or_equal:dateDepartV',
                'programme' => 'required|string',
            ]);

            // Handle image
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('voyages', 'public');
            }

            // Create service
            $service = Service::create([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
                'type' => 'voyage',
                'image' => $imagePath,
            ]);

            // Decode selected cities
            $selectedCities = json_decode($request->selected_cities, true);

            // Create voyage
            $voyage = Voyage::create([
                'id' => $service->id,
                'destination_id' => $request->destination_id,
                'selected_cities' => $selectedCities, // Store as array
                'dateDepartV' => $request->dateDepartV,
                'dateRetourV' => $request->dateRetourV,
                'programme' => $request->programme,
                'duree' => $duree,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Voyage créé avec succès',
                'data' => $service->load('voyage.destination')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du voyage',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function show($id)
    {
        try {
            $voyage = Voyage::with(['service', 'destination'])->find($id);

            if (!$voyage) {
                return response()->json([
                    'success' => false,
                    'message' => 'Voyage non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $voyage
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement du voyage',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $voyage = Voyage::findOrFail($id);
            $service = Service::findOrFail($id);

            // Delete image if exists
            if ($service->image && Storage::disk('public')->exists($service->image)) {
                Storage::disk('public')->delete($service->image);
            }

            // Delete voyage (will cascade to service due to foreign key)
            $voyage->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Voyage deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete voyage',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
