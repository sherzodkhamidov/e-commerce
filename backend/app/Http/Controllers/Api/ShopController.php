<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Catalog;
use App\Models\Product;
use App\Models\Subcatalog;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function catalogs()
    {
        $catalogs = Catalog::where('is_active', true)
            ->withCount('subcatalogs')
            ->orderBy('sort_order')
            ->get();

        return response()->json($catalogs);
    }

    public function catalog(string $slug)
    {
        $catalog = Catalog::where('slug', $slug)
            ->where('is_active', true)
            ->with(['subcatalogs' => function ($query) {
                $query->where('is_active', true)
                    ->withCount('products')
                    ->orderBy('sort_order');
            }])
            ->firstOrFail();

        return response()->json($catalog);
    }

    public function subcatalogs(Request $request)
    {
        $query = Subcatalog::where('is_active', true)
            ->with('catalog')
            ->withCount('products')
            ->orderBy('sort_order');

        if ($request->has('catalog_id')) {
            $query->where('catalog_id', $request->catalog_id);
        }

        return response()->json($query->get());
    }

    public function subcatalog(string $slug)
    {
        $subcatalog = Subcatalog::where('slug', $slug)
            ->where('is_active', true)
            ->with('catalog')
            ->firstOrFail();

        return response()->json($subcatalog);
    }

    public function products(Request $request)
    {
        $query = Product::where('is_active', true)
            ->with(['subcatalog.catalog']);

        // Filter by catalog
        if ($request->has('catalog_id')) {
            $query->whereHas('subcatalog', function ($q) use ($request) {
                $q->where('catalog_id', $request->catalog_id);
            });
        }

        // Filter by subcatalog
        if ($request->has('subcatalog_id')) {
            $query->where('subcatalog_id', $request->subcatalog_id);
        }

        // Filter by featured
        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        // Search
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Price range filter
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');

        if ($sortBy === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($sortBy === 'price_desc') {
            $query->orderBy('price', 'desc');
        } elseif ($sortBy === 'name') {
            $query->orderBy('name', $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Pagination
        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    public function product(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with(['subcatalog.catalog'])
            ->firstOrFail();

        // Get related products from same subcatalog
        $relatedProducts = Product::where('subcatalog_id', $product->subcatalog_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->limit(4)
            ->get();

        return response()->json([
            'product' => $product,
            'related_products' => $relatedProducts,
        ]);
    }

    public function featuredProducts()
    {
        $products = Product::where('is_active', true)
            ->where('is_featured', true)
            ->with(['subcatalog.catalog'])
            ->orderBy('sort_order')
            ->limit(8)
            ->get();

        return response()->json($products);
    }
}

