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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->string('nomM', 50);
            $table->string('numTelM', 20);
            $table->string('emailM', 150)->unique();
            $table->text('contenu');
            $table->date('dateM');
            $table->string('statusM', 50);
            $table->foreignId('client_id')
                ->nullable()
                ->constrained('clients')
                ->nullOnDelete()
                ->cascadeOnDelete()
                ->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
