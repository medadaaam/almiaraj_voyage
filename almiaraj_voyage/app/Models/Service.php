<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['nomServ', 'description', 'prix', 'image','type'];

    public function reservations(){
        return $this->hasMany(Reservation::class);
    }
<<<<<<< HEAD
    public function hotels(){
        return $this->hasMany(Hotel::class);
=======
    public function hotel(){
        return $this->hasOne(Hotel::class,'id','id');
>>>>>>> f594d2924eb2c2d5913305f21e52f7ad58626dfa
    }
    public function voyage(){
        return $this->hasOne(Voyage::class,'id','id');
    }
    public function hajjOmra(){
        return $this->hasOne(HajjOmra::class,'id','id');
    }
    public function billet(){
        return $this->hasOne(Billet::class,'id','id');
    }
    public function avis(){
        return $this->hasMany(Avis::class);
    }

}
