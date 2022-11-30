<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuItem;
use Illuminate\Support\Facades\Auth;

class UserMenuItemController extends Controller
{


    public function index($user_id)
    {
        $user = Auth::user();
        return response()->json($user->myMenuItem()->get(), 201);
    }
    public function store(Request $request, $user_id)
    {
        $request->validate($rules = [
    
            'name' => 'required',
            'menu_id'=> 'required|integer',

        ]);

        $user = Auth::user();
        $menu_item_array = explode(',', $request->name);

        //add new pdf columns 
        if(!in_array("pdf", $menu_item_array)) {
            $menu_item_array[] = "pdf";
        } 

        foreach($menu_item_array as $menu_item) {
            $mItem = new MenuItem();
            $mItem->name = $menu_item;
            $mItem->menu_id = $request->menu_id;
            $mItem->added_by = $user->id;
            $mItem->menu()->associate($request->menu_id);
            $mItem->addedBy()->associate($user->id);

            $mItem->save();
            
        }

        return response()->json(["menü öğesi başarıyla eklendi"], 201);
    }
}
