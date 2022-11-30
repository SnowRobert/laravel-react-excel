<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehiclesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicles', function (Blueprint $table) {
            
            $table->bigIncrements('id');
            $table->string('plate_number', 150)->unique();
            $table->string('vehicle_group', 300);
            $table->string('brand_model', 150);
            $table->string('chassis_number', 150);
            $table->string('motor_number', 150);
            $table->string('model_year', 150);
            $table->string('color', 150);
            $table->string('file_number', 150);
            $table->string('tag', 150);
            $table->string('unit_garage_status', 150);
            $table->string('vehicle_status', 150);
            $table->string('vehicle_type', 150);
            $table->string('delivery_date', 150);
            $table->string('asset_number', 250);
            $table->string('equipment', 250);
            $table->unsignedBigInteger('added_by');
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->foreign('added_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehicles');
    }
}
