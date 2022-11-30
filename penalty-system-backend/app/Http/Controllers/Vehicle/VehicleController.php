<?php

namespace App\Http\Controllers\Vehicle;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicle = new Vehicle();
        if(request()->has('sort_by')) {
            $vehicle = $vehicle->orderBy(request()->sort_by, 'DESC');
        }
        
        $perPage = (request()->has('per_page'))?request()->per_page:env('PER_PAGE');
        return response()->json($vehicle->paginate($perPage), 201);
    }

    public function getAllPlateNumbers () {

        $allPlateNumbers = [];
        $vehicles = Vehicle::all();
        foreach ($vehicles as $key => $value) {
            $allPlateNumbers[] =[
                'id'=> $value["id"],
                'plate_number' => $value["plate_number"]
            ];
        }
        return response()->json($allPlateNumbers, 201);
    }
}
