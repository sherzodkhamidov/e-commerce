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
            ->paginate(10);

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
            'shipping_name' => 'required|string|max:255',
            'shipping_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:500',
            'shipping_city' => 'required|string|max:100',
            'shipping_region' => 'nullable|string|max:100',
            'shipping_postal_code' => 'nullable|string|max:20',
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
            $shippingCost = 0; // Free shipping for now
            $tax = 0;
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
                'shipping_name' => $request->shipping_name,
                'shipping_phone' => $request->shipping_phone,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'shipping_region' => $request->shipping_region,
                'shipping_postal_code' => $request->shipping_postal_code,
                'notes' => $request->notes,
            ]);

            // Create order items and update stock
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
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
        if (!in_array($order->status, ['pending', 'confirmed'])) {
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

