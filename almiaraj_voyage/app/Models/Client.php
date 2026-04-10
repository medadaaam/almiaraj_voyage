<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'cin',
        'passport',
        'natCl',
        'dateInscription',
        'nomCl',
        'prenomCl',
        'numTelCl',
        'email',
        'user_id'
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function reservations(){
        return $this->hasMany(Reservation::class);
    }
    public function avis(){
        return $this->hasMany(Avis::class);
    }
    public function messages(){
        return $this->hasMany(Message::class);
    }
}
