<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Order totals
            $table->decimal('subtotal', 12, 2);
            $table->decimal('shipping_cost', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('total', 12, 2);

            // Status: pending, confirmed, processing, shipped, delivered, cancelled
            $table->enum('status', [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled'
            ])->default('pending');

            // Payment
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->string('payment_method')->nullable(); // payme, click, cash
            $table->string('payment_transaction_id')->nullable();
            $table->timestamp('paid_at')->nullable();

            // Shipping info
            $table->string('shipping_name');
            $table->string('shipping_phone');
            $table->text('shipping_address');
            $table->string('shipping_city');
            $table->string('shipping_region')->nullable();
            $table->string('shipping_postal_code')->nullable();

            // Additional
            $table->text('notes')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

