<?php
// app/Http/Controllers/BilletController.php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Billet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Container\Attributes\Storage;

class BilletController extends Controller
{
    public function indexCl()
    {
        $billets = Billet::with('service')->paginate(6);

        $data = $billets->map(function ($b) {
            return [
                'id' => $b->id,
                'name' => $b->service->nomServ,
                'from' => $b->villeDepartBi,
                'to' => $b->destinationBi,
                'departure' => $b->dateDepartBi,
                'return' => $b->dateRetourBi,
                'type' => $b->typeBi,
                'price' => $b->service->prix,
                'image' => $b->service->image,
                'rating' => $b->service->rating,
            ];
        });
         return response()->json([
            'data' => $data,
            'current_page' => $billets->currentPage(),
            'last_page' => $billets->lastPage(),
            'total' => $billets->total(),

        ]);
        return response()->json($data);
    }



        public function index()
    {
        $billets = Billet::with(['service', 'destination'])
            ->orderBy('id', 'desc')
            ->paginate(5);

        return response()->json([
            'success' => true,
            'data' => $billets
        ]);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            // Validation
            $rules = [
                'nomServ' => 'required|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'required|numeric|min:0',
                'typeBi' => 'required|in:aller_simple,aller_retour',
                'villeDepartBi' => 'required|string|max:100',
                'destination_id' => 'required|exists:destinations,id',
                'dateDepartBi' => 'required|date',
            ];

            // Add conditional validation for aller_retour
            if ($request->typeBi === 'aller_retour') {
                $rules['dateRetourBi'] = 'required|date|after_or_equal:dateDepartBi';
            } else {
                $rules['dateRetourBi'] = 'nullable|date';
            }

            $validated = $request->validate($rules);

            // Handle image
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('billets', 'public');
            }

            // Create service
            $service = Service::create([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
                'type' => 'billet',
                'image' => $imagePath,
            ]);

            // Create billet
            $billet = Billet::create([
                'id' => $service->id,
                'typeBi' => $request->typeBi,
                'villeDepartBi' => $request->villeDepartBi,
                'destination_id' => $request->destination_id,
                'dateDepartBi' => $request->dateDepartBi,
                'dateRetourBi' => $request->dateRetourBi ?? null,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Billet créé avec succès',
                'data' => $service->load('billet.destination')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $billet = Billet::with(['service', 'destination'])->find($id);

            if (!$billet) {
                return response()->json([
                    'success' => false,
                    'message' => 'Billet non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $billet
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

            $billet = Billet::findOrFail($id);
            $service = Service::findOrFail($id);

            // Validation
            $rules = [
                'nomServ' => 'required|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'required|numeric|min:0',
                'typeBi' => 'required|in:aller_simple,aller_retour',
                'villeDepartBi' => 'required|string|max:100',
                'destination_id' => 'required|exists:destinations,id',
                'dateDepartBi' => 'required|date',
            ];

            if ($request->typeBi === 'aller_retour') {
                $rules['dateRetourBi'] = 'required|date|after_or_equal:dateDepartBi';
            } else {
                $rules['dateRetourBi'] = 'nullable|date';
            }

            $validated = $request->validate($rules);

            // Update service
            $service->update([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
            ]);

            // Handle image update
            if ($request->hasFile('image')) {
                if ($service->image && Storage::disk('public')->exists($service->image)) {
                    Storage::disk('public')->delete($service->image);
                }
                $image = $request->file('image');
                $service->image = $image->store('billets', 'public');
                $service->save();
            }

            // Update billet
            $billet->update([
                'typeBi' => $request->typeBi,
                'villeDepartBi' => $request->villeDepartBi,
                'destination_id' => $request->destination_id,
                'dateDepartBi' => $request->dateDepartBi,
                'dateRetourBi' => $request->dateRetourBi ?? null,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Billet modifié avec succès'
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

            $billet = Billet::findOrFail($id);
            $service = Service::findOrFail($id);

            if ($service->image && Storage::disk('public')->exists($service->image)) {
                Storage::disk('public')->delete($service->image);
            }

            $billet->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Billet supprimé avec succès'
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

    public function showCl($id) {
        $billet = Billet::with('service')->findOrFail($id);
        return response()->json($billet);

    }

}
