<?php

namespace App\Exports;

use App\Models\Penalty;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;

class PenaltyExports implements ToModel
{
    /**
     * @param array $row
     *
     * @return Penalty[]|\Illuminate\Database\Eloquent\Collection
     */
    public function model(array $row)
    {
        return Penalty::all();
    }
}
