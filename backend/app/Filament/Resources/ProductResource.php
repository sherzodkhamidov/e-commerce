<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
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

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-shopping-bag';

    protected static string | UnitEnum | null $navigationGroup = 'Shop';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Schemas\Group::make()
                    ->schema([
                        Schemas\Section::make('Product Information')
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),
                                Forms\Components\TextInput::make('slug')
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(ignoreRecord: true),
                                Forms\Components\Select::make('subcatalog_id')
                                    ->label('Subcatalog')
                                    ->options(function () {
                                        return Subcatalog::with('catalog')->get()->mapWithKeys(function ($subcatalog) {
                                            return [$subcatalog->id => $subcatalog->catalog->name . ' → ' . $subcatalog->name];
                                        });
                                    })
                                    ->required()
                                    ->searchable(),
                                Forms\Components\Textarea::make('short_description')
                                    ->rows(2)
                                    ->columnSpanFull(),
                                Forms\Components\RichEditor::make('description')
                                    ->columnSpanFull(),
                            ])->columns(2),

                        Schemas\Section::make('Images')
                            ->schema([
                                Forms\Components\FileUpload::make('image')
                                    ->image()
                                    ->directory('products')
                                    ->label('Main Image'),
                                Forms\Components\FileUpload::make('gallery')
                                    ->image()
                                    ->multiple()
                                    ->directory('products/gallery')
                                    ->label('Gallery Images'),
                            ])->columns(2),
                    ])->columnSpan(['lg' => 2]),

                Schemas\Group::make()
                    ->schema([
                        Schemas\Section::make('Pricing')
                            ->schema([
                                Forms\Components\TextInput::make('price')
                                    ->required()
                                    ->numeric()
                                    ->prefix('$')
                                    ->minValue(0),
                                Forms\Components\TextInput::make('old_price')
                                    ->numeric()
                                    ->prefix('$')
                                    ->minValue(0)
                                    ->label('Compare at Price'),
                            ]),

                        Schemas\Section::make('Inventory')
                            ->schema([
                                Forms\Components\TextInput::make('sku')
                                    ->label('SKU')
                                    ->unique(ignoreRecord: true),
                                Forms\Components\TextInput::make('stock')
                                    ->required()
                                    ->numeric()
                                    ->default(0)
                                    ->minValue(0),
                            ]),

                        Schemas\Section::make('Status')
                            ->schema([
                                Forms\Components\Toggle::make('is_active')
                                    ->label('Active')
                                    ->default(true),
                                Forms\Components\Toggle::make('is_featured')
                                    ->label('Featured'),
                                Forms\Components\TextInput::make('sort_order')
                                    ->numeric()
                                    ->default(0),
                            ]),
                    ])->columnSpan(['lg' => 1]),
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
                    ->sortable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('subcatalog.name')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('old_price')
                    ->money('USD')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('stock')
                    ->sortable()
                    ->badge()
                    ->color(fn (int $state): string => match (true) {
                        $state === 0 => 'danger',
                        $state < 10 => 'warning',
                        default => 'success',
                    }),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('subcatalog')
                    ->relationship('subcatalog', 'name'),
                Tables\Filters\TernaryFilter::make('is_active'),
                Tables\Filters\TernaryFilter::make('is_featured'),
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
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
