<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
      public function indexCl()
    {
        $dest = Destination::all();
        return response()->json([
            'destinations' => $dest
        ], 200);
    }


    public function getServices($id)
    {
        try {
            $destination = Destination::find($id);

            if (!$destination) {
                return response()->json([
                    'success' => false,
                    'message' => 'Destination not found'
                ], 404);
            }

            $hotels = $destination->hotels()->with('service')->get();
            $voyages = $destination->voyages()->with('service')->get();

            return response()->json([
                'success' => true,
                'destination' => $destination,
                'offres' => [
                    'hotels' => $hotels,
                    'voyages' => $voyages
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Destination $destination)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Destination $destination)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Destination $destination)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Destination $destination)
    {
        //
    }
}
