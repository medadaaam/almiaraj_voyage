<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voyage extends Model
{
    public $incrementing = false;
    protected $keyType = 'int';
    protected $fillable = ['id', 'destinationV', 'dateDepartV', 'dateRetourV', 'programme'];

    public function service()
    {
        return $this->belongsTo(Service::class, 'id', 'id');
    }
    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
