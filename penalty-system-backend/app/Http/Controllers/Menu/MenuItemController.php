<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuItem;
use App\Models\Menu;

class MenuItemController extends Controller
{
    public function index(Menu $menu)
    {
        return response()->json($menu->menuItem()->get(), 201);
    }
}
