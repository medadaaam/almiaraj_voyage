<?php

namespace App\Http\Controllers;


use App\Models\Client;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(Request $req)
{
    $user = $req->user();

    if (!$user) {
        return response()->json([
            'message' => 'Unauthorized'
        ], 401);
    }
    $client = $user->client;

    return response()->json([
        'client' => $client
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        // $request->validate([
        //     'nom' => ['required'],
        //     'prenom' => ['required'],
        //     'email' => ['required', 'email', 'unique:users'],
        //     'password' => ['required', 'confirmed'],
        //     'nat' => ['required'],
        //     'numTel' => ['required'],
        // ]);


        // $user = User::create([
        //     'name' => $request->nom . ' ' . $request->prenom,
        //     'email' => $request->email,
        //     'password' => Hash::make($request->password),
        // ]);


        // Client::create([
        //     'user_id' => $user->id,
        //     'nomCl' => $request->nom,
        //     'prenomCl' => $request->prenom,
        //     'natCl' => $request->nat,
        //     'numTelCl' => $request->numTel,
        //     'email' => $request->email,
        //     'dateInscription' => now(),
        // ]);

        // Auth::login($user);

        // return response()->json([
        //     'user' => $user
        // ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        //
    }
}
