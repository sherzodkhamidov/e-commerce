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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subcatalog_id')->constrained()->cascadeOnDelete();
            $table->string('name_uz');
            $table->string('name_ru');
            $table->string('name_eng');
            $table->string('slug')->unique();
            $table->text('description_uz')->nullable();
            $table->text('description_ru')->nullable();
            $table->text('description_eng')->nullable();
            $table->text('short_description_uz')->nullable();
            $table->text('short_description_ru')->nullable();
            $table->text('short_description_eng')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('old_price', 10, 2)->nullable();
            $table->string('sku')->unique()->nullable();
            $table->integer('stock')->default(0);
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
