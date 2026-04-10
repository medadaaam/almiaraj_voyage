<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = ['nbPers','dateRes','statusRes','dateAnnulation','voucherGenere'];
    public function service(){
        return $this->belongsTo(Service::class,'service_id');
    }
    public function client(){
        return $this->belongsTo(Client::class,'client_id');
    }
    public function paiement(){
        return $this->hasOne(Paiement::class);
    }
    public function passagers(){
        return $this->hasMany(Passager::class);
    }
    public function voucher(){
        return $this->hasOne(Voucher::class);
    }
}
