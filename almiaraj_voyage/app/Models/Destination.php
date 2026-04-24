<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    protected $table = 'destinations';
    protected $fillable = ['nom', 'pays', 'continente', 'en_vedette', 'desc', 'image'];

    public function hotels()
    {
        return $this->hasMany(Hotel::class);
    }

    public function voyages()
    {
        return $this->hasMany(Voyage::class);
    }
}