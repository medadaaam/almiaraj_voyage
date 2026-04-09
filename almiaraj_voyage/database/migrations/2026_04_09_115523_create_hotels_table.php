<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::create('hotels', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('villeHotel',50);
            $table->date('checkIn');
            $table->date('checkOut');
            $table->string('typeChambre',50);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
