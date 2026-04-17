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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_id');
            $table->unsignedBigInteger('client_id');
            $table->integer('nbPers');
            $table->date('dateRes');
            $table->string('statusRes');
            $table->date('checkIn')->nullable();
            $table->date('checkOut')->nullable();
            $table->string('typeChambre')->nullable();
            $table->date('dateAnnulation')->nullable();
            $table->boolean('voucherGenere')->default(false);
            $table->foreign('service_id')->references('id')->on('services')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('client_id')->references('id')->on('clients')->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
