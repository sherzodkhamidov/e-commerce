<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()
            ->orders()
            ->with(['items.product'])
            ->latest()
            ->paginate(config('ecommerce.pagination.orders_per_page'));

        return response()->json($orders);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        // Ensure order belongs to user
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->load(['items.product.subcatalog.catalog']);

        return response()->json($order);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'location_lat' => 'nullable|numeric|between:-90,90',
            'location_lng' => 'nullable|numeric|between:-180,180',
            'payment_method' => 'required|in:payme,cash',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        $cart = $user->cart;

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty',
            ], 422);
        }

        $cart->load(['items.product']);

        // Validate stock for all items
        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json([
                    'message' => "Not enough stock for {$item->product->name}",
                ], 422);
            }
        }

        try {
            DB::beginTransaction();

            $subtotal = $cart->total;
            $shippingCost = config('ecommerce.shipping.default_shipping_cost');
            $tax = config('ecommerce.shipping.default_tax_rate');
            $total = $subtotal + $shippingCost + $tax;

            // Create order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $user->id,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'tax' => $tax,
                'total' => $total,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone' => $request->phone,
                'address' => $request->address,
                'location_lat' => $request->location_lat,
                'location_lng' => $request->location_lng,
                'notes' => $request->notes,
            ]);

            // Create order items and update stock
            foreach ($cart->items as $item) {
                // Use English name for permanent order record (fallback to other languages if needed)
                $productName = $item->product->name_eng 
                    ?? $item->product->name_uz 
                    ?? $item->product->name_ru 
                    ?? 'Unknown Product';

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_name' => $productName,
                    'product_sku' => $item->product->sku,
                    'price' => $item->product->price,
                    'quantity' => $item->quantity,
                    'subtotal' => $item->subtotal,
                ]);

                // Decrease stock
                $item->product->decrement('stock', $item->quantity);
            }

            // Clear cart
            $cart->items()->delete();

            DB::commit();

            $order->load(['items.product']);

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function cancel(Request $request, Order $order): JsonResponse
    {
        // Ensure order belongs to user
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Only pending orders can be cancelled
        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Order cannot be cancelled',
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Restore stock
            foreach ($order->items as $item) {
                $item->product->increment('stock', $item->quantity);
            }

            $order->update([
                'status' => 'cancelled',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Order cancelled successfully',
                'order' => $order->fresh(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to cancel order',
            ], 500);
        }
    }
}
