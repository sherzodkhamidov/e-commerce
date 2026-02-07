<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubcatalogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'catalog_id' => $this->catalog_id,
            'name_uz' => $this->name_uz,
            'name_ru' => $this->name_ru,
            'name_eng' => $this->name_eng,
            'name' => $this->{'name_' . (app()->getLocale() == 'en' ? 'eng' : app()->getLocale())} ?? $this->name_eng,
            'slug' => $this->slug,
            'description_uz' => $this->description_uz,
            'description_ru' => $this->description_ru,
            'description_eng' => $this->description_eng,
            'description' => $this->{'description_' . (app()->getLocale() == 'en' ? 'eng' : app()->getLocale())} ?? $this->description_eng,
            'image' => $this->image ? (str_starts_with($this->image, 'http') ? $this->image : url('storage/' . $this->image)) : null,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'products_count' => $this->whenCounted('products'),
            'catalog' => new CatalogResource($this->whenLoaded('catalog')),
        ];
    }
}
