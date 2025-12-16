<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use BackedEnum;
use Filament\Actions;
use Filament\Forms;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Schemas\Components as Schemas;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use UnitEnum;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-shopping-cart';

    protected static string | UnitEnum | null $navigationGroup = 'Sales';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Schemas\Group::make()
                    ->schema([
                        Schemas\Section::make('Order Information')
                            ->schema([
                                Forms\Components\TextInput::make('order_number')
                                    ->disabled(),
                                Forms\Components\Select::make('status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'confirmed' => 'Confirmed',
                                        'processing' => 'Processing',
                                        'shipped' => 'Shipped',
                                        'delivered' => 'Delivered',
                                        'cancelled' => 'Cancelled',
                                    ])
                                    ->required(),
                                Forms\Components\Select::make('payment_status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'paid' => 'Paid',
                                        'failed' => 'Failed',
                                        'refunded' => 'Refunded',
                                    ])
                                    ->required(),
                                Forms\Components\TextInput::make('payment_method')
                                    ->disabled(),
                            ])->columns(2),

                        Schemas\Section::make('Shipping Information')
                            ->schema([
                                Forms\Components\TextInput::make('shipping_name')
                                    ->required(),
                                Forms\Components\TextInput::make('shipping_phone')
                                    ->required(),
                                Forms\Components\Textarea::make('shipping_address')
                                    ->required()
                                    ->columnSpanFull(),
                                Forms\Components\TextInput::make('shipping_city')
                                    ->required(),
                                Forms\Components\TextInput::make('shipping_region'),
                                Forms\Components\TextInput::make('shipping_postal_code'),
                            ])->columns(2),

                        Schemas\Section::make('Notes')
                            ->schema([
                                Forms\Components\Textarea::make('notes')
                                    ->columnSpanFull(),
                            ]),
                    ])->columnSpan(['lg' => 2]),

                Schemas\Group::make()
                    ->schema([
                        Schemas\Section::make('Customer')
                            ->schema([
                                Forms\Components\Placeholder::make('user_name')
                                    ->label('Name')
                                    ->content(fn (Order $record): string => $record->user->name ?? ''),
                                Forms\Components\Placeholder::make('user_email')
                                    ->label('Email')
                                    ->content(fn (Order $record): string => $record->user->email ?? ''),
                            ]),

                        Schemas\Section::make('Order Summary')
                            ->schema([
                                Forms\Components\Placeholder::make('subtotal')
                                    ->content(fn (Order $record): string => '$' . number_format($record->subtotal, 2)),
                                Forms\Components\Placeholder::make('shipping_cost')
                                    ->content(fn (Order $record): string => '$' . number_format($record->shipping_cost, 2)),
                                Forms\Components\Placeholder::make('tax')
                                    ->content(fn (Order $record): string => '$' . number_format($record->tax, 2)),
                                Forms\Components\Placeholder::make('total')
                                    ->content(fn (Order $record): string => '$' . number_format($record->total, 2)),
                            ]),

                        Schemas\Section::make('Dates')
                            ->schema([
                                Forms\Components\DateTimePicker::make('shipped_at'),
                                Forms\Components\DateTimePicker::make('delivered_at'),
                                Forms\Components\DateTimePicker::make('paid_at'),
                            ]),
                    ])->columnSpan(['lg' => 1]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('total')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'confirmed' => 'info',
                        'processing' => 'primary',
                        'shipped' => 'info',
                        'delivered' => 'success',
                        'cancelled' => 'danger',
                        default => 'secondary',
                    }),
                Tables\Columns\TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'paid' => 'success',
                        'failed' => 'danger',
                        'refunded' => 'info',
                        default => 'secondary',
                    }),
                Tables\Columns\TextColumn::make('payment_method')
                    ->badge(),
                Tables\Columns\TextColumn::make('items_count')
                    ->counts('items')
                    ->label('Items'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'processing' => 'Processing',
                        'shipped' => 'Shipped',
                        'delivered' => 'Delivered',
                        'cancelled' => 'Cancelled',
                    ]),
                Tables\Filters\SelectFilter::make('payment_status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'failed' => 'Failed',
                        'refunded' => 'Refunded',
                    ]),
                Tables\Filters\SelectFilter::make('payment_method')
                    ->options([
                        'payme' => 'Payme',
                        'cash' => 'Cash on Delivery',
                    ]),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\Action::make('confirm')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (Order $record) => $record->status === 'pending')
                    ->action(fn (Order $record) => $record->update(['status' => 'confirmed'])),
                Actions\Action::make('ship')
                    ->icon('heroicon-o-truck')
                    ->color('info')
                    ->requiresConfirmation()
                    ->visible(fn (Order $record) => in_array($record->status, ['confirmed', 'processing']))
                    ->action(fn (Order $record) => $record->update([
                        'status' => 'shipped',
                        'shipped_at' => now(),
                    ])),
                Actions\Action::make('deliver')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (Order $record) => $record->status === 'shipped')
                    ->action(fn (Order $record) => $record->update([
                        'status' => 'delivered',
                        'delivered_at' => now(),
                    ])),
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
            'index' => Pages\ListOrders::route('/'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }
}

