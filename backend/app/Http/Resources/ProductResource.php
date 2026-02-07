<?php

namespace App\Http\Resources;

use App\Traits\HasLocalizedFields;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    use HasLocalizedFields;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subcatalog_id' => $this->subcatalog_id,
            'name_uz' => $this->name_uz,
            'name_ru' => $this->name_ru,
            'name_eng' => $this->name_eng,
            'name' => $this->getLocalizedField('name'),
            'slug' => $this->slug,
            'short_description_uz' => $this->short_description_uz,
            'short_description_ru' => $this->short_description_ru,
            'short_description_eng' => $this->short_description_eng,
            'short_description' => $this->getLocalizedField('short_description'),
            'description_uz' => $this->description_uz,
            'description_ru' => $this->description_ru,
            'description_eng' => $this->description_eng,
            'description' => $this->getLocalizedField('description'),
            'price' => $this->price,
            'old_price' => $this->old_price,
            'sku' => $this->sku,
            'stock' => $this->stock,
            'image' => $this->formatImageUrl($this->image),
            'gallery' => $this->formatGalleryUrls($this->gallery),
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'sort_order' => $this->sort_order,
            'discount_percentage' => $this->discount_percentage,
            'subcatalog' => new SubcatalogResource($this->whenLoaded('subcatalog')),
        ];
    }

    /**
     * Format a single image URL.
     */
    private function formatImageUrl(?string $image): ?string
    {
        if (!$image) {
            return null;
        }

        return str_starts_with($image, 'http') ? $image : url('storage/' . $image);
    }

    /**
     * Format gallery image URLs.
     */
    private function formatGalleryUrls(?array $gallery): array
    {
        if (!$gallery) {
            return [];
        }

        return array_map(
            fn($img) => str_starts_with($img, 'http') ? $img : url('storage/' . $img),
            $gallery
        );
    }
}

