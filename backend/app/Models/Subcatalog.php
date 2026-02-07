<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Spatie\Translatable\HasTranslations;

class Subcatalog extends Model
{
    use HasFactory, HasTranslations;

    // public $translatable = ['name', 'description']; // Removed

    protected $fillable = [
        'catalog_id',
        'name_uz',
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

        static::creating(function ($subcatalog) {
            if (empty($subcatalog->slug)) {
                $subcatalog->slug = Str::slug($subcatalog->getTranslation('name', 'en'));
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
