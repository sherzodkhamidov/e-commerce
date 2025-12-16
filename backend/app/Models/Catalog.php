<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Catalog extends Model
{
    use HasFactory;

    protected $fillable = [
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

        static::creating(function ($catalog) {
            if (empty($catalog->slug)) {
                $catalog->slug = Str::slug($catalog->name);
            }
        });
    }

    public function subcatalogs(): HasMany
    {
        return $this->hasMany(Subcatalog::class);
    }

    public function products(): HasMany
    {
        return $this->hasManyThrough(Product::class, Subcatalog::class);
    }
}
