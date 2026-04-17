<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Billet;
use Illuminate\Http\Request;

class BilletController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomServ' => 'required|string',
            'prix' => 'required|numeric',

            'typeTransport' => 'required|string',
            'dateDepart' => 'required|date',
        ]);

        $service = Service::create([
            'nomServ' => $validated['nomServ'],
            'prix' => $validated['prix'],
        ]);

        $billet = Billet::create([
            'service_id' => $service->id,
            'typeTransport' => $validated['typeTransport'],
            'dateDepart' => $validated['dateDepart'],
        ]);

        return response()->json([$service, $billet], 201);
    }
}