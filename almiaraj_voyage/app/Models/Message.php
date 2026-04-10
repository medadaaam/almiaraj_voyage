<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['nomM', 'numTelM', 'emailM', 'contenu', 'dateM', 'statusM', 'client_id'];
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
