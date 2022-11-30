<?php

namespace App\Http\Controllers\SystemStatistics;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Penalty;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SystemStatiticsController extends Controller
{
    public function index() {

        $userDetails = Auth::user();
        $role = $userDetails->role;
        $secretariat = $userDetails->secretariat;
        $department = $userDetails->department;
        $unit = $userDetails->unit;

        //get new vehicles as per today
        $todayTotalVehicles =  Vehicle::whereDate('created_at', Carbon::today())->count();
        //get new penalties as per today
        $todayTotalPenalties =  Penalty::whereDate('created_at', Carbon::today())->count();
        //get new users as per today

        $Penalty = new Penalty();
        if ($role == 'ADMIN' || $role == 'USER'){
            if (!empty($secretariat) && !empty($department) && !empty($unit)){
                $totalPenalties = $Penalty->where([
                    ['boss', $secretariat],
                    ['department', $department],
                    ['unit', $unit],
                ])->count();
            } else if (!empty($secretariat) && !empty($department)){
                $totalPenalties = $Penalty->where([
                    ['boss', $secretariat],
                    ['department', $department]
                ])->count();
            }else if (!empty($secretariat)){
                $totalPenalties = $Penalty->where('boss', $secretariat)->count();
            }
        }else{
            $totalPenalties =  Penalty::count();
        }

        //get total vehicles in system
        $totalVehicles =  Vehicle::count();
        //get weekly stats
        $penalties1 = new Penalty();
        $__vehicle = new Vehicle();
        $vehicleWeeklydata = [];
        $penaltyWeeklydata = [];

        for ($i=0; $i < 7; $i++) {
            $carbon = Carbon::today()->subDays( $i+1 );
            $penaltyWeeklydata[] = [$carbon->format('l') => $penalties1->whereDate('created_at' , '=', $carbon)->count()];
            $vehicleWeeklydata[] = [$carbon->format('l') => $__vehicle->whereDate('created_at' , '=', $carbon)->count()];
        }
        //get percentage of new vehicles this month vs previous
        $vehicle = new Vehicle();
        $lastMonthVehicle = $vehicle->whereMonth(
            'created_at', '=', Carbon::now()->subMonth()->month
        )->count();
        $currentMonthVehicle = $vehicle->whereMonth(
            'created_at', '=', Carbon::now()->month
        )->count();
        //get percentage of new penalties this month vs previous
        $penalty = new Penalty();
        $lastMonthPenalties = $penalty->whereMonth(
            'created_at', '=', Carbon::now()->subMonth()->month
        )->count();
        $currentMonthPenalties = $penalty->whereMonth(
            'created_at', '=', Carbon::now()->month
        )->count();
        //get percentage of new users this month vs previous
        $user = new User();
        $lastMonthUsers = $user->whereMonth(
            'created_at', '=', Carbon::now()->subMonth()->month
        )->count();
        $currentMonthUsers = $user->whereMonth(
            'created_at', '=', Carbon::now()->month
        )->count();

        //payment report
        $___penalty = new Penalty();
        $paidPayment = $___penalty->where('status', 'Beklemende')->count();
        $pendingPayment = $___penalty->where('status', 'Odendi')->count();


        $data = [
            "todayTotalVehicles" => $todayTotalVehicles,
            "todayTotalPenalties" => $todayTotalPenalties,
            "totalPenalties" => $totalPenalties,
            "totalVehicles" => $totalVehicles,
            "vehicleWeeklydata" => $vehicleWeeklydata,
            "penaltyWeeklydata" => $penaltyWeeklydata,
            "vehicleMonthlyIncrease" => $this->getPercentage($lastMonthVehicle,$currentMonthVehicle),
            "penaltiesMonthlyIncrease" => $this->getPercentage($lastMonthPenalties,$currentMonthPenalties),
            "usersMonthlyIncrease" => $this->getPercentage($lastMonthUsers,$currentMonthUsers),
            "paidPayment" => $paidPayment,
            "pendingPayment" => $pendingPayment,
            "vehicle_unit_garage_status" => $this->getVehicleUnitGarageStatusStats(),
            "vehicle_status" => $this->getVehicleStatusStats(),
            "vehicle_type" => $this->getVehicleTypeStats(),
        ];
        return response()->json($data, 201);
    }

