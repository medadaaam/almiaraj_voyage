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
            $table->integer('nbPers');
            $table->date('dateRes');
            $table->string('statusRes');
            $table->date('dateAnnulation')->nullable();
            $table->boolean('voucherGenere')->default(false);
            $table->foreignId('service_id')
                ->constrained('services')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('client_id')
                ->constrained('clients')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
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
