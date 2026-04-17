<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Voyage;
use Illuminate\Http\Request;

class VoyageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomServ' => 'required|string',
            'prix' => 'required|numeric',

            // voyage fields
            'destination' => 'required|string',
            'dateDepart' => 'required|date',
            'dateRetour' => 'required|date',
        ]);

        $service = Service::create([
            'nomServ' => $validated['nomServ'],
            'prix' => $validated['prix'],
        ]);

        $voyage = Voyage::create([
            'service_id' => $service->id,
            'destination' => $validated['destination'],
            'dateDepart' => $validated['dateDepart'],
            'dateRetour' => $validated['dateRetour'],
        ]);

        return response()->json([$service, $voyage], 201);
    }
}