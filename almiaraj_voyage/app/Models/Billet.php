<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Billet extends Model
{
    protected $fillable = ['villeDepartBi', 'destinationBi', 'dateDepartBi', 'bagage', 'service_id'];
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
