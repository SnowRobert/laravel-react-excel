<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuData;
use App\Models\Menu;
use Illuminate\Support\Facades\Auth;

class UserMenuDataController extends Controller
{
    public function store(Request $request, $user_id)
    {
        
        $request->validate($rules = [
    
            'data' => 'required',
            'menu_id'=> 'required|integer',
            'pdf' => 'mimes:pdf|max:50048',            

        ]);
        
        $areFieldsInDb = $this->checkFields($request->data, $request->menu_id );
        if($areFieldsInDb){

            $menuData = new MenuData();
            $menuData->data = json_encode(
                $this->resolveNullValues(json_decode($request->data, true), $request->menu_id)
            );
            $menuData->menu_id = $request->menu_id;
    
            $user = Auth::user();
            $menuData->added_by =$user->id;
            
            $menuData->addedBy()->associate($menuData->added_by);
            $menuData->menu()->associate($menuData->menu_id);

            if($request->hasFile('pdf')) {
                $extension = $request->File('pdf')->getClientOriginalExtension();
                $pdfPath = md5(uniqid()). $request->vehicle_id.'.'.$extension;
                $pdf_url = $request->File('pdf')->storeAs('public/pdf', $pdfPath);
                $pdf_url= 'storage'. substr($pdf_url,strlen('public'));
        
                $data = json_decode($menuData->data, true);
                $data['pdf'] = asset($pdf_url);
                $menuData->data = json_encode($data);
            }
    
            $menuData->save();
            return response()->json(["message" => "Veriler başarıyla eklendi"], 201);

        }
        
        return response()->json(["message" => "Maalesef db'de alanlar bulunamadı, daha fazla bilgi için yönetici ile iletişime geçin"], 403);

    }


    public function update(Request $request, $user_id, $menuData_id)
    {

        $request->validate($rules = [
    
            'data' => 'required',

        ]);

        $menuData = MenuData::find($menuData_id);
        $menuDetails =  $menuData->menu()->get();
        
        $areFieldsInDb = $this->checkFields($request->data, $menuDetails["0"]["id"]);

        if($areFieldsInDb) {
 
            $menuData->data = json_encode(
                $this->resolveUpdateNullValues(
                    json_decode($request->data, true),
                    $menuDetails["0"]["id"], 
                    json_decode($menuData->data, true)
                )
            );
    
            if($menuData->isDirty()) {
                
                $menuData->save();
    
            }
    
    
            return response()->json(["message" => " Veriler başarıyla güncellendi"], 201);

        }
        return response()->json(["message" => "Maalesef db'de alanlar bulunamadı, daha fazla bilgi için yönetici ile iletişime geçin"], 403);
    }

    public function destroy($user_id, $menuId){

        $menuData = MenuData::find($menuId);
        return $menuId;
        if(Auth::user()->id == $menuData->added_by) {
            $menuData->delete();
            return response()->json(["message" => " Veriler başarıyla silindi"], 201);
        }else{
            
            return response()->json(["message" => " Veriler silinemedi"], 403);
        }
    }


    private function checkFields($jsonData, $menuId ) {

        $areAllFieldsInDb = true;
        $data = json_decode($jsonData, true);
        $menu = Menu::find($menuId);
        $menuItems = $menu->menuItem()->get();
        $attr = array_keys($data);
        $attr[] = "pdf";

        $menuItemsValue = [];
        foreach($menuItems as $item) {
            $menuItemsValue[] = strtolower(trim($item["name"]));
        }


        foreach($attr as $value) {
            if(!in_array( strtolower(trim($value)) ,$menuItemsValue)) {
                $areAllFieldsInDb = false;
                break;
            }
        }

        return $areAllFieldsInDb;
    }

    private function resolveNullValues($data, $menuId) {

        $menu = Menu::find($menuId);
        $menuItems = $menu->menuItem()->get();
        $menuNames = [];
        foreach ($menuItems as $item) {
            $menuNames[] = $item['name'];
        }

        for ($i=0; $i < sizeof($menuNames); $i++) { 
            //if the column is not in request data, add empty value to database
            if(!array_key_exists( trim($menuNames[$i]),$data)) {
                $data += [trim($menuNames[$i]) => ""];
            }

        }

        return $data;
    }

    private function resolveUpdateNullValues($data, $menuId, $menuData) {

        $menu = Menu::find($menuId);
        $menuItems = $menu->menuItem()->get();
        $menuNames = [];
        foreach ($menuItems as $item) {
            $menuNames[] = $item['name'];
        }

        for ($i=0; $i < sizeof($menuNames); $i++) { 
            //if the column is not in request data, add empty value to database 
            //or the previous data in the database
            if(!array_key_exists( trim($menuNames[$i]),$data)) {


                if(array_key_exists(trim($menuNames[$i]), $menuData )){
                    $data += [trim($menuNames[$i]) => $menuData[trim($menuNames[$i])]];
                }else {
                    $data += [trim($menuNames[$i]) => ""];
                }                
            }

        }

        return $data;
    }

}
