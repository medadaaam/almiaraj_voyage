<?php

namespace App\Http\Controllers;


use App\Models\Client;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        // ✅ جلب العميل باستخدام id المشترك
        $client = Client::where('id', $user->id)->first();

        if (!$client) {
            // ✅ إذا غير موجود، ننشئه بنفس id المستخدم
            $client = Client::create([
                'id' => $user->id,  // نفس id المستخدم
                'nomCl' => explode(' ', $user->name)[0] ?? '',
                'prenomCl' => explode(' ', $user->name)[1] ?? '',
                'email' => $user->email,
                'numTelCl' => '',
                'natCl' => 'maroc',
                'dateInscription' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'user' => $user,
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
public function update(Request $request)
{
    $user = $request->user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not authenticated'
        ], 401);
    }

    $client = Client::where('id', $user->id)->first();

    if ($client) {
        $client->update([
            'nomCl' => $request->nomCl,
            'prenomCl' => $request->prenomCl,
            'numTelCl' => $request->numTelCl,
            'natCl' => $request->natCl,
            'cin' => $request->cin,
            'passport' => $request->passport,
        ]);
    }

    return response()->json([
        'success' => true,
        'client' => $client
    ]);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        //
    }
}