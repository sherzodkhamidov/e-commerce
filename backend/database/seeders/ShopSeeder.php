<?php

namespace Database\Seeders;

use App\Models\Catalog;
use App\Models\Product;
use App\Models\Subcatalog;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Catalogs
        $electronics = Catalog::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'description' => 'Latest electronic devices and gadgets',
            'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $fashion = Catalog::create([
            'name' => 'Fashion',
            'slug' => 'fashion',
            'description' => 'Trendy clothing and accessories',
            'image' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $home = Catalog::create([
            'name' => 'Home & Garden',
            'slug' => 'home-garden',
            'description' => 'Everything for your home',
            'image' => 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // Create Subcatalogs for Electronics
        $phones = Subcatalog::create([
            'catalog_id' => $electronics->id,
            'name' => 'Smartphones',
            'slug' => 'smartphones',
            'description' => 'Latest smartphones from top brands',
            'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $laptops = Subcatalog::create([
            'catalog_id' => $electronics->id,
            'name' => 'Laptops',
            'slug' => 'laptops',
            'description' => 'Powerful laptops for work and play',
            'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $audio = Subcatalog::create([
            'catalog_id' => $electronics->id,
            'name' => 'Audio',
            'slug' => 'audio',
            'description' => 'Headphones, speakers and more',
            'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        // Create Subcatalogs for Fashion
        $menClothing = Subcatalog::create([
            'catalog_id' => $fashion->id,
            'name' => "Men's Clothing",
            'slug' => 'mens-clothing',
            'description' => 'Stylish clothing for men',
            'image' => 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $womenClothing = Subcatalog::create([
            'catalog_id' => $fashion->id,
            'name' => "Women's Clothing",
            'slug' => 'womens-clothing',
            'description' => 'Beautiful clothing for women',
            'image' => 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        // Create Subcatalogs for Home & Garden
        $furniture = Subcatalog::create([
            'catalog_id' => $home->id,
            'name' => 'Furniture',
            'slug' => 'furniture',
            'description' => 'Quality furniture for every room',
            'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        // Create 10 Products
        $products = [
            [
                'subcatalog_id' => $phones->id,
                'name' => 'iPhone 15 Pro Max',
                'slug' => 'iphone-15-pro-max',
                'short_description' => 'The most powerful iPhone ever with A17 Pro chip',
                'description' => '<p>Experience the future with iPhone 15 Pro Max. Featuring the revolutionary A17 Pro chip, a stunning 48MP camera system, and the new Action button. Built with aerospace-grade titanium for a lightweight yet durable design.</p><ul><li>6.7-inch Super Retina XDR display</li><li>A17 Pro chip with 6-core GPU</li><li>48MP main camera with 5x optical zoom</li><li>USB-C with USB 3 speeds</li></ul>',
                'price' => 1199.00,
                'old_price' => 1299.00,
                'stock' => 50,
                'image' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
                'is_featured' => true,
            ],
            [
                'subcatalog_id' => $phones->id,
                'name' => 'Samsung Galaxy S24 Ultra',
                'slug' => 'samsung-galaxy-s24-ultra',
                'short_description' => 'AI-powered smartphone with S Pen',
                'description' => '<p>Meet Galaxy S24 Ultra, the ultimate smartphone powered by Galaxy AI. Features a built-in S Pen, a stunning 200MP camera, and titanium frame design.</p><ul><li>6.8-inch Dynamic AMOLED 2X display</li><li>Snapdragon 8 Gen 3 processor</li><li>200MP main camera</li><li>5000mAh battery</li></ul>',
                'price' => 1299.00,
                'old_price' => null,
                'stock' => 35,
                'image' => 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
                'is_featured' => true,
            ],
            [
                'subcatalog_id' => $laptops->id,
                'name' => 'MacBook Pro 16" M3 Max',
                'slug' => 'macbook-pro-16-m3-max',
                'short_description' => 'Supercharged for pros with M3 Max chip',
                'description' => '<p>The most powerful MacBook Pro ever. With the M3 Max chip, you can tackle intensive workflows like never before. Features Liquid Retina XDR display with extreme dynamic range.</p><ul><li>16.2-inch Liquid Retina XDR display</li><li>M3 Max chip up to 16-core CPU, 40-core GPU</li><li>Up to 128GB unified memory</li><li>Up to 22 hours battery life</li></ul>',
                'price' => 3499.00,
                'old_price' => 3699.00,
                'stock' => 20,
                'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
                'is_featured' => true,
            ],
            [
                'subcatalog_id' => $laptops->id,
                'name' => 'Dell XPS 15',
                'slug' => 'dell-xps-15',
                'short_description' => 'Premium Windows laptop with OLED display',
                'description' => '<p>The Dell XPS 15 combines stunning design with powerful performance. Features a virtually borderless InfinityEdge display and premium materials.</p><ul><li>15.6-inch 3.5K OLED touchscreen</li><li>13th Gen Intel Core i7</li><li>NVIDIA GeForce RTX 4060</li><li>32GB RAM, 1TB SSD</li></ul>',
                'price' => 1899.00,
                'old_price' => 2199.00,
                'stock' => 25,
                'image' => 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
                'is_featured' => false,
            ],
            [
                'subcatalog_id' => $audio->id,
                'name' => 'Sony WH-1000XM5',
                'slug' => 'sony-wh-1000xm5',
                'short_description' => 'Industry-leading noise canceling headphones',
                'description' => '<p>Experience exceptional sound quality with industry-leading noise cancellation. The WH-1000XM5 features Auto NC Optimizer and Speak-to-Chat for seamless communication.</p><ul><li>30-hour battery life</li><li>Multi-point connection</li><li>Ultra-comfortable design</li><li>Premium call quality</li></ul>',
                'price' => 349.00,
                'old_price' => 399.00,
                'stock' => 100,
                'image' => 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600',
                'is_featured' => true,
            ],
            [
                'subcatalog_id' => $audio->id,
                'name' => 'AirPods Pro 2nd Gen',
                'slug' => 'airpods-pro-2nd-gen',
                'short_description' => 'Adaptive Audio and USB-C charging',
                'description' => '<p>AirPods Pro now with Adaptive Audio, Personalized Spatial Audio, and USB-C charging. Features up to 2x more Active Noise Cancellation.</p><ul><li>H2 chip for smarter noise cancellation</li><li>Adaptive Audio mode</li><li>Conversation Awareness</li><li>MagSafe Charging Case with speaker</li></ul>',
                'price' => 249.00,
                'old_price' => null,
                'stock' => 150,
                'image' => 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600',
                'is_featured' => false,
            ],
            [
                'subcatalog_id' => $menClothing->id,
                'name' => 'Premium Wool Blazer',
                'slug' => 'premium-wool-blazer',
                'short_description' => 'Classic fit wool blazer for every occasion',
                'description' => '<p>Elevate your style with this premium wool blazer. Crafted from fine Italian wool with a classic fit that suits both business and casual occasions.</p><ul><li>100% Italian wool</li><li>Classic fit</li><li>Two-button closure</li><li>Interior pockets</li></ul>',
                'price' => 299.00,
                'old_price' => 399.00,
                'stock' => 45,
                'image' => 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
                'is_featured' => false,
            ],
            [
                'subcatalog_id' => $womenClothing->id,
                'name' => 'Silk Evening Dress',
                'slug' => 'silk-evening-dress',
                'short_description' => 'Elegant silk dress for special occasions',
                'description' => '<p>Make a statement with this stunning silk evening dress. Features a flattering A-line silhouette and delicate pleating detail.</p><ul><li>100% mulberry silk</li><li>A-line silhouette</li><li>Hidden back zipper</li><li>Fully lined</li></ul>',
                'price' => 450.00,
                'old_price' => 599.00,
                'stock' => 30,
                'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
                'is_featured' => true,
            ],
            [
                'subcatalog_id' => $furniture->id,
                'name' => 'Modern Sectional Sofa',
                'slug' => 'modern-sectional-sofa',
                'short_description' => 'L-shaped sectional with premium fabric',
                'description' => '<p>Transform your living room with this modern sectional sofa. Features high-density foam cushions and durable fabric upholstery.</p><ul><li>Premium polyester fabric</li><li>Reversible chaise</li><li>Solid wood frame</li><li>Easy assembly</li></ul>',
                'price' => 1299.00,
                'old_price' => 1599.00,
                'stock' => 15,
                'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
                'is_featured' => true,
            ],
            [
                'subcatalog_id' => $furniture->id,
                'name' => 'Scandinavian Desk Chair',
                'slug' => 'scandinavian-desk-chair',
                'short_description' => 'Ergonomic office chair with modern design',
                'description' => '<p>Work in comfort and style with this Scandinavian-inspired desk chair. Features adjustable height and lumbar support for all-day comfort.</p><ul><li>Breathable mesh back</li><li>Adjustable lumbar support</li><li>360° swivel</li><li>Weight capacity: 300 lbs</li></ul>',
                'price' => 249.00,
                'old_price' => 299.00,
                'stock' => 60,
                'image' => 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600',
                'is_featured' => false,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}

