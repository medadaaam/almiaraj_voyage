<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Client;
use App\Models\Passager;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        // Log the incoming request for debugging
        Log::info('Reservation request received', [
            'data' => $request->all()
        ]);
        
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'service_id' => 'required|exists:services,id',
            'client_principal.nom' => 'required|string|max:50',
            'client_principal.prenom' => 'required|string|max:50',
            'client_principal.email' => 'required|email',
            'client_principal.telephone' => 'required|string|max:15',
            'client_principal.cin' => 'required|string|max:20',
            'reservation.check_in' => 'required|date|after_or_equal:today',
            'reservation.check_out' => 'required|date|after:reservation.check_in',
            'reservation.type_chambre' => 'required|string',
            'reservation.nombre_passagers' => 'required|integer|min:1',
            'reservation.prix_total' => 'required|numeric|min:0',
            'reservation.demandes_speciales' => 'nullable|string',
            'passagers' => 'nullable|array',
            'passagers.*.nom' => 'required_with:passagers|string|max:50',
            'passagers.*.prenom' => 'required_with:passagers|string|max:50',
            'passagers.*.cin' => 'required_with:passagers|string|max:20',
            'passagers.*.nationalite' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', ['errors' => $validator->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();
            
            // Get validated data
            $validated = $validator->validated();
            
            Log::info('Validation passed', ['validated' => $validated]);
            
            // Create or get the client (client principal)
            $client = Client::where('email', $validated['client_principal']['email'])
                            ->orWhere('cin', $validated['client_principal']['cin'])
                            ->first();
            
            if (!$client) {
                // Create new client
                $client = Client::create([
                    'nom' => $validated['client_principal']['nom'],
                    'prenom' => $validated['client_principal']['prenom'],
                    'email' => $validated['client_principal']['email'],
                    'telephone' => $validated['client_principal']['telephone'],
                    'cin' => $validated['client_principal']['cin'],
                ]);
                Log::info('New client created', ['client_id' => $client->id]);
            } else {
                // Update existing client with latest info
                $client->update([
                    'nom' => $validated['client_principal']['nom'],
                    'prenom' => $validated['client_principal']['prenom'],
                    'telephone' => $validated['client_principal']['telephone'],
                ]);
                Log::info('Existing client updated', ['client_id' => $client->id]);
            }
            
            // Create the reservation
            $reservationData = [
                'nbPers' => $validated['reservation']['nombre_passagers'],
                'dateRes' => now(),
                'statusRes' => 'pending',
                'checkIn' => $validated['reservation']['check_in'],
                'checkOut' => $validated['reservation']['check_out'],
                'typeChambre' => $validated['reservation']['type_chambre'],
                'dateAnnulation' => null,
                'voucherGenere' => false,
                'service_id' => $validated['service_id'],
                'client_id' => $client->id
            ];
            
            Log::info('Creating reservation with data', $reservationData);
            
            $reservation = Reservation::create($reservationData);
            
            Log::info('Reservation created', ['reservation_id' => $reservation->id]);

            // Create all passengers (if any)
            if (isset($validated['passagers']) && !empty($validated['passagers'])) {
                foreach ($validated['passagers'] as $passagerData) {
                    $passager = Passager::create([
                        'reservation_id' => $reservation->id,
                        'nomPas' => $passagerData['nom'],
                        'prenomPas' => $passagerData['prenom'],
                        'cinPas' => $passagerData['cin'],
                        'passportPass' => $passagerData['nationalite'] ?? null
                    ]);
                    Log::info('Passager created', ['passager_id' => $passager->id]);
                }
            }

            DB::commit();

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Reservation created successfully',
                'data' => [
                    'reservation' => $reservation,
                    'client' => $client,
                    'passagers_count' => isset($validated['passagers']) ? count($validated['passagers']) : 0
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Reservation creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create reservation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}