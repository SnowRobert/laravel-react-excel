<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Penalty;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class UserPenaltyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($user_id)
    {
        $user = Auth::user();


        $user = $user->myPenalty();
        if(request()->has('sort_by')) {
            $user = $user->orderBy(request()->sort_by, 'DESC');
        }

        $perPage = (request()->has('per_page'))?request()->per_page:env('PER_PAGE');
        return response()->json($user->paginate($perPage));
    }

    public function store(Request $request, $user_id)
    {
        $request->validate($rules = [

            'plate_number' => 'required',
            'pdf' => 'mimes:pdf|max:500048',

        ]);
        $penalty = new Penalty();
        $penalty->receipt_number = $request->has('receipt_number')?$request->receipt_number:"";
        $penalty->penalty_date = $request->has('penalty_date')?$request->penalty_date:"";
        $penalty->payment_date = $request->has('payment_date')?$request->payment_date:"";
        $penalty->status = $request->has('status')?$request->status:"";
        $penalty->notification_date = $request->has('notification_date')?$request->notification_date:"";
        $penalty->penalty_hour = $request->has('penalty_hour')?$request->penalty_hour:"";
        $penalty->penalty_article = $request->has('penalty_article')?$request->penalty_article:"";
        $penalty->penalty = $request->has('penalty')?$request->penalty:"";
        $penalty->paying = $request->has('paying')?$request->paying:"";
        $penalty->cancelation_status = $request->has('cancelation_status')?$request->cancelation_status:"";
        $penalty->unit = $request->has('unit')?$request->unit:"";
        $penalty->note = $request->has('note')?$request->note:"";
        $penalty->company = $request->has('company')?$request->company:"";
        $penalty->request_no = $request->has('request_no')?$request->request_no:"";
        $penalty->unit_no = $request->has('unit_no')?$request->unit_no:"";
        $penalty->imm_no = $request->has('imm_no')?$request->imm_no:"";
        $penalty->name = $request->has('name')?$request->name:"";
        $penalty->registration_date = $request->has('registration_date')?$request->registration_date:"";
        $penalty->arrival_date = $request->has('arrival_date')?$request->arrival_date:"";
        $penalty->decision_date = $request->has('decision_date')?$request->decision_date:"";
        $penalty->payment_amount = $request->has('payment_amount')?$request->payment_amount:"";
        $penalty->boss = $request->has('boss')?$request->boss:"";
        $penalty->department = $request->has('department')?$request->department:"";
        $penalty->sub_depart = $request->has('sub_depart')?$request->sub_depart:"";
        $penalty->imm_no = $request->has('imm_no')?$request->imm_no:"";
        $pdf_url = $request->has('equipment')?$request->equipment:"";
        $penalty->image_url = "";

        $penalty->plate_number = $request->plate_number;

        $user = Auth::user();
        $penalty->added_by = $user->id;
        $penalty->addedBy()->associate($penalty->added_by);

        $penalty->pdf_url = '';
        if($request->hasFile('pdf')) {
            $extension = $request->File('pdf')->getClientOriginalExtension();
            $pdfPath = md5(uniqid()). $request->vehicle_id.'.'.$extension;
            $pdf_url = $request->File('pdf')->storeAs('public/pdf', $pdfPath);
            $pdf_url= 'storage'. substr($pdf_url,strlen('public'));

            $penalty->pdf_url = asset($pdf_url);
        }

        $penalty->save();

        return response()->json(["message" => " Penaltı başarıyla eklendi"], 201);
    }

    public function update(Request $request,$user_id,  $penalty_id)
    {
        $request->validate($rules = [

            'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:100048',

        ]);

        $penalty = Penalty::find($penalty_id);
        if($request->has('plate_number')) {
            $penalty->plate_number = $request->plate_number;
        }
        if($request->has('receipt_number')) {
            $penalty->receipt_number = $request->receipt_number;
        }
        if($request->has('penalty_date')) {
            $penalty->penalty_date = $request->penalty_date;
        }if($request->has('payment_date')) {
            $penalty->payment_date = $request->payment_date;
        }if($request->has('status')) {
            $penalty->status = $request->status;
        }if($request->has('notification_date')) {
            $penalty->notification_date = $request->notification_date;
        }if($request->has('penalty_hour')) {
            $penalty->penalty_hour = $request->penalty_hour;
        }if($request->has('penalty_article')) {
            $penalty->penalty_article = $request->penalty_article;
        }if($request->has('penalty')) {
            $penalty->penalty = $request->penalty;
        }if($request->has('paying')) {
            $penalty->paying = $request->paying;
        }if($request->has('cancelation_status')) {
            $penalty->cancelation_status = $request->cancelation_status;
        }if($request->has('unit')) {
            $penalty->unit = $request->unit;
        }if($request->has('note')) {
            $penalty->note = $request->note;
        }if($request->has('company')) {
            $penalty->company = $request->company;
        }if($request->has('request_no')) {
            $penalty->request_no = $request->request_no;
        }
        if($request->has('unit_no')) {
            $penalty->unit_no = $request->unit_no;
        }if($request->has('imm_no')) {
            $penalty->imm_no = $request->imm_no;
        }if($request->has('name')) {
            $penalty->name = $request->name;
        }if($request->has('registration_date')) {
            $penalty->registration_date = $request->registration_date;
        }if($request->has('arrival_date')) {
            $penalty->arrival_date = $request->arrival_date;
        }
        if($request->has('decision_date')) {
            $penalty->decision_date = $request->decision_date;
        }
        if($request->has('payment_amount')) {
            $penalty->payment_amount = $request->payment_amount;
        }
        if($request->has('boss')) {
            $penalty->boss = $request->boss;
        }
        if($request->has('department')) {
            $penalty->department = $request->department;
        }
        if($request->has('sub_depart')) {
            $penalty->sub_depart = $request->sub_depart;
        }
        if($request->has('pdf_url')) {
            $penalty->pdf_url = $request->pdf_url;
        }

        $penalty->added_by = $penalty->added_by;
        if($request->hasFile('image')) {

            $extension = $request->File('image')->getClientOriginalExtension();
            $imagePath = md5(uniqid()). '.'.$extension;
            $image_url = $request->File('image')->storeAs('public/penalty_images', $imagePath);
            $image_url= 'storage'. substr($image_url,strlen('public'));
            $penalty->image_url = asset($image_url);
        }


        if($penalty->isDirty()) {

            $penalty->save();

        }

        return response()->json(["message" => " Ceza başarıyla güncellendi"], 201);
    }

    public function destroy(Request $request)
    {
        $ids = $request->get('ids');
        $ids = explode(',', $ids);
        foreach($ids as $id) {
            $penalty = Penalty::find($id);
            if ($penalty && Auth::user()->id == $penalty->added_by) {
                $penalty->delete();
            }
        }

        return response()->json(["message" => " Penaltı başarıyla silindi"], 201);
    }
    public function delete(Request $request){
        $id = $request->penalty_id;
        $penalty = Penalty::where("id", $id)->delete();
        return response()->json(["message" => " Penaltı başarıyla silindi"], 201);
    }
}
