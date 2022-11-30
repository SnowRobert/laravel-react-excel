<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PdfFiles;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class UserPdfFileController extends Controller
{

    public function store(Request $request, $user_id) {

        $request->validate($rules = [
            'files' => 'required|distinct:strict|array|min:1|max:20000',
            'files.*' => 'max:10000000|mimes:pdf',
        ]);



        if($request->hasFile('files')) {

            foreach($request->File('files') as $file) {

                $pdfFile = new PdfFiles();

                $user = Auth::user();
                $pdfFile->added_by =$user->id;
                $pdfFile->addedBy()->associate($pdfFile->added_by);
                $extension = $file->getClientOriginalExtension();
                $pdfPath = $file->getClientOriginalName();
                $pdf_url = $file->storeAs('public/all_pdfs', $pdfPath);
                $pdf_url= 'storage'. substr($pdf_url,strlen('public'));

                $pdfFile->file_url = asset($pdf_url);

                $pdf1 = new PdfFiles();
                if(!(sizeof($pdf1->where('file_url', '=', $pdfFile->file_url)->get()) > 0)) {
                    //no other file has same name
                    $pdfFile->save();
                }

            }
        }

        return response()->json(["message" => "PDF Dosyası Başarıyla Yüklendi"], 201);


    }


    public function destroy($user_id, $pdfFile_id){

        $pdfFile = PdfFiles::find($pdfFile_id);
        if(Auth::user()->id == $pdfFile->added_by) {
            $pdfFile->delete();
            return response()->json(["message" => "Dosya başarıyla silindi"], 201);
        }else{

            return response()->json(["message" => " Dosya silinemedi"], 403);
        }
    }
}
