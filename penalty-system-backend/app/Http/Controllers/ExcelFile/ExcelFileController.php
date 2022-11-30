<?php

namespace App\Http\Controllers\ExcelFile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ExcelFile;
use Illuminate\Support\Facades\Storage;

class ExcelFileController extends Controller
{
    public function index(Request $request) {

        $request->validate($rules = [
            
            'page_type' => 'required',
        ]);

        
        $excelFile = new ExcelFile();
        if($request->has('sort_by')) {
            $excelFile = $excelFile->orderBy($request->sort_by, 'DESC');
        }
        
        $perPage = ($request->has('per_page'))?$request->per_page:env('PER_PAGE');
        return response()->json(
            $excelFile->where("page_type", '=', $request->page_type)
            ->paginate($perPage), 
        201);

    }

    
    public function show($excel_id) {

        $file = ExcelFile::find($excel_id);
        
        $file_name = basename($file->file_url);
         echo file_get_contents($file->file_url);
        return "true";
        if(file_put_contents( $file_name,file_get_contents($file->file_url))) {
            return response()->json(["message" => "dosya başarıyla indirildi"], 200);
        }else {
            return response()->json(["message" => "dosya indirilemedi"], 401);
        }
        
    }

    
}
