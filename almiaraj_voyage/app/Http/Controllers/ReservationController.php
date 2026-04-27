<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Client;
use App\Models\Passager;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    /**
     * Créer une réservation pour un voyage
     */
    public function storeVoyage(Request $request)
    {
        Log::info('Réservation voyage reçue', ['data' => $request->all()]);

        // Validation des données
        $validator = Validator::make($request->all(), [
            'service_id' => 'required|exists:services,id',
            'nbPers' => 'required|integer|min:1|max:20',
            'prixUnitaire' => 'required|numeric|min:0',
            'date_depart' => 'required|date',
            'date_retour' => 'required|date|after:date_depart',
            'passagers' => 'required|array|min:1',
            'passagers.*.nom' => 'required|string|max:50',
            'passagers.*.prenom' => 'required|string|max:50',
            'passagers.*.cin' => 'nullable|string|max:20',
            'passagers.*.passport' => 'nullable|string|max:20',
            'passagers.*.date_naissance' => 'nullable|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation échouée',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        $user = $request->user();

        try {
            DB::beginTransaction();

            // Récupérer le client connecté
            $client = Client::where('user_id', $user->id)->first();

            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Client non trouvé'
                ], 404);
            }

            // Récupérer le service
            $service = Service::find($validated['service_id']);
            if (!$service) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service non trouvé'
                ], 404);
            }

            // Calculer le prix total
            $prixTotal = $validated['prixUnitaire'] * $validated['nbPers'];

            // Créer la réservation
            $reservation = Reservation::create([
                'service_id' => $validated['service_id'],
                'client_id' => $client->id,
                'nbPers' => $validated['nbPers'],
                'prixUnitaire' => $validated['prixUnitaire'],
                'prixTotal' => $prixTotal,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'date_depart' => $validated['date_depart'],
                'date_retour' => $validated['date_retour'],
                'voucher_generated' => false,
                'reference' => $this->generateReference()
            ]);

            Log::info('Réservation créée', ['reservation_id' => $reservation->id]);

            // Créer les passagers
            foreach ($validated['passagers'] as $passagerData) {
                Passager::create([
                    'reservation_id' => $reservation->id,
                    'nomPas' => $passagerData['nom'],
                    'prenomPas' => $passagerData['prenom'],
                    'cinPas' => $passagerData['cin'] ?? null,
                    'passportPas' => $passagerData['passport'] ?? null,
                    'date_naissance' => $passagerData['date_naissance'] ?? null
                ]);
            }

            Log::info('Passagers créés', ['count' => count($validated['passagers'])]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Réservation créée avec succès',
                'reservation' => $reservation->load('passagers', 'service')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur création réservation', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la réservation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Générer une référence unique
     */
    private function generateReference()
    {
        do {
            $reference = 'RES-' . strtoupper(uniqid());
        } while (Reservation::where('reference', $reference)->exists());

        return $reference;
    }

    /**
     * Récupérer les réservations du client connecté
     */
    public function myReservations(Request $request)
    {
        $user = $request->user();
        $client = Client::where('user_id', $user->id)->first();

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client non trouvé'
            ], 404);
        }

        $reservations = Reservation::with(['service', 'passagers'])
            ->where('client_id', $client->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'reservations' => $reservations
        ]);
    }

    /**
     * Récupérer une réservation spécifique
     */
    public function show($id, Request $request)
    {
        $user = $request->user();
        $client = Client::where('user_id', $user->id)->first();

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client non trouvé'
            ], 404);
        }

        $reservation = Reservation::with(['service', 'passagers'])
            ->where('id', $id)
            ->where('client_id', $client->id)
            ->first();

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'reservation' => $reservation
        ]);
    }

    /**
     * Annuler une réservation
     */
    public function cancel($id, Request $request)
    {
        $user = $request->user();
        $client = Client::where('user_id', $user->id)->first();

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client non trouvé'
            ], 404);
        }

        $reservation = Reservation::where('id', $id)
            ->where('client_id', $client->id)
            ->first();

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);
        }

        if ($reservation->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cette réservation ne peut pas être annulée'
            ], 400);
        }

        $reservation->update([
            'status' => 'cancelled',
            'dateAnnulation' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Réservation annulée avec succès'
        ]);
    }
}
