<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cart = $request->user()->getOrCreateCart();
        $cart->load(['items.product.subcatalog.catalog']);

        $items = $cart->items->map(function ($item) {
            return [
                'id' => $item->id,
                'product' => $item->product,
                'quantity' => $item->quantity,
                'subtotal' => $item->subtotal,
            ];
        });

        return response()->json([
            'items' => $items,
            'total' => $cart->total,
            'items_count' => $cart->items_count,
        ]);
    }

    public function add(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'quantity' => 'integer|min:' . config('ecommerce.cart.min_quantity') . '|max:' . config('ecommerce.cart.max_quantity_per_item'),
        ]);

        $quantity = $request->input('quantity', 1);
        $cart = $request->user()->getOrCreateCart();

        // Check stock
        if ($product->stock < $quantity) {
            return response()->json([
                'message' => 'Not enough stock available',
            ], 422);
        }

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $quantity;

            if ($product->stock < $newQuantity) {
                return response()->json([
                    'message' => 'Not enough stock available',
                ], 422);
            }

            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
            ]);
        }

        $cart->refresh();
        $cart->load(['items.product']);

        return response()->json([
            'message' => 'Added to cart',
            'items_count' => $cart->items_count,
            'total' => $cart->total,
        ]);
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        // Ensure cart item belongs to user
        if ($cartItem->cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:' . config('ecommerce.cart.min_quantity') . '|max:' . config('ecommerce.cart.max_quantity_per_item'),
        ]);

        $quantity = $request->input('quantity');

        // Check stock
        if ($cartItem->product->stock < $quantity) {
            return response()->json([
                'message' => 'Not enough stock available',
            ], 422);
        }

        $cartItem->update(['quantity' => $quantity]);

        $cart = $cartItem->cart->refresh();
        $cart->load(['items.product']);

        return response()->json([
            'message' => 'Cart updated',
            'items_count' => $cart->items_count,
            'total' => $cart->total,
        ]);
    }

    public function remove(Request $request, CartItem $cartItem): JsonResponse
    {
        // Ensure cart item belongs to user
        if ($cartItem->cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart = $cartItem->cart;
        $cartItem->delete();

        $cart->refresh();
        $cart->load(['items.product']);

        return response()->json([
            'message' => 'Removed from cart',
            'items_count' => $cart->items_count,
            'total' => $cart->total,
        ]);
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $request->user()->cart;

        if ($cart) {
            $cart->items()->delete();
        }

        return response()->json([
            'message' => 'Cart cleared',
            'items_count' => 0,
            'total' => 0,
        ]);
    }

    public function count(Request $request): JsonResponse
    {
        $cart = $request->user()->cart;

        return response()->json([
            'items_count' => $cart ? $cart->items_count : 0,
        ]);
    }
}

