<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;


    protected $table = "menu_items";
    protected $fillable = [
        'name',
        'menu_id',
        'added_by',

    ];

    protected $with = [
        'menu',
    ];
    
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
