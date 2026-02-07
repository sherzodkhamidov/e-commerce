<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Pagination Settings
    |--------------------------------------------------------------------------
    |
    | Default pagination values for API responses throughout the application.
    |
    */
    'pagination' => [
        'products_per_page' => 12,
        'orders_per_page' => 10,
        'featured_products_limit' => 8,
        'related_products_limit' => 4,
    ],

    /*
    |--------------------------------------------------------------------------
    | Cart Settings
    |--------------------------------------------------------------------------
    |
    | Quantity limits and cart behavior configuration.
    |
    */
    'cart' => [
        'max_quantity_per_item' => 99,
        'min_quantity' => 1,
    ],

    /*
    |--------------------------------------------------------------------------
    | Shipping Settings
    |--------------------------------------------------------------------------
    |
    | Shipping costs and thresholds configuration.
    |
    */
    'shipping' => [
        'free_shipping_threshold' => 0,
        'default_shipping_cost' => 0,
        'default_tax_rate' => 0,
    ],

    /*
    |--------------------------------------------------------------------------
    | Order Settings
    |--------------------------------------------------------------------------
    |
    | Order status values and payment methods.
    |
    */
    'order' => [
        'statuses' => [
            'pending' => 'pending',
            'confirmed' => 'confirmed',
            'processing' => 'processing',
            'shipped' => 'shipped',
            'delivered' => 'delivered',
            'cancelled' => 'cancelled',
        ],
        'payment_statuses' => [
            'pending' => 'pending',
            'paid' => 'paid',
            'failed' => 'failed',
            'refunded' => 'refunded',
        ],
        'payment_methods' => ['payme', 'cash'],
        'cancellable_statuses' => ['pending', 'confirmed'],
    ],
];
