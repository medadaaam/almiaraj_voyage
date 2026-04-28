<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voyage extends Model
{
    public $incrementing = false;
    protected $keyType = 'int';
    protected $fillable = [
<<<<<<< HEAD
        'id', 
        'destination_id', 
        'dateDepartV', 
        'dateRetourV', 
        'programme', 
        'duree'
    ];
    
=======
        'id',
        'destination_id',
        'selected_cities',
        'dateDepartV',
        'dateRetourV',
        'programme',
        'duree'
    ];

    // protected $casts = [
    //     'selected_cities' => 'array',
    // ];
>>>>>>> 5093934f2500db671ca2a32110c82a5868da5272

    public function service()
    {
        return $this->belongsTo(Service::class, 'id', 'id');
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
