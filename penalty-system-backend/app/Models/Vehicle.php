<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;
    
    
    protected $table = "vehicles";

    protected $fillable = [
        'plate_number',
        'vehicle_group',
        'brand_model',
        'chassis_number',
        'motor_number',
        'model_year',
        'color',
        'file_number',
        'note',
        'tag',
        'delivery_date',
        'asset_number',
        'added_by',
        'unit_garage_status',
        'vehicle_status',
        'vehicle_type',
        'equipment',

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
    public function menuData() {

        return $this->hasMany(MenuData::class);
    }
}
