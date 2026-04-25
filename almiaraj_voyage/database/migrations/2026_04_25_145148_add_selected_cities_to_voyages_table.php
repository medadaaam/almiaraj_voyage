<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('voyages', function (Blueprint $table) {
<<<<<<< HEAD:almiaraj_voyage/database/migrations/2026_04_22_114237_add_destination_id_to_voyages.php
            $table->foreignId('destination_id')->constrained('destinations')->onDelete('cascade');
=======
            $table->json('selected_cities')->nullable()->after('destination_id');
>>>>>>> c6840e06f0ea336640e2e35bfccde823661c4382:almiaraj_voyage/database/migrations/2026_04_25_145148_add_selected_cities_to_voyages_table.php
        });
    }

    public function down(): void
    {
        Schema::table('voyages', function (Blueprint $table) {
            $table->dropColumn('selected_cities');
        });
    }
};