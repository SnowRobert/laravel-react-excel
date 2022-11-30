<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Menu;

class MenuController extends Controller
{
    
    public function index()
    {
        return response()->json(Menu::all(), 201);
    }

    public function show($menu_id)
    {
        return response()->json(Menu::find($menu_id), 201);
    }
}
