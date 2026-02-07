<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubcatalogResource\Pages;
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

class SubcatalogResource extends Resource
{
    // use Translatable;

    protected static ?string $model = Subcatalog::class;

    // protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function getNavigationIcon(): ?string
    {
        return 'heroicon-o-rectangle-stack';
    }

    // protected static $navigationGroup = 'Shop';

    public static function getNavigationGroup(): ?string
    {
        return 'Shop';
    }

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
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
                                Forms\Components\Textarea::make('description_uz')
                                    ->label('Description (UZ)')
                                    ->rows(3),
                            ]),
                        Forms\Components\Tabs\Tab::make('Russian')
                            ->schema([
                                Forms\Components\TextInput::make('name_ru')
                                    ->label('Name (RU)')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\Textarea::make('description_ru')
                                    ->label('Description (RU)')
                                    ->rows(3),
                            ]),
                        Forms\Components\Tabs\Tab::make('English')
                            ->schema([
                                Forms\Components\TextInput::make('name_eng')
                                    ->label('Name (ENG)')
                                    ->required()
                                    ->maxLength(255),
                                Forms\Components\Textarea::make('description_eng')
                                    ->label('Description (ENG)')
                                    ->rows(3),
                            ]),
                    ])->columnSpanFull(),

                Forms\Components\Section::make('General Info')
                    ->schema([
                        Forms\Components\Select::make('catalog_id')
                            // ->relationship('catalog', 'name') // 'name' no longer exists
                            ->relationship('catalog', 'name_eng') // Use name_eng for admin display
                            ->required()
                            ->searchable()
                            ->preload(),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
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
                Tables\Columns\TextColumn::make('name_eng')
                    ->label('Name')
                    ->searchable(['name_uz', 'name_ru', 'name_eng'])
                    ->sortable(),
                Tables\Columns\TextColumn::make('catalog.name_eng')
                    ->label('Catalog')
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
                    ->relationship('catalog', 'name_eng'),
                Tables\Filters\TernaryFilter::make('is_active'),
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
