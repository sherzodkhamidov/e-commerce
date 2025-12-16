<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubcatalogResource\Pages;
use App\Models\Subcatalog;
use BackedEnum;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Components as Schemas;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use UnitEnum;

class SubcatalogResource extends Resource
{
    protected static ?string $model = Subcatalog::class;

    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static string | UnitEnum | null $navigationGroup = 'Shop';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Schemas\Section::make()
                    ->schema([
                        Forms\Components\Select::make('catalog_id')
                            ->relationship('catalog', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Forms\Components\Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),
                        Forms\Components\FileUpload::make('image')
                            ->image()
                            ->directory('subcatalogs')
                            ->columnSpanFull(),
                        Forms\Components\Toggle::make('is_active')
                            ->default(true),
                        Forms\Components\TextInput::make('sort_order')
                            ->numeric()
                            ->default(0),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->square(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('catalog.name')
                    ->sortable()
                    ->badge(),
                Tables\Columns\TextColumn::make('products_count')
                    ->counts('products')
                    ->label('Products'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('catalog')
                    ->relationship('catalog', 'name'),
                Tables\Filters\TernaryFilter::make('is_active'),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('sort_order');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubcatalogs::route('/'),
            'create' => Pages\CreateSubcatalog::route('/create'),
            'edit' => Pages\EditSubcatalog::route('/{record}/edit'),
        ];
    }
}
