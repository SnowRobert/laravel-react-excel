<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{

    use HasApiTokens, HasFactory, Notifiable;


    protected $table = "users";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'surname',
        'email',
        'password',
        'verification_token',
        'verified',
        'role',
        'secretariat',
        'department',
        'unit',
        'created_by'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getTableName(){
        return $this->table;
    }

    public function myVehicle() {

        return $this->hasMany(Vehicle::class, 'added_by');
    }

    public function myPenalty() {

        return $this->hasMany(Penalty::class, 'added_by');
    }

    public function myMenuItem() {

        return $this->hasMany(MenuItem::class, 'added_by');
    }
}
