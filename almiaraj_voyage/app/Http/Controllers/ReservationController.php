<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Client;
use App\Models\Passager;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'hotel_id' => 'required|exists:services,id', // Assuming hotels are in services table
            'client_principal.nom' => 'required|string|max:50',
            'client_principal.prenom' => 'required|string|max:50',
            'client_principal.email' => 'required|email',
            'client_principal.telephone' => 'required|string|max:15',
            'client_principal.cin' => 'required|string|max:20',
            'reservation.check_in' => 'required|date',
            'reservation.check_out' => 'required|date|after:reservation.check_in',
            'reservation.type_chambre' => 'required|string',
            'reservation.nombre_passagers' => 'required|integer|min:1',
            'reservation.prix_total' => 'required|numeric|min:0',
            'reservation.demandes_speciales' => 'nullable|string',
            'passagers' => 'nullable|array', // Make passagers optional
            'passagers.*.nom' => 'required_with:passagers|string|max:50',
            'passagers.*.prenom' => 'required_with:passagers|string|max:50',
            'passagers.*.cin' => 'required_with:passagers|string|max:20',
            'passagers.*.nationalite' => 'nullable|string' // Make nationalite optional
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get validated data
            $validated = $validator->validated();
            
            // First, create or get the client (client principal)
            // Check if client already exists by email or CIN
            $client = Client::where('email', $validated['client_principal']['email'])
                            ->orWhere('cin', $validated['client_principal']['cin'])
                            ->first();
            
            
            // 1. Create the main reservation
            $reservation = Reservation::create([
                'nbPers' => $validated['reservation']['nombre_passagers'],
                'dateRes' => now(),
                'statusRes' => 'pending', // pending, confirmed, cancelled, completed
                'checkIn' => $validated['reservation']['check_in'],
                'checkOut' => $validated['reservation']['check_out'],
                'typeChambre' => $validated['reservation']['type_chambre'],
                'dateAnnulation' => null,
                'voucherGenere' => false,
                'service_id' => $validated['hotel_id'], // Using service_id since hotels are in services table
                'client_id' => $client->id
            ]);

            // 2. Create all passengers (if any)
            if (isset($validated['passagers']) && !empty($validated['passagers'])) {
                foreach ($validated['passagers'] as $passagerData) {
                    Passager::create([
                        'reservation_id' => $reservation->id,
                        'nomPas' => $passagerData['nom'],
                        'prenomPas' => $passagerData['prenom'],
                        'cinPas' => $passagerData['cin'],
                        'passportPass' => $passagerData['nationalite'] ?? null // Store nationalite in passport field or add a new column
                    ]);
                }
            }

           

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Reservation created successfully',
                'data' => [
                    'reservation_id' => $reservation->id,
                    'reservation' => $reservation,
                    'client' => $client,
                    'passagers_count' => isset($validated['passagers']) ? count($validated['passagers']) : 0
                ]
            ], 201);

        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();
            
            // // Log the error for debugging
            // \Log::error('Reservation creation failed: ' . $e->getMessage());
            // \Log::error('Request data: ' . json_encode($request->all()));

            return response()->json([
                'success' => false,
                'message' => 'Failed to create reservation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation)
    {
        // Load relationships
        $reservation->load(['client', 'passagers']);
        
        return response()->json([
            'success' => true,
            'data' => $reservation
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservation $reservation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        //
    }
}