<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Spatie\Translatable\HasTranslations;

class Catalog extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'name_uz',
        'name_sub', // Wait, name_sub is wrong, should be name_ru
        'name_ru',
        'name_eng',
        'slug',
        'description_uz',
        'description_ru',
        'description_eng',
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
                $catalog->slug = Str::slug($catalog->getTranslation('name', 'en'));
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
