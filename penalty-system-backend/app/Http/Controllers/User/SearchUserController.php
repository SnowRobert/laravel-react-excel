<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\traits\Utils;

class SearchUserController extends Controller
{
    use Utils;


    public function index(Request $request) {

        $request->validate($rules = [
    
            'value' => 'required',

        ]);

        $user = new User();
        $columns = $this->getTableColumns($user->getTableName());
        
        $counter = 0;
        foreach($columns as $name) {
            if($counter == 0) {
                
                $user = $user->where($name, 'LIKE', '%'.$request->value.'%');
            }else {

                $user = $user->orWhere($name, 'LIKE', '%'.$request->value.'%');
            }
            $counter ++;
        }
        if(request()->has('sort_by')) {
            $user = $user->orderBy(request()->sort_by, 'DESC');
        }
        
        $perPage = (request()->has('per_page'))?request()->per_page:env('PER_PAGE');
        return response()->json($user->paginate($perPage), 201);

    }
}
