<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    public $incrementing = false;
    protected $keyType = 'int';
    protected $fillable = ['id', 'villeHotel' ];
    public function service()
    {
        return $this->belongsTo(Service::class,'id', 'id');
    }
}
