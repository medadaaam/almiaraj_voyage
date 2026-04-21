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
        Schema::create('billets', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('villeDepartBi');
            $table->string('destinationBi');
            $table->date('dateDepartBi');
            $table->date('dateRetourBi')->nullable();
            // $table->string('bagage');
            $table->foreign('id')->references('id')->on('services')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billets');
    }
};
