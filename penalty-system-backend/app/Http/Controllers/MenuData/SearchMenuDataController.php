<?php

namespace App\Http\Controllers\MenuData;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuData;

class SearchMenuDataController extends Controller
{
    public function index(Request $request)
    {
        $request->validate($rules = [

            'value' => 'required',
            'menu_id' => 'required|integer',

        ]);    
        $menuData = new MenuData();
        if($request->has('sort_by')) {
            $menuData = $menuData->orderBy($request->sort_by, 'DESC');
        }
        
        $perPage = ($request->has('per_page'))?$request->per_page:env('PER_PAGE');
        return response()->json(
            $menuData->where("data", 'LIKE', '%'.$request->value.'%')
            ->where("menu_id", $request->menu_id)
            ->paginate($perPage), 
        201);
    

    }
}
