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
        Schema::table('users', function (Blueprint $table) {
            $table->string('company_name')->nullable();
            $table->string('company_website')->nullable();
            $table->text('company_description')->nullable();
            $table->string('company_document')->nullable();
            $table->string('employer_status')->default('pending'); // pending, approved, rejected
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'company_name',
                'company_website',
                'company_description',
                'company_document',
                'employer_status'
            ]);
        });
    }
};
