<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Passager extends Model
{
    protected $fillable = ['nomPas','prenomPas','cinPas','passportPass','reservation_id'];
    public function reservation(){
        return $this->belongsTo(Reservation::class);
    }
}
