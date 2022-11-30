<?php


    namespace App\traits;
    use Illuminate\Support\Facades\Schema;

    trait Utils {

        public function getTableColumns($table) {

            return Schema::getColumnListing($table);
        }

    }

?> 