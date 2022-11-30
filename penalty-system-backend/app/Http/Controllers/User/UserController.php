<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Penalty;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{


    public function index() {

        $currentUserDetails = Auth::user();
        $id = $currentUserDetails->id;
        $role = $currentUserDetails->role;
        $created_by = $currentUserDetails->created_by;


        $user = new User();

        if(request()->has('sort_by')) {
            if ($role != 'SYSTEM_ADMIN'){
                $user = $user->where([
                    ['id', $id],
                    ['role', $role]
                ])->orWhere('created_by',$id)->orderBy(request()->sort_by, 'DESC');
            }
            else{
                $user = $user->orderBy(request()->sort_by, 'DESC');
            }

        }

        $perPage = (request()->has('per_page'))?request()->per_page:env('PER_PAGE');
        return response()->json($user->paginate($perPage));
    }
    public function show(User $user)
    {
        return response()->json($user, 201);
    }
    public function update(Request $request, User $user)
    {

        $request->validate($rules = [

            'name' => 'required|max:150',
            'surname' => 'required|max:150',

        ]);

        $user->name = $request->name;
        $user->surname = $request->surname;

        if($user->isDirty()) {
            $user->save();
        }
        return response()->json(["message" => "Profil Ayrıntıları başarıyla güncellendi"], 201);
    }
    public function delete($id){
        $user = User::where("id", $id)->delete();
        return response()->json(["message" => " kullanıcı başarıyla silindi"], 200);
    }
}
