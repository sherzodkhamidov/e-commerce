<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use App\Models\Subcatalog;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Resources\Concerns\Translatable;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    // use Translatable;

    protected static ?string $model = Product::class;

    // protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    public static function getNavigationIcon(): ?string
    {
        return 'heroicon-o-shopping-bag';
    }

    // protected static $navigationGroup = 'Shop';

    public static function getNavigationGroup(): ?string
    {
        return 'Shop';
    }

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->columns(3)
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Tabs::make('Translations')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('Uzbek')
                                    ->schema([
                                        Forms\Components\TextInput::make('name_uz')
                                            ->label('Name (UZ)')
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state ?? ''))),
                                        Forms\Components\Textarea::make('short_description_uz')
                                            ->label('Short Description (UZ)')
                                            ->rows(2),
                                        Forms\Components\RichEditor::make('description_uz')
                                            ->label('Description (UZ)'),
                                    ]),
                                Forms\Components\Tabs\Tab::make('Russian')
                                    ->schema([
                                        Forms\Components\TextInput::make('name_ru')
                                            ->label('Name (RU)')
                                            ->required()
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('short_description_ru')
                                            ->label('Short Description (RU)')
                                            ->rows(2),
                                        Forms\Components\RichEditor::make('description_ru')
                                            ->label('Description (RU)'),
                                    ]),
                                Forms\Components\Tabs\Tab::make('English')
                                    ->schema([
                                        Forms\Components\TextInput::make('name_eng')
                                            ->label('Name (ENG)')
                                            ->required()
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('short_description_eng')
                                            ->label('Short Description (ENG)')
                                            ->rows(2),
                                        Forms\Components\RichEditor::make('description_eng')
                                            ->label('Description (ENG)'),
                                    ]),
                            ])->columnSpanFull(),

                        Forms\Components\Section::make('Product Information')
                            ->schema([
                                Forms\Components\TextInput::make('slug')
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(ignoreRecord: true),
                                Forms\Components\Select::make('subcatalog_id')
                                    ->label('Subcatalog')
                                    ->options(function () {
                                        return Subcatalog::with('catalog')->get()->mapWithKeys(function ($subcatalog) {
                                            return [$subcatalog->id => $subcatalog->catalog->name_eng . ' → ' . $subcatalog->name_eng];
                                        });
                                    })
                                    ->required()
                                    ->searchable(),
                            ])->columns(2),

                        Forms\Components\Section::make('Images')
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

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Pricing')
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

                        Forms\Components\Section::make('Inventory')
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

                        Forms\Components\Section::make('Status')
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
                Tables\Columns\TextColumn::make('name_eng')
                    ->label('Name')
                    ->searchable(['name_uz', 'name_ru', 'name_eng'])
                    ->sortable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('subcatalog.name_eng')
                    ->label('Subcatalog')
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
                    ->relationship('subcatalog', 'name_eng'),
                Tables\Filters\TernaryFilter::make('is_active'),
                Tables\Filters\TernaryFilter::make('is_featured'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
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
