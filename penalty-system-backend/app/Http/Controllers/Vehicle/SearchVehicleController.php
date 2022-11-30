<?php

namespace App\Http\Controllers\Vehicle;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\traits\Utils;

class SearchVehicleController extends Controller
{
    use Utils;


    public function index(Request $request) {

        $request->validate($rules = [
    
            'value' => 'required',

        ]);

        $vehicle = new Vehicle();
        $columns = $this->getTableColumns($vehicle->getTableName());
        $counter = 0;
        foreach($columns as $name) {
            if($counter == 0) {
                
                $vehicle = $vehicle->where($name, 'LIKE', '%'.$request->value.'%');
            }else {

                $vehicle = $vehicle->orWhere($name, 'LIKE', '%'.$request->value.'%');
            }
            $counter ++;
        }
        if(request()->has('sort_by')) {
            $vehicle = $vehicle->orderBy(request()->sort_by, 'DESC');
        }
        
        $perPage = (request()->has('per_page'))?request()->per_page:env('PER_PAGE');
        return response()->json($vehicle->paginate($perPage), 201);

    }
}
