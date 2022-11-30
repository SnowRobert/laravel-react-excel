<?php

namespace App\Http\Controllers\Penalty;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penalty;
use App\traits\Utils;
use Illuminate\Support\Facades\Auth;

class SearchPenaltyController extends Controller
{
    use Utils;


    public function index(Request $request) {

        $request->validate($rules = [

            'value' => 'required',

        ]);

        $userDetials = Auth::user();

        $role = $userDetials->role;
        $secretariat = $userDetials->secretariat;
        $department = $userDetials->department;
        $unit = $userDetials->unit;

        $penalty = new Penalty();
        $columns = $this->getTableColumns($penalty->getTableName());

        if (request()->has('pay_status') && request()->pay_status !== "all") {
            switch (request()->pay_status) {
                case "payed":
                    $penalty = $penalty->where('status', "ÖDENDİ");
                    break;
                case "pending":
                    $penalty = $penalty->where('status', "BEKLEMEDE");
                    break;
                case "canceled":
                    $penalty = $penalty->where('status', "İPTAL EDİLDİ");
                    break;
                default:
                    break;
            }
        }

        if ($role == 'ADMIN' || $role == 'USER'){
            if (!empty($secretariat) && !empty($department) && !empty($unit)){
                $penalty = $penalty->where([
                    ['boss', $secretariat],
                    ['department', $department],
                    ['unit', $unit],
                ]);
            } else if (!empty($secretariat) && !empty($department)){
                $penalty = $penalty->where([
                    ['boss', $secretariat],
                    ['department', $department]
                ]);
            }else if (!empty($secretariat)){
                $penalty = $penalty->where('boss', $secretariat);
            }
        }

        $counter = 0;

        $penalty = $penalty->where(function($q) use($columns, $counter, $request) {
            foreach($columns as $name) {
                if($counter == 0) {
                    $q = $q->where($name, '=', $request->value);
                }else {
                    $q = $q->orWhere($name, '=', $request->value);
                }
                $counter ++;
            }
        });

        if(request()->has('sort_by')) {
            $penalty = $penalty->orderBy(request()->sort_by, 'DESC');
        }

        $perPage = (request()->has('per_page'))?request()->per_page:env('PER_PAGE');
        if ($perPage == 'All') {
            return response()->json(['data' => $penalty->get()], 201);
        }
        return response()->json($penalty->paginate($perPage), 201);

    }
}
