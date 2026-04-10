<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HajjOmra extends Model
{
    protected $fillable = ['type', 'formule', 'typeChambre', 'service_id'];
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
