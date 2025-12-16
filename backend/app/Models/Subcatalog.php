<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Subcatalog extends Model
{
    use HasFactory;

    protected $fillable = [
        'catalog_id',
        'name',
        'slug',
        'description',
        'image',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($subcatalog) {
            if (empty($subcatalog->slug)) {
                $subcatalog->slug = Str::slug($subcatalog->name);
            }
        });
    }

    public function catalog(): BelongsTo
    {
        return $this->belongsTo(Catalog::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
