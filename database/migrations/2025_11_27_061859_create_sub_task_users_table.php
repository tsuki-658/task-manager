<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sub_task_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sub_task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('file')->nullable();
            $table->enum('status', ['submitted', 'pending', 'missing'])->default('pending');
            $table->dateTime('turned_in_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sub_task_users');
    }
};
