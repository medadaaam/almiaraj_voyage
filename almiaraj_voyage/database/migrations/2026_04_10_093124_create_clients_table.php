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
        Schema::create('clients', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('cin', 10)->nullable();
            $table->string('passport', 50)->nullable();
            $table->string('natCl', 50)->default('maroc');
            $table->date('dateInscription');
            $table->string('nomCl', 30);
            $table->string('prenomCl', 30);
            $table->string('numTelCl', 20);
            $table->string('email', 100)->unique();
            $table->foreignId('user_id')
                ->constrained('users')
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
        Schema::dropIfExists('clients');
    }
};
