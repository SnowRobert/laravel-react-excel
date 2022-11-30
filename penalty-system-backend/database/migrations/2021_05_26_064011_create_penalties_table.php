<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePenaltiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('penalties', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('plate_number', 350);
            $table->string('receipt_number', 350)->default('');
            $table->string('penalty_date', 350)->default('');
            $table->string('penalty_hour', 350)->default('');
            $table->string('notification_date', 350)->default('');
            $table->string('penalty', 350)->default('');
            $table->string('payment_amount', 350)->default('');
            $table->string('penalty_article', 350)->default('');
            $table->string('unit', 350)->default('');
            $table->string('name', 350)->default('');
            $table->string('registration_date', 350)->default('');
            $table->string('arrival_date', 350)->default('');
            $table->string('imm_no', 350)->default('');
            $table->string('boss', 350)->default('');
            $table->string('department', 350)->default('');
            $table->string('sub_depart', 350)->default('');
            $table->string('request_no', 350)->default('');
            $table->string('unit_no', 350)->default('');
            $table->string('company', 350)->default('');
            $table->string('cancelation_status', 350)->default('');
            $table->string('decision_date', 350)->default('');
            $table->string('status', 350)->default('');
            $table->string('payment_date', 350);
            $table->string('paying', 350)->default('');
            $table->string('note', 350)->default('');
            $table->string('pdf_url', 350)->default('');
            $table->string('image_url', 1000)->default('');
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
        Schema::dropIfExists('penalties');
    }
}
