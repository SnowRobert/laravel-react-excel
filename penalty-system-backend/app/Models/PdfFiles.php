<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PdfFiles extends Model
{
    use HasFactory;

    protected $table = "pdf";

    protected $fillable = [
        'file_url',
        'added_by',

    ];
    protected $with = [
        'addedBy',

    ];

    public function getTableName(){
        return $this->table;
    }
    public function addedBy() {

        return $this->belongsTo(User::class, 'added_by', 'id');
    }
}
