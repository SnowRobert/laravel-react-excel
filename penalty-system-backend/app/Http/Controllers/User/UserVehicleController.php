<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Auth;


class UserVehicleController extends Controller
{
    public function index($id)
    {
        
        $user = Auth::user();

        $user = $user->myVehicle();
        if(request()->has('sort_by')) {
            $user = $user->orderBy(request()->sort_by, 'DESC');
        }
        
        $perPage = (request()->has('per_page'))?request()->per_page:env('PER_PAGE');
        return response()->json($user->paginate($perPage));
    }
    public function store(Request $request)
    {
        
        $request->validate($rules = [
    
            'plate_number' => 'required|unique:vehicles|max:250',               
            'vehicle_group' => 'max:150',
            'brand_model' => 'max:150',
            'chassis_number' => 'max:150',
            'motor_number' => 'max:150',
            'model_year'=> 'max:150',
            'color' => 'max:150',
            'file_number' => 'max:150',
            'tag' => 'max:150',
            'unit_garage_status' => 'max:150',
            'vehicle_status' => 'max:150',
            'vehicle_type' => 'max:150',
            'delivery_date' => 'max:150',
            'asset_number' => 'max:150',
            'equipment' => 'max:150',
            

        ]);
        $vehicle = new Vehicle();
        $vehicle->plate_number = $request->plate_number;
        $vehicle->vehicle_group = $request->has('vehicle_group')?$request->vehicle_group:"";
        $vehicle->brand_model = $request->has('brand_model')?$request->brand_model:"";
        $vehicle->chassis_number = $request->has('chassis_number')?$request->chassis_number:"";
        $vehicle->motor_number = $request->has('motor_number')?$request->motor_number:"";
        $vehicle->model_year = $request->has('model_year')?$request->model_year:"";
        $vehicle->color = $request->has('color')?$request->color:"";
        $vehicle->file_number = $request->has('file_number')?$request->file_number:"";
        $vehicle->tag = $request->has('tag')?$request->tag:"";
        $vehicle->delivery_date = $request->has('delivery_date')?$request->delivery_date:"";
        $vehicle->asset_number = $request->has('asset_number')?$request->asset_number:"";
        $vehicle->vehicle_type = $request->has('vehicle_type')?$request->vehicle_type:"";
        $vehicle->vehicle_status = $request->has('vehicle_status')?$request->vehicle_status:"";
        $vehicle->unit_garage_status = $request->has('unit_garage_status')?$request->unit_garage_status:"";
        $vehicle->equipment = $request->has('equipment')?$request->equipment:"";

        $user = Auth::user();
        $vehicle->added_by = $user->id;
        $vehicle->addedBy()->associate($vehicle->added_by);
        $vehicle->save();

        return response()->json(["message" => " Araç başarıyla eklendi"], 201);
    }
    public function update(Request $request, $user_id, Vehicle $vehicle)
    {

        
        $request->validate($rules = [
    
            'plate_number' => 'required|max:250',               
            'vehicle_group' => 'max:150',
            'brand_model' => 'max:150',
            'chassis_number' => 'max:150',
            'motor_number' => 'max:150',
            'model_year'=> 'max:150',
            'color' => 'max:150',
            'file_number' => 'max:150',
            'tag' => 'max:150',
            'unit_garage_status' => 'max:150',
            'vehicle_status' => 'max:150',
            'vehicle_type' => 'max:150',
            'delivery_date' => 'max:150',
            'asset_number' => 'max:150',
            'equipment' => 'max:150',

        ]);
        $vehicle->plate_number = $request->plate_number;
        $vehicle->vehicle_group = $request->has('vehicle_group')?$request->vehicle_group:$vehicle->vehicle_group;
        $vehicle->brand_model = $request->has('brand_model')?$request->brand_model:$vehicle->brand_model;
        $vehicle->chassis_number = $request->has('chassis_number')?$request->chassis_number:$vehicle->chassis_number;
        $vehicle->motor_number = $request->has('motor_number')?$request->motor_number:$vehicle->motor_number;
        $vehicle->model_year = $request->has('model_year')?$request->model_year:$vehicle->model_year;
        $vehicle->color = $request->has('color')?$request->color: $vehicle->color;
        $vehicle->file_number = $request->has('file_number')?$request->file_number:$vehicle->file_number;
        $vehicle->tag = $request->has('tag')?$request->tag:$vehicle->tag;
        $vehicle->delivery_date = $request->has('delivery_date')?$request->delivery_date:$vehicle->delivery_date;
        $vehicle->asset_number = $request->has('asset_number')?$request->asset_number:$vehicle->asset_number;
        $vehicle->vehicle_type = $request->has('vehicle_type')?$request->vehicle_type:$vehicle->vehicle_type;
        $vehicle->vehicle_status = $request->has('vehicle_status')?$request->vehicle_status:$vehicle->vehicle_status;
        $vehicle->unit_garage_status = $request->has('unit_garage_status')?$request->unit_garage_status:$vehicle->unit_garage_status;
        $vehicle->equipment = $request->has('equipment')?$request->equipment:"";

        if($vehicle->isDirty()) {
            
            $vehicle->save();

        }

        return response()->json(["message" => "  Araç başarıyla güncellendi"], 201);
    }
    public function destroy($user_id, Vehicle $vehicle)
    {
        $user = Auth::user();
        if($user->id == $vehicle->added_by){
            $vehicle->delete();
            return response()->json(["message" => " Araç başarıyla silindi"], 201);
        }else{
            return response()->json(["message" => " Eklemediğiniz bir aracı silemezsiniz"], 403);
        }

    }
}
