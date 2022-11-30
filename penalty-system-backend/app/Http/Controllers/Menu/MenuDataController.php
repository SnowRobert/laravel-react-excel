<?php

namespace App\Http\Controllers\Menu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Menu;

class MenuDataController extends Controller
{
    public function index(Menu $menu)
    {
        $menu = $menu->menuData();
        if(request()->has('sort_by')) {
            $menu = $menu->orderBy(request()->sort_by, 'DESC');
        }
        
        $perPage = (request()->has('per_page'))?request()->per_page:env('PER_PAGE');
        return response()->json($menu->paginate($perPage));


    }
}