    public function getLicensePenalty() {

        $userDetails = Auth::user();

        $secretariat = $userDetails->secretariat;
        $department = $userDetails->department;
        $unit = $userDetails->unit;
        $role = $userDetails->role;


//        return response()->json([], 201);
        //SELECT plate_number, sum(if(payment_amount IS null or payment_amount = '', 0, payment_amount)) FROM `penalties` GROUP by plate_number
        $status = $_GET['status'];
        if($status == 'all'){
            if($role == 'ADMIN' || $role == 'USER'){
                if (!empty($secretariat) && !empty($department) && !empty($unit)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("plate_number,name, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['boss',$secretariat],
                            ['department', $department],
                            ['unit', $unit]
                        ])
                        ->groupBy('plate_number','name')
                        ->get();
                }else if (!empty($secretariat) && !empty($department)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("plate_number, name, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['boss',$secretariat],
                            ['department', $department]
                        ])
                        ->groupBy('plate_number','name')
                        ->get();
                }else if (!empty($secretariat)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("plate_number, name, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where('boss',$secretariat)
                        ->groupBy('plate_number','name')
                        ->get();
                }

            }else{
                $penalties = DB::table('penalties')
                    ->select(DB::raw("plate_number,name, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                    ->groupBy('plate_number','name')
                    ->get();
            }
        }else {
            if($role == 'ADMIN' || $role == 'USER') {
                if (!empty($secretariat) && !empty($department) && !empty($unit)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("plate_number, name, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat],
                            ['department', $department],
                            ['unit', $unit]
                        ])
                        ->groupBy('plate_number','name')
                        ->get();
                }else if (!empty($secretariat) && !empty($department)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("plate_number, name, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat],
                            ['department', $department],
                        ])
                        ->groupBy('plate_number','name')
                        ->get();
                }else if (!empty($secretariat)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("plate_number, name, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat],
                        ])
                        ->groupBy('plate_number','name')
                        ->get();
                }
            }
            else{
                $penalties = DB::table('penalties')
                    ->select(DB::raw("plate_number, name, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                    ->where('status', $status)
                    ->groupBy('plate_number','name')
                    ->get();
            }
        }

        return response()->json($penalties, 200);
    }

