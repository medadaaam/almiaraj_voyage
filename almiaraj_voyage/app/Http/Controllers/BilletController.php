<?php
// app/Http/Controllers/BilletController.php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Billet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BilletController extends Controller
{
    public function index()
    {
        $billets = Billet::with('service')
            ->orderBy('id', 'desc')
            ->get();

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
            $validated = $request->validate([
                'nomServ' => 'required|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'required|numeric|min:0',
                'typeBi' => 'required|in:aller_simple,aller_retour,',
                'villeDepartBi' => 'required|string|max:100',
                'destinationBi' => 'required|string|max:100',
                'dateDepartBi' => 'required|date',
                'dateRetourBi' => 'nullable|date|after_or_equal:dateDepartBi',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

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
                'destinationBi' => $request->destinationBi,
                'dateDepartBi' => $request->dateDepartBi,
                'dateRetourBi' => $request->dateRetourBi,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Billet créé avec succès',
                'data' => $service->load('billet')
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
            $billet = Billet::with('service')->find($id);

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
            $validated = $request->validate([
                'nomServ' => 'required|string|max:255',
                'description' => 'nullable|string',
                'prix' => 'required|numeric|min:0',
                'typeBi' => 'required|in:aller_simple,aller_retour',
                'villeDepartBi' => 'required|string|max:100',
                'destinationBi' => 'required|string|max:100',
                'dateDepartBi' => 'required|date',
                'dateRetourBi' => 'nullable|date|after_or_equal:dateDepartBi',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

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
                'destinationBi' => $request->destinationBi,
                'dateDepartBi' => $request->dateDepartBi,
                'dateRetourBi' => $request->dateRetourBi,
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

            // Delete image if exists
            if ($service->image && Storage::disk('public')->exists($service->image)) {
                Storage::disk('public')->delete($service->image);
            }

            // Delete billet
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
}