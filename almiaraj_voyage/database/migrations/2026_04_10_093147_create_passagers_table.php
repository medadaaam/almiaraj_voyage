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
        Schema::create('passagers', function (Blueprint $table) {
            $table->id();
            $table->string('nomPas', 50);
            $table->string('prenomPas', 50);
            $table->string('cinPas', 50)->nullable();
            $table->string('passportPas', 50)->nullable();
            $table->foreignId('reservation_id')
                ->constrained('reservations')
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
        Schema::dropIfExists('passagers');
    }
};
