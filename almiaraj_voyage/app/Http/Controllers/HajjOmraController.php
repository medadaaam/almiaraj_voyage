<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\HajjOmra;
use Illuminate\Http\Request;

class HajjOmraController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomServ' => 'required|string',
            'prix' => 'required|numeric',

            'type' => 'required|string', // hajj / omra
            'dateDepart' => 'required|date',
        ]);

        $service = Service::create([
            'nomServ' => $validated['nomServ'],
            'prix' => $validated['prix'],
        ]);

        $hajj = HajjOmra::create([
            'service_id' => $service->id,
            'type' => $validated['type'],
            'dateDepart' => $validated['dateDepart'],
        ]);

        return response()->json([$service, $hajj], 201);
    }
}