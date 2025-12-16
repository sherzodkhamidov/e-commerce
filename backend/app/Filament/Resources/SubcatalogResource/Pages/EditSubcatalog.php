<?php

namespace App\Filament\Resources\SubcatalogResource\Pages;

use App\Filament\Resources\SubcatalogResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSubcatalog extends EditRecord
{
    protected static string $resource = SubcatalogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}

