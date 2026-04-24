<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\HajjOmra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HajjOmraController extends Controller
{
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            
            // Validate request
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
            
            // 1. Create service first
            $service = Service::create([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
                'image' => null,
            ]);
            
            // 2. Create hajj/omra with the same ID
            $hajjOmra = HajjOmra::create([
                'id' => $service->id,
                'titre' => $request->titre,
                'typeHO' => $request->typeHO,
                'description' => $request->descriptionHO,
                'dateDepartHO' => $request->dateDepartHO,
                'dateRetourHO' => $request->dateRetourHO,
                'duree' => $request->duree,
                'placesDisponibles' => $request->placesDisponibles,
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
}         