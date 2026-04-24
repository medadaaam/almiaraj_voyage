<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['nomServ', 'description', 'prix', 'image'];

    public function reservations(){
        return $this->hasMany(Reservation::class);
    }
    public function hotels(){
        return $this->hasMany(Hotel::class);
    }
    public function voyages(){
        return $this->hasMany(Voyage::class);
    }
    public function hajjOmras(){
        return $this->hasMany(HajjOmra::class);
    }
    public function billets(){
        return $this->hasMany(Billet::class);
    }
    public function avis(){
        return $this->hasMany(Avis::class);
    }

}