    public function getDirectorateFines() {
        $userDetails = Auth::user();

        $secretariat = $userDetails->secretariat;
        $department = $userDetails->department;
        $unit = $userDetails->unit;
        $role = $userDetails->role;

        $status = $_GET['status'];
        if($status == 'all'){
            if($role == 'ADMIN' || $role == 'USER') {
                if (!empty($secretariat) && !empty($department) && !empty($unit)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['boss', $secretariat],
                            ['department', $department],
                            ['unit', $unit]
                        ])
                        ->groupBy('unit')
                        ->get();
                }else if (!empty($secretariat) && !empty($department)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['boss', $secretariat],
                            ['department', $department]
                        ])
                        ->groupBy('unit')
                        ->get();
                }else if (!empty($secretariat)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['boss', $secretariat],
                        ])
                        ->groupBy('unit')
                        ->get();
                }
            }
            else{
                $penalties = DB::table('penalties')
                    ->select(DB::raw("unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                    ->groupBy('unit')
                    ->get();
            }
        }else{
            if ($role == 'ADMIN' || $role == 'USER'){
                if (!empty($secretariat) && !empty($department) && !empty($unit)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat],
                            ['department', $department],
                            ['unit', $unit]
                        ])
                        ->groupBy('unit')
                        ->get();
                }else if (!empty($secretariat) && !empty($department)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat],
                            ['department', $department]
                        ])
                        ->groupBy('unit')
                        ->get();
                }else if (!empty($secretariat)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat]
                        ])
                        ->groupBy('unit')
                        ->get();
                }
            }
            else{
                $penalties = DB::table('penalties')
                    ->select(DB::raw("unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                    ->where('status', $status)
                    ->groupBy('unit')
                    ->get();
            }
        }

        return response()->json($penalties, 200);
    }

    public function getDepartmentHeads(){

        $userDetails = Auth::user();

        $secretariat = $userDetails->secretariat;
        $department = $userDetails->department;
        $unit = $userDetails->unit;
        $role = $userDetails->role;

        $status = $_GET['status'];
        if($status == 'all'){
            if ($role == 'ADMIN' || $role == 'USER'){
                if (!empty($secretariat) && !empty($department) && !empty($unit)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("department, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['boss', $secretariat],
                            ['department', $department],
                            ['unit', $unit]
                        ])
                        ->groupBy('department')
                        ->get();
                    return $penalties;
                }else if (!empty($secretariat) && !empty($department)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("department, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['boss', $secretariat],
                            ['department', $department]
                        ])
                        ->groupBy('department')
                        ->get();
                    return $penalties;
                }else if (!empty($secretariat)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("department, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where('boss', $secretariat)
                        ->groupBy('department')
                        ->get();
                    return $penalties;
                }
            }
            else{
                $penalties = DB::table('penalties')
                    ->select(DB::raw("department, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                    ->groupBy('department')
                    ->get();
            }
        }else{
            if ($role == 'ADMIN' || $role == 'USER'){
                if (!empty($secretariat) && !empty($department) && !empty($unit)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("department, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat],
                            ['department', $department],
                            ['unit', $unit]
                        ])
                        ->groupBy('department')
                        ->get();
                }else if (!empty($secretariat) && !empty($department)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("department, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat],
                            ['department', $department]
                        ])
                        ->groupBy('department')
                        ->get();
                }else if (!empty($secretariat)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("department, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat]
                        ])
                        ->groupBy('department')
                        ->get();
                }
            }
            else{
                $penalties = DB::table('penalties')
                    ->select(DB::raw("department, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                    ->where('status', $status)
                    ->groupBy('department')
                    ->get();
            }
        }

        return response()->json($penalties, 200);
    }

    public function getGeneralSecretariats(){

        $userDetails = Auth::user();

        $secretariat = $userDetails->secretariat;
        $department = $userDetails->department;
        $unit = $userDetails->unit;
        $role = $userDetails->role;

        $status = $_GET['status'];
        if($status == 'all'){
            if ($role == 'ADMIN' || $role == 'USER'){
                if (!empty($secretariat) && !empty($department) && !empty($unit)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("boss, department, unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['boss', $secretariat],
                            ['department', $department],
                            ['unit', $unit]
                        ])
                        ->groupBy('boss', 'department', 'unit')
                        ->orderBy('boss', 'ASC')
                        ->orderBy('department', 'ASC')
                        ->orderBy('unit', 'ASC')
                        ->get()
                        ->toArray();

                    $boss_penalties = array();
                    foreach ($penalties as $penalty) {
                        $penalty = (array) $penalty;
                        $index = -1;
                        $current = null;
                        foreach ($boss_penalties as $key => $value) {
                            if ($value["boss"] == $penalty["boss"]) {
                                $index = $key;
                                $current = $value;
                                break;
                            }
                        }

                        if ($current) {
                            $current["departments"][] = $penalty;
                            $boss_penalties[$index] = $current;
                            continue;
                        }

                        $boss = array();
                        $boss["boss"] = $penalty["boss"];
                        $boss["departments"][] = $penalty;
                        $boss_penalties[] = $boss;
                    }

                    return response()->json($boss_penalties, 200);

                }else if (!empty($secretariat) && !empty($department)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("boss, department, unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['boss', $secretariat],
                            ['department', $department]
                        ])
                        ->groupBy('boss', 'department', 'unit')
                        ->orderBy('boss', 'ASC')
                        ->orderBy('department', 'ASC')
                        ->orderBy('unit', 'ASC')
                        ->get()
                        ->toArray();

                    $boss_penalties = array();
                    foreach ($penalties as $penalty) {
                        $penalty = (array) $penalty;
                        $index = -1;
                        $current = null;
                        foreach ($boss_penalties as $key => $value) {
                            if ($value["boss"] == $penalty["boss"]) {
                                $index = $key;
                                $current = $value;
                                break;
                            }
                        }

                        if ($current) {
                            $current["departments"][] = $penalty;
                            $boss_penalties[$index] = $current;
                            continue;
                        }

                        $boss = array();
                        $boss["boss"] = $penalty["boss"];
                        $boss["departments"][] = $penalty;
                        $boss_penalties[] = $boss;
                    }

                    return response()->json($boss_penalties, 200);


                }else if (!empty($secretariat)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("boss, department, unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['boss', $secretariat]
                        ])
                        ->groupBy('boss', 'department', 'unit')
                        ->orderBy('boss', 'ASC')
                        ->orderBy('department', 'ASC')
                        ->orderBy('unit', 'ASC')
                        ->get()
                        ->toArray();

                    $boss_penalties = array();
                    foreach ($penalties as $penalty) {
                        $penalty = (array) $penalty;
                        $index = -1;
                        $current = null;
                        foreach ($boss_penalties as $key => $value) {
                            if ($value["boss"] == $penalty["boss"]) {
                                $index = $key;
                                $current = $value;
                                break;
                            }
                        }

                        if ($current) {
                            $current["departments"][] = $penalty;
                            $boss_penalties[$index] = $current;
                            continue;
                        }

                        $boss = array();
                        $boss["boss"] = $penalty["boss"];
                        $boss["departments"][] = $penalty;
                        $boss_penalties[] = $boss;
                    }

                    return response()->json($boss_penalties, 200);

                }
            }
            else{
                $penalties = DB::table('penalties')
                    ->select(DB::raw("id, boss, department, unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                    ->groupBy('boss', 'department', 'unit')
                    ->orderBy('boss', 'ASC')
                    ->orderBy('department', 'ASC')
                    ->orderBy('unit', 'ASC')
                    ->get()
                    ->toArray();

//                return response()->json($penalties, 200);

                $boss_penalties = array();
                foreach ($penalties as $penalty) {
                    $penalty = (array) $penalty;
                    $index = -1;
                    $current = null;
                    foreach ($boss_penalties as $key => $value) {
                        if ($value["boss"] == $penalty["boss"]) {
                            $index = $key;
                            $current = $value;
                            break;
                        }
                    }

                    if ($current) {
                        $current["departments"][] = $penalty;
                        $boss_penalties[$index] = $current;
                        continue;
                    }

                    $boss = array();
                    $boss["boss"] = $penalty["boss"];
                    $boss["departments"][] = $penalty;
                    $boss_penalties[] = $boss;
                }

                return response()->json($boss_penalties, 200);
            }
        }else{
            if ($role == 'ADMIN' || $role == 'USER'){
                if (!empty($secretariat) && !empty($department) && !empty($unit)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("id, boss, department, unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat],
                            ['department', $department],
                            ['unit', $unit]
                        ])
                        ->groupBy('boss', 'department', 'unit')
                        ->orderBy('boss', 'ASC')
                        ->orderBy('department', 'ASC')
                        ->orderBy('unit', 'ASC')
                        ->get()
                        ->toArray();

                    $boss_penalties = array();
                    foreach ($penalties as $penalty) {
                        $penalty = (array) $penalty;
                        $index = -1;
                        $current = null;
                        foreach ($boss_penalties as $key => $value) {
                            if ($value["boss"] == $penalty["boss"]) {
                                $index = $key;
                                $current = $value;
                                break;
                            }
                        }

                        if ($current) {
                            $current["departments"][] = $penalty;
                            $boss_penalties[$index] = $current;
                            continue;
                        }

                        $boss = array();
                        $boss["boss"] = $penalty["boss"];
                        $boss["departments"][] = $penalty;
                        $boss_penalties[] = $boss;
                    }

                    return response()->json($boss_penalties, 200);

                }else if(!empty($secretariat) && !empty($department)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("id, boss, department, unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat],
                            ['department', $department]
                        ])
                        ->groupBy('boss', 'department', 'unit')
                        ->orderBy('boss', 'ASC')
                        ->orderBy('department', 'ASC')
                        ->orderBy('unit', 'ASC')
                        ->get()
                        ->toArray();

                    $boss_penalties = array();
                    foreach ($penalties as $penalty) {
                        $penalty = (array) $penalty;
                        $index = -1;
                        $current = null;
                        foreach ($boss_penalties as $key => $value) {
                            if ($value["boss"] == $penalty["boss"]) {
                                $index = $key;
                                $current = $value;
                                break;
                            }
                        }

                        if ($current) {
                            $current["departments"][] = $penalty;
                            $boss_penalties[$index] = $current;
                            continue;
                        }

                        $boss = array();
                        $boss["boss"] = $penalty["boss"];
                        $boss["departments"][] = $penalty;
                        $boss_penalties[] = $boss;
                    }

                    return response()->json($boss_penalties, 200);


                }else if(!empty($secretariat)){
                    $penalties = DB::table('penalties')
                        ->select(DB::raw("id, boss, department, unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                        ->where([
                            ['status', $status],
                            ['boss', $secretariat]
                        ])
                        ->groupBy('boss', 'department', 'unit')
                        ->orderBy('boss', 'ASC')
                        ->orderBy('department', 'ASC')
                        ->orderBy('unit', 'ASC')
                        ->get()
                        ->toArray();

                    $boss_penalties = array();
                    foreach ($penalties as $penalty) {
                        $penalty = (array) $penalty;
                        $index = -1;
                        $current = null;
                        foreach ($boss_penalties as $key => $value) {
                            if ($value["boss"] == $penalty["boss"]) {
                                $index = $key;
                                $current = $value;
                                break;
                            }
                        }

                        if ($current) {
                            $current["departments"][] = $penalty;
                            $boss_penalties[$index] = $current;
                            continue;
                        }

                        $boss = array();
                        $boss["boss"] = $penalty["boss"];
                        $boss["departments"][] = $penalty;
                        $boss_penalties[] = $boss;
                    }

                    return response()->json($boss_penalties, 200);
                }
            }
            else{
                $penalties = DB::table('penalties')
                    ->select(DB::raw("id, boss, department, unit, count(*) total_count, sum(if(penalty IS null or penalty = '', 0, penalty)) amount"))
                    ->where('status', $status)
                    ->groupBy('boss', 'department', 'unit')
                    ->orderBy('boss', 'ASC')
                    ->orderBy('department', 'ASC')
                    ->orderBy('unit', 'ASC')
                    ->get()
                    ->toArray();

                $boss_penalties = array();
                foreach ($penalties as $penalty) {
                    $penalty = (array) $penalty;
                    $index = -1;
                    $current = null;
                    foreach ($boss_penalties as $key => $value) {
                        if ($value["boss"] == $penalty["boss"]) {
                            $index = $key;
                            $current = $value;
                            break;
                        }
                    }

                    if ($current) {
                        $current["departments"][] = $penalty;
                        $boss_penalties[$index] = $current;
                        continue;
                    }

                    $boss = array();
                    $boss["boss"] = $penalty["boss"];
                    $boss["departments"][] = $penalty;
                    $boss_penalties[] = $boss;
                }

                return response()->json($boss_penalties, 200);
            }
        }

