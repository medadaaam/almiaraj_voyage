<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('services_type_enum', function (Blueprint $table) {
            DB::statement("ALTER TABLE services MODIFY COLUMN type ENUM('voyage', 'hotel', 'hajj_omra', 'billet') NOT NULL");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services_type_enum', function (Blueprint $table) {
            DB::statement("ALTER TABLE services MODIFY COLUMN type ENUM('voyage', 'hotel', 'hajj_omra') NOT NULL");
        });
    }
};
