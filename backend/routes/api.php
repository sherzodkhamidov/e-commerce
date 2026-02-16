<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Google OAuth routes
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->group(function () {
    // User
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);
    Route::post('/user/set-password', [AuthController::class, 'setPassword']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::get('/wishlist/ids', [WishlistController::class, 'ids']);
    Route::post('/wishlist/{product}', [WishlistController::class, 'toggle']);
    Route::get('/wishlist/{product}/check', [WishlistController::class, 'check']);
    Route::delete('/wishlist/{product}', [WishlistController::class, 'remove']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::get('/cart/count', [CartController::class, 'count']);
    Route::post('/cart/{product}', [CartController::class, 'add']);
    Route::put('/cart/items/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'remove']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
});

// Shop routes (public)
Route::get('/catalogs', [ShopController::class, 'catalogs']);
Route::get('/catalogs/{slug}', [ShopController::class, 'catalog']);
Route::get('/subcatalogs', [ShopController::class, 'subcatalogs']);
Route::get('/subcatalogs/{slug}', [ShopController::class, 'subcatalog']);
Route::get('/products', [ShopController::class, 'products']);
Route::get('/products/featured', [ShopController::class, 'featuredProducts']);
Route::get('/products/{slug}', [ShopController::class, 'product']);

