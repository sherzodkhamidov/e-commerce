<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Spatie\Translatable\HasTranslations;

class Product extends Model
{
    use HasFactory, HasTranslations;

    // public $translatable = ['name', 'description', 'short_description']; // Removed

    protected $fillable = [
        'subcatalog_id',
        'name_uz',
        'name_ru',
        'name_eng',
        'slug',
        'description_uz',
        'description_ru',
        'description_eng',
        'short_description_uz',
        'short_description_ru',
        'short_description_eng',
        'price',
        'old_price',
        'sku',
        'stock',
        'image',
        'gallery',
        'is_active',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'old_price' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'gallery' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->getTranslation('name', 'en'));
            }
            if (empty($product->sku)) {
                $product->sku = 'SKU-' . strtoupper(Str::random(8));
            }
        });
    }

    public function subcatalog(): BelongsTo
    {
        return $this->belongsTo(Subcatalog::class);
    }

    public function catalog(): BelongsTo
    {
        return $this->subcatalog->catalog();
    }

    public function getDiscountPercentageAttribute(): ?int
    {
        if ($this->old_price && $this->old_price > $this->price) {
            return round((($this->old_price - $this->price) / $this->old_price) * 100);
        }
        return null;
    }
}
