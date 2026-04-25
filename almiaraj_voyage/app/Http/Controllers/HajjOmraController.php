<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\HajjOmra;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class HajjOmraController extends Controller
{

    public function indexCl()
{
    $items = HajjOmra::with('service')->get();

    $data = $items->map(function ($h) {
        return [
            'id' => $h->id,
            'title' => $h->service->nomServ,
            'depart' => $h->dateDepartHO,
            'retour' => $h->dateRetourHO,
            'duration' => $h->duree . ' jours',
            'price' => $h->service->prix,
            'oldPrice' => $h->service->oldPrix,
            'groupSize' => $h->typeChambre,
            'hotel' => $h->hotel,
            'transport' => $h->transport,
            'meals' => $h->meals,
        ];
    });

    return response()->json($data);
}

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'nomServ' => 'required|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'required|numeric|min:0',
                'titre' => 'required|string|max:100',
                'typeHO' => 'required|in:hajj,omra',
                'descriptionHO' => 'required|string',
                'dateDepartHO' => 'required|date',
                'dateRetourHO' => 'required|date|after_or_equal:dateDepartHO',
                'duree' => 'required|integer|min:1',
                'placesDisponibles' => 'required|integer|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // 1. Create service first (this gets an auto-increment ID)
            $service = Service::create([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
                'image' => null,
            ]);

            // 2. Create hajjOmra with the SAME ID as the service
            $hajjOmra = HajjOmra::create([
                'id' => $service->id,  // CRITICAL: Use the service's ID
                'type' => $request->type,
                'formule' => $request->formule,
                'dateDepartHO' => $request->dateDepartHO,
                'dateRetourHO' => $request->dateRetourHO,
                'duree' => $request->duree,
                'typeChambre' => $request->typeChambre,
            ]);

            // 3. Handle image if exists
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('hajj_omras', 'public');
                $service->image = $imagePath;
                $service->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hajj/Omra created successfully',
                'data' => [
                    'service' => $service,
                    'hajjOmra' => $hajjOmra
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create Hajj/Omra',
                'error' => $e->getMessage()
            ], 500);
        }
    }

        public function showCl($id) {
        $hajjOmra = HajjOmra::with('service')->findOrFail($id);
        return response()->json($hajjOmra);

    }
}
