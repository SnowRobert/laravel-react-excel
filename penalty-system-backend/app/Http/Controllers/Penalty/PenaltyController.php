<?php

namespace App\Http\Controllers\Penalty;

use App\Http\Controllers\Controller;
use http\Env\Response;
use Illuminate\Http\Request;
use App\Models\Penalty;
use Illuminate\Support\Facades\Auth;

class PenaltyController extends Controller
{
    public function index()
    {
        $userDetails = Auth::user();

        $role = $userDetails->role;
        $secretariat =  $userDetails->secretariat;
        $department = $userDetails->department;
        $unit = $userDetails->unit;

        $penalty = new Penalty();
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

        if(request()->has('sort_by')) {
            $penalty->orderBy(request()->sort_by, 'DESC');
        }else{
            $penalty->orderBy('id','desc');
        }

        $perPage = (request()->has('per_page'))?request()->per_page:env('PER_PAGE');
        if ($perPage == 'All') {
            return response()->json(['data' => $penalty->get()]);
        }
        return response()->json($penalty->paginate($perPage));
    }

}
