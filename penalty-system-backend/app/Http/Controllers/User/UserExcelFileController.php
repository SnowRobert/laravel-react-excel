<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Imports\PenaltyImports;
use App\Models\Penalty;
use Illuminate\Http\Request;
use App\Models\ExcelFile;
use App\Models\PdfFiles;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class UserExcelFileController extends Controller
{

    public function store(Request $request, $user_id) {

        $request->validate($rules = [

            'page_type' => 'required',
            'files' => 'required|distinct:strict|array|min:1|max:8',
            'files.*' => 'max:10000000|mimes:xlsx,xls',
        ]);



        if($request->hasFile('files')) {

            foreach($request->File('files') as $file) {

                $excelFile = new ExcelFile();
                $excelFile->page_type =$request->page_type;

                $user = Auth::user();
                $excelFile->added_by =$user->id;
                $excelFile->addedBy()->associate($excelFile->added_by);
                $extension = $file->getClientOriginalExtension();
                $excelPath = md5(uniqid()).'.'.$extension;
                $excel_url = $file->storeAs('public/excel', $excelPath);
                $excel_url= 'storage'. substr($excel_url,strlen('public'));

                $excelFile->file_url = asset($excel_url);
                $excelFile->save();

                $array = Excel::toArray(new PenaltyImports, $file);
                $array = $array[0];
                $penalties = [];

                for ($i = 2; $i < count($array);$i++) {

                    $penaltyDate = '';
                    $paymentDate = '';
                    $notiDate = '';
                    $registerDate = '';
                    $arrivalDate = '';
                    $decisionDate = '';
                    $penaltyHour = '';

                    try {
                        $penaltyHour = $array[$i][4] ? gmdate("H:i", ($array[$i][4] - 25569) * 86400) : '';
                        $penaltyDate = $array[$i][3]
                            ? date("d.m.Y", Date::excelToDateTimeObject(intval($array[$i][3]))->getTimestamp())
                            : '';
                        $paymentDate = $array[$i][27]
                            ? date("d.m.Y", Date::excelToDateTimeObject(intval($array[$i][27]))->getTimestamp())
                            : '';
                        $notiDate = $array[$i][5]
                            ? date("d.m.Y", Date::excelToDateTimeObject(intval($array[$i][5]))->getTimestamp())
                            : '';
                        $registerDate = $array[$i][9]
                            ? date("d.m.Y", Date::excelToDateTimeObject(intval($array[$i][9]))->getTimestamp())
                            : '';
                        $arrivalDate = $array[$i][12]
                            ? date("d.m.Y", Date::excelToDateTimeObject(intval($array[$i][12]))->getTimestamp())
                            : '';
                        $decisionDate = $array[$i][23]
                            ? date("d.m.Y", Date::excelToDateTimeObject(intval($array[$i][23]))->getTimestamp())
                            : '';
                    } catch (\Exception $e) {
                        file_put_contents('err.txt', print_r($e->getMessage(), 1));
                    }

                    $pdfUrl = "";
                    $pdf = PdfFiles::where('file_url', 'like', '%'.$array[$i][2].'.pdf')->first();
                    if ($pdf) {
                        $pdfUrl = $pdf->file_url;
                    }

                    $penalty = [
                        'plate_number' => $array[$i][1] ? $array[$i][1] : '',
                        'receipt_number'  => $array[$i][2] ? $array[$i][2] : '',
                        'penalty_date'  => $penaltyDate,
                        'payment_date'  => $paymentDate,
                        'status'  => $array[$i][25] ? $array[$i][25] : 'BEKLEMEDE',
                        'notification_date'  => $notiDate,
                        'penalty_hour'  => $penaltyHour,
                        'penalty_article'  => $array[$i][6] ? $array[$i][6] : '',
                        'penalty'  => $array[$i][7] ? $array[$i][7] : '',
                        'paying'  => $array[$i][28] ? $array[$i][28] : '',
                        'cancelation_status'  => $array[$i][22] ? $array[$i][22] : '',
                        'unit'  => $array[$i][17] ? $array[$i][17] : '',
                        'company'  => $array[$i][14] ? $array[$i][14] : '',
                        'request_no'  => $array[$i][10] ? $array[$i][10] : '',
                        'unit_no'  => $array[$i][11] ? $array[$i][11] : '',
                        'imm_no'  => $array[$i][11] ? $array[$i][11] : '',
                        'pdf_url'  => $pdfUrl,
                        'added_by'  => Auth::user()->id,
                        'name'  => $array[$i][19] ? $array[$i][19] : '',
                        'boss'  => $array[$i][15] ? $array[$i][15] : '',
                        'department'  => $array[$i][16] ? $array[$i][16] : '',
                        'sub_depart'  => $array[$i][18] ? $array[$i][18] : '',
                        'registration_date'  => $registerDate,
                        'arrival_date'  => $arrivalDate,
                        'decision_date'  => $decisionDate,
                        'payment_amount'  => $array[$i][8] ? $array[$i][8] : '',
                        'image_url'  => "",
                    ];
                    array_push($penalties, $penalty);
                }
                try {
                    foreach (array_chunk($penalties,500) as $t)
                    {
                        DB::table('penalties')->insert($t);
                    }
                } catch (\Exception $e) {
                    file_put_contents('err2.txt', print_r($e->getMessage(), 1));
                    return $e->getMessage();
                }
            }
        }
        return response()->json(["message" => " Excel Dosyası Başarıyla Yüklendi"], 201);


    }


    public function destroy($user_id, $excelFile_id){

        $excelFile = ExcelFile::find($excelFile_id);
        if(Auth::user()->id == $excelFile->added_by) {
            $excelFile->delete();
            return response()->json(["message" => "Dosya başarıyla silindi"], 201);
        }else{
            return response()->json(["message" => " Dosya silinemedi"], 403);
        }
    }

}
