<?php

namespace App\Http\Controllers\pdf;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PdfFiles;
use Illuminate\Support\Facades\Storage;

class PDFController extends Controller
{
    
    public function index(Request $request) {

        
        $pdfFiles = new PdfFiles();
        if($request->has('sort_by')) {
            $pdfFiles = $pdfFiles->orderBy($request->sort_by, 'DESC');
        }
        
        $perPage = ($request->has('per_page'))?$request->per_page:env('PER_PAGE');

        return response()->json(
            $pdfFiles->paginate($perPage),
        201);

    }


    public function search(Request $request) {

        $request->validate($rules = [
    
            'file_name' => 'required|max:350',

        ]);
        
        $pdfFiles = new PdfFiles();
        if($request->has('sort_by')) {
            $pdfFiles = $pdfFiles->orderBy($request->sort_by, 'DESC');
        }
        
        $perPage = ($request->has('per_page'))?$request->per_page:env('PER_PAGE');
        
        //removing api at the end
        return response()->json(
            $pdfFiles->where("file_url", 'like', '%'.$request->file_name.'%')
            ->paginate($perPage), 
        201);

    }


}
