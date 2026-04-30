<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Voyage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function indexCl()
    {
        $voyages = Voyage::with(['service', 'destination'])->paginate(6);

        $data = $voyages->getCollection()->map(function ($v) {
            return [
                'id' => $v->id,
                'nomServ' => $v->service->nomServ,
                'destination' => $v->destination->nom,
                'pays' => $v->destination->pays ?? null,
                'image' => $v->service->image,
                'prix' => $v->service->prix,
                'oldPrix' => $v->service->oldPrix ?? null,
                'rating' => $v->service->rating ?? 0,
                'duration' => Carbon::parse($v->dateDepartV)->diffInDays(Carbon::parse($v->dateRetourV)) . ' nuits',
                'groupSize' => $v->groupSize ?? null,
                'featured' => $v->service->enVedette ?? false,
            ];
        });

        return response()->json([
            'data' => $data,
            'current_page' => $voyages->currentPage(),
            'last_page' => $voyages->lastPage(),
            'total' => $voyages->total(),
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

            // Create voyage
            $voyage = Voyage::create([
                'id' => $service->id,
                'destination_id' => $request->destination_id,
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

    public function showCl($id)
    {
        $voyage = Voyage::with(['service', 'destination'])->findOrFail($id);
        return response()->json($voyage);
    }
}
