<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Billet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class BilletController extends Controller
{
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            
            // 1. Create service first (this gets an auto-increment ID)
            $service = Service::create([
                'nomServ' => $request->nomServ,
                'description' => $request->description,
                'prix' => $request->prix,
                'image' => null,
            ]);

            // 2. Create billet with the SAME ID as the service
            $billet = Billet::create([
                'id' => $service->id,  // CRITICAL: Use the service's ID
                'typeBi' => $request->typeBi, // Add this line
                'villeDepartBi' => $request->villeDepartBi,
                'destinationBi' => $request->destinationBi,
                'dateDepartBi' => $request->dateDepartBi,
                'dateRetourBi' => $request->typeBi === 'aller_retour' ? $request->dateRetourBi : null,
            ]);

            // 3. Handle image if exists
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('billets', 'public');
                $service->image = $imagePath;
                $service->save();
            }
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Billet created successfully',
                'data' => [
                    'service' => $service,
                    'billet' => $billet
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create billet',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}