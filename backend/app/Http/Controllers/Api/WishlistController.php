<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $wishlists = $request->user()
            ->wishlists()
            ->with(['product.subcatalog.catalog'])
            ->latest()
            ->get();

        $products = $wishlists->map(fn($wishlist) => $wishlist->product);

        return response()->json($products);
    }

    public function toggle(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();

        $existing = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'message' => 'Removed from wishlist',
                'in_wishlist' => false,
            ]);
        }

        Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        return response()->json([
            'message' => 'Added to wishlist',
            'in_wishlist' => true,
        ]);
    }

    public function check(Request $request, Product $product): JsonResponse
    {
        $inWishlist = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->exists();

        return response()->json([
            'in_wishlist' => $inWishlist,
        ]);
    }

    public function remove(Request $request, Product $product): JsonResponse
    {
        Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->delete();

        return response()->json([
            'message' => 'Removed from wishlist',
        ]);
    }

    public function ids(Request $request): JsonResponse
    {
        $ids = $request->user()
            ->wishlists()
            ->pluck('product_id');

        return response()->json($ids);
    }
}