//        return response()->json($penalties, 200);
    }

    private function getPercentage($oldValue, $newValue) {

        if($oldValue != 0) {
            //avoid divisibility error by 0
            return (($newValue - $oldValue)/$oldValue) * 100;
        }
        return 0;
    }

    private function getVehicleUnitGarageStatusStats() {
        // unit_garage_status

        $data = [
            "İstaç A.Ş","İgdaş A.Ş","Avrupa yakası Zabıta","Avrupa yakası Mezarlıklar",
            "Makine ikmal","Destek Hizmetleri","İsbak A.Ş","Anadolu yakası Zabıta",
            "Anadolu yakası Mezarlıklar","Ağaç A.Ş","İsfalt A.Ş",
        ];


        $stats = [];

        foreach($data as $data_type) {

            $vehicle = new Vehicle();
            $stats[$data_type] = $vehicle->where('unit_garage_status', $data_type)->count();

        }
        return $stats;


    }
    private function getVehicleStatusStats() {
        // unit_garage_status

        $data = [
            "zimmetli degil","bakimda","zimmetli","Serviste",
        ];


        $stats = [];

        foreach($data as $data_type) {

            $vehicle = new Vehicle();
            $stats[$data_type] = $vehicle->where('vehicle_status', $data_type)->count();

        }
        return $stats;


    }
    private function getVehicleTypeStats() {
        // unit_garage_status

        $data = [
            "kiralik","resmi","ihale yolu","Protokol",
            "yedek",
        ];


        $stats = [];

        foreach($data as $data_type) {

            $vehicle = new Vehicle();
            $stats[$data_type] = $vehicle->where('vehicle_type', $data_type)->count();

        }
        return $stats;


    }
}
