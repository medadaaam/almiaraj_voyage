<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Voyage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class VoyageController extends Controller
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

            // 2. Create voyage with the SAME ID as the service
            $voyage = Voyage::create([
                'id' => $service->id,  // CRITICAL: Use the service's ID
                'destinationV' => $request->destinationV,
                'dateDepartV' => $request->dateDepartV,
                'dateRetourV' => $request->dateRetourV,
                'programme' => $request->programme,
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
                'data' => [
                    'service' => $service,
                    'voyage' => $voyage
                ]
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