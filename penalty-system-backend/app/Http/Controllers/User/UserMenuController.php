<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Menu;
use Illuminate\Support\Facades\Auth;

class UserMenuController extends Controller
{
    
    public function store(Request $request, $user_id)
    {
        
        $request->validate($rules = [
    
            'name' => 'required|unique:menus',

        ]);

        $menu = new Menu();
        $user = Auth::user();
        $menu->name = $request->name;
        $menu->added_by = $user->id;
        $menu->save();
        return response()->json([
            "message" => "Talep ettiginiz menü başarıyla eklendi",
            "menu_id" => $menu->id
        ], 201);


    }

    public function destroy($user_id, $menu_id) {
        $user = Auth::user();
        $menu = Menu::find($menu_id);
        if($menu->added_by == $user->id) {
            $menu->delete();
            return response()->json("Menü kategorisi başarıyla silindi", 201);
        }
        return response()->json("Maalesef menü silinemedi. Menü verileri yalnızca ilgili sahibi tarafından silinebilir", 401);
    }
}
