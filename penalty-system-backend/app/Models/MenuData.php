<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuData extends Model
{
    use HasFactory;

    protected $fillable = [
        'data',
        'vehicle_id',
        'menu_id',
        'added_by',

    ];

    protected $casts = [
        'data' => 'array'
    ];

    protected $with = [
        'menu', 
        'addedBy'
    ];

    protected $table = "menu_data";

    public function getTableName(){
        return $this->table;
    }
    public function menu() {

        return $this->belongsTo(Menu::class);
    }
    public function addedBy() {

        return $this->belongsTo(User::class, 'added_by', 'id');
    }
}
