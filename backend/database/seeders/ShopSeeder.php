<?php

namespace Database\Seeders;

use App\Models\Catalog;
use App\Models\Product;
use App\Models\Subcatalog;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $catalogsData = [
            [
                'name' => ['en' => 'Electronics', 'ru' => 'Электроника', 'uz' => 'Elektronika'],
                'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
                'description' => ['en' => 'Latest gadgets and tech', 'ru' => 'Новейшие гаджеты и технологии', 'uz' => 'Eng so\'nggi gadjetlar va texnologiyalar'],
                'subs' => [
                    ['name' => ['en' => 'Smartphones', 'ru' => 'Смартфоны', 'uz' => 'Smartfonlar'], 'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'],
                    ['name' => ['en' => 'Laptops', 'ru' => 'Ноутбуки', 'uz' => 'Noutbuklar'], 'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'],
                    ['name' => ['en' => 'Audio & Headphones', 'ru' => 'Аудио и Наушники', 'uz' => 'Audio va Quloqchinlar'], 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
                    ['name' => ['en' => 'Cameras', 'ru' => 'Камеры', 'uz' => 'Kameralar'], 'image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80'],
                    ['name' => ['en' => 'Gaming Consoles', 'ru' => 'Игровые приставки', 'uz' => 'O\'yin konsollari'], 'image' => 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&q=80'],
                    ['name' => ['en' => 'Smart Home', 'ru' => 'Умный дом', 'uz' => 'Aqlli uy'], 'image' => 'https://images.unsplash.com/photo-1558002038-1091a1661fcc?w=500&q=80'],
                    ['name' => ['en' => 'Wearables', 'ru' => 'Носимая электроника', 'uz' => 'Taqiladigan qurilmalar'], 'image' => 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80'],
                ]
            ],
            [
                'name' => ['en' => 'Fashion', 'ru' => 'Мода', 'uz' => 'Moda'],
                'image' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80',
                'description' => ['en' => 'Trendy clothing for all', 'ru' => 'Модная одежда для всех', 'uz' => 'Hamma uchun zamonaviy kiyimlar'],
                'subs' => [
                    ['name' => ['en' => "Men's Clothing", 'ru' => 'Мужская одеждка', 'uz' => 'Erkaklar kiyimlari'], 'image' => 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=500&q=80'],
                    ['name' => ['en' => "Women's Clothing", 'ru' => 'Женская одежда', 'uz' => 'Ayollar kiyimlari'], 'image' => 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=500&q=80'],
                    ['name' => ['en' => 'Shoes', 'ru' => 'Обувь', 'uz' => 'Poyabzallar'], 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'],
                    ['name' => ['en' => 'Bags & Purses', 'ru' => 'Сумки и кошельки', 'uz' => 'Sumkalar va hamyonlar'], 'image' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80'],
                    ['name' => ['en' => 'Accessories', 'ru' => 'Аксессуары', 'uz' => 'Aksessuarlar'], 'image' => 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=500&q=80'],
                    ['name' => ['en' => 'Watches', 'ru' => 'Часы', 'uz' => 'Soatlar'], 'image' => 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80'],
                    ['name' => ['en' => 'Eyewear', 'ru' => 'Очки', 'uz' => 'Ko\'zoynaklar'], 'image' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80'],
                ]
            ],
            [
                'name' => ['en' => 'Home & Garden', 'ru' => 'Дом и Сад', 'uz' => "Uy va Bog'"],
                'image' => 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80',
                'description' => ['en' => 'Decor and furniture', 'ru' => 'Декор и мебель', 'uz' => 'Dekor va mebellar'],
                'subs' => [
                    ['name' => ['en' => 'Furniture', 'ru' => 'Мебель', 'uz' => 'Mebel'], 'image' => 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&q=80'],
                    ['name' => ['en' => 'Kitchen & Dining', 'ru' => 'Кухня и столовая', 'uz' => 'Oshxona buyumlari'], 'image' => 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=500&q=80'],
                    ['name' => ['en' => 'Bedding', 'ru' => 'Постельные принадлежности', 'uz' => 'Choyshablar'], 'image' => 'https://images.unsplash.com/photo-1505693416388-b0346efee535?w=500&q=80'],
                    ['name' => ['en' => 'Lighting', 'ru' => 'Освещение', 'uz' => 'Yoritish'], 'image' => 'https://images.unsplash.com/photo-1513506003011-3b03c80165bd?w=500&q=80'],
                    ['name' => ['en' => 'Wall Art', 'ru' => 'Настенный декор', 'uz' => 'Devor san\'ati'], 'image' => 'https://images.unsplash.com/photo-1582562124811-c8026933ca8a?w=500&q=80'],
                    ['name' => ['en' => 'Garden Tools', 'ru' => 'Садовые инструменты', 'uz' => 'Bog\' asboblari'], 'image' => 'https://images.unsplash.com/photo-1416879895691-30ada86a6af2?w=500&q=80'],
                    ['name' => ['en' => 'Indoor Plants', 'ru' => 'Комнатные растения', 'uz' => 'Xona o\'simliklari'], 'image' => 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=500&q=80'],
                ]
            ],
            [
                'name' => ['en' => 'Health & Beauty', 'ru' => 'Красота и Здоровье', 'uz' => 'Go\'zallik va Salomatlik'],
                'image' => 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80',
                'description' => ['en' => 'Skincare and makeup', 'ru' => 'Уход за кожей и макияж', 'uz' => 'Teri parvarishi va pardoz'],
                'subs' => [
                    ['name' => ['en' => 'Skincare', 'ru' => 'Уход за кожей', 'uz' => 'Teri parvarishi'], 'image' => 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80'],
                    ['name' => ['en' => 'Makeup', 'ru' => 'Макияж', 'uz' => 'Pardoz'], 'image' => 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&q=80'],
                    ['name' => ['en' => 'Fragrance', 'ru' => 'Парфюмерия', 'uz' => 'Atirlar'], 'image' => 'https://images.unsplash.com/photo-1594035910387-fea477942698?w=500&q=80'],
                    ['name' => ['en' => 'Hair Care', 'ru' => 'Уход за волосами', 'uz' => 'Soch parvarishi'], 'image' => 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80'],
                    ['name' => ['en' => 'Personal Care', 'ru' => 'Личная гигиена', 'uz' => 'Shaxsiy gigiena'], 'image' => 'https://images.unsplash.com/photo-1556217475-132d73f1d8bb?w=500&q=80'],
                ]
            ],
            [
                'name' => ['en' => 'Sports & Outdoors', 'ru' => 'Спорт и Отдых', 'uz' => 'Sport va Hordiq'],
                'image' => 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80',
                'description' => ['en' => 'Gear for your active life', 'ru' => 'Снаряжение для активной жизни', 'uz' => 'Faol hayot uchun jihozlar'],
                'subs' => [
                    ['name' => ['en' => 'Fitness Equipment', 'ru' => 'Фитнес оборудование', 'uz' => 'Fitnes jihozlari'], 'image' => 'https://images.unsplash.com/photo-1538805060512-e2d988d42051?w=500&q=80'],
                    ['name' => ['en' => 'Cycling', 'ru' => 'Велоспорт', 'uz' => 'Velosport'], 'image' => 'https://images.unsplash.com/photo-1485965120184-e224f723d62b?w=500&q=80'],
                    ['name' => ['en' => 'Camping', 'ru' => 'Кемпинг', 'uz' => 'Kemping'], 'image' => 'https://images.unsplash.com/photo-1504280390367-361c6d93384f?w=500&q=80'],
                    ['name' => ['en' => 'Team Sports', 'ru' => 'Командные виды спорта', 'uz' => 'Jamoaviy sport turlari'], 'image' => 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80'],
                    ['name' => ['en' => 'Running', 'ru' => 'Бег', 'uz' => 'Yugurish'], 'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'],
                ]
            ],
            [
                'name' => ['en' => 'Tools & Hardware', 'ru' => 'Инструменты', 'uz' => 'Asboblar'],
                'image' => 'https://images.unsplash.com/photo-1581242163695-19d0acacd468?w=500&q=80',
                'description' => ['en' => 'Build and repair', 'ru' => 'Строительство и ремонт', 'uz' => 'Qurilish va ta\'mirlash'],
                'subs' => [
                    ['name' => ['en' => 'Power Tools', 'ru' => 'Электроинструменты', 'uz' => 'Elektr asboblari'], 'image' => 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&q=80'],
                    ['name' => ['en' => 'Hand Tools', 'ru' => 'Ручные инструменты', 'uz' => 'Qo\'l asboblari'], 'image' => 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500&q=80'],
                    ['name' => ['en' => 'Safety Gear', 'ru' => 'Защитная экипировка', 'uz' => 'Himoya vositalari'], 'image' => 'https://images.unsplash.com/photo-1557008127-18f430588661?w=500&q=80'],
                ]
            ],
             [
                'name' => ['en' => 'Jewelry & Watches', 'ru' => 'Украшения и Часы', 'uz' => 'Zargarlik va Soatlar'],
                'image' => 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=500&q=80',
                'description' => ['en' => 'Sparkle and shine', 'ru' => 'Блеск и сияние', 'uz' => 'Yorqinlik va go\'zallik'],
                'subs' => [
                    ['name' => ['en' => 'Necklaces', 'ru' => 'Ожерелья', 'uz' => 'Marjonlar'], 'image' => 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&q=80'],
                    ['name' => ['en' => 'Rings', 'ru' => 'Кольца', 'uz' => 'Uzuklar'], 'image' => 'https://images.unsplash.com/photo-1605100804763-eb9749a79798?w=500&q=80'],
                    ['name' => ['en' => "Women's Watches", 'ru' => 'Женские часы', 'uz' => "Ayollar soatlari"], 'image' => 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&q=80'],
                ]
            ],
             [
                'name' => ['en' => 'Art & Crafts', 'ru' => 'Искусство и Ремесла', 'uz' => 'San\'at va Hunarmandchilik'],
                'image' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80',
                'description' => ['en' => 'Unleash your creativity', 'ru' => 'Раскройте свой творческий потенциал', 'uz' => 'O\'z ijodingizni namoyish eting'],
                'subs' => [
                    ['name' => ['en' => 'Painting', 'ru' => 'Живопись', 'uz' => 'Rassomlik'], 'image' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80'],
                    ['name' => ['en' => 'Drawing', 'ru' => 'Рисование', 'uz' => 'Chizmachilik'], 'image' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80'],
                    ['name' => ['en' => 'Knitting', 'ru' => 'Вязание', 'uz' => 'To\'qimachilik'], 'image' => 'https://images.unsplash.com/photo-1605111718873-4f932dc7c258?w=500&q=80'],
                ]
            ],
            // Add more as needed...
        ];

        $catalogCounter = 1;

        foreach ($catalogsData as $catData) {
            $catalog = Catalog::create([
                'name_uz' => $catData['name']['uz'],
                'name_ru' => $catData['name']['ru'],
                'name_eng' => $catData['name']['en'],
                'slug' => Str::slug($catData['name']['en']),
                'description_uz' => $catData['description']['uz'],
                'description_ru' => $catData['description']['ru'],
                'description_eng' => $catData['description']['en'],
                'image' => $catData['image'],
                'is_active' => true,
                'sort_order' => $catalogCounter++,
            ]);

            $subOrder = 1;
            foreach ($catData['subs'] as $subData) {
                $sub = Subcatalog::create([
                    'catalog_id' => $catalog->id,
                    'name_uz' => $subData['name']['uz'],
                    'name_ru' => $subData['name']['ru'],
                    'name_eng' => $subData['name']['en'],
                    'slug' => Str::slug($subData['name']['en']) . '-' . Str::random(3),
                    'description_uz' => $subData['name']['uz'] . ' to\'plami',
                    'description_ru' => 'Коллекция ' . $subData['name']['ru'],
                    'description_eng' => 'Collection of ' . $subData['name']['en'],
                    'image' => $subData['image'],
                    'is_active' => true,
                    'sort_order' => $subOrder++,
                ]);

                $this->createProducts($faker, $sub->id, 20, $subData['name'], $subData['image']);
            }
        }
    }

    private function createProducts($faker, $subcatalogId, $count, $subName, $imageUrl)
    {
        for ($k = 0; $k < $count; $k++) {
            $adjEn = $faker->randomElement(['Premium', 'Deluxe', 'New', 'Pro', 'Classic', 'Essential', 'Ultra', 'Smart', 'Eco', 'Luxury']);
            $adjRu = $faker->randomElement(['Премиум', 'Делюкс', 'Новый', 'Про', 'Классический', 'Базовый', 'Ультра', 'Смарт', 'Эко', 'Люкс']);
            $adjUz = $faker->randomElement(['Premium', 'Deluks', 'Yangi', 'Pro', 'Klassik', 'Asosiy', 'Ultra', 'Aqlli', 'Eko', 'Lyuks']);

            $nounEn = Str::singular($subName['en']);
            $nounRu = $subName['ru']; // Approximate
            $nounUz = $subName['uz'];

            $code = $faker->regexify('[A-Z]{2}-[0-9]{3}');

            $nameEn = "$adjEn $nounEn $code";
            $nameRu = "$adjRu $nounRu $code";
            $nameUz = "$adjUz $nounUz $code";
            
            Product::create([
                'subcatalog_id' => $subcatalogId,
                'name_uz' => $nameUz,
                'name_ru' => $nameRu,
                'name_eng' => $nameEn,
                'slug' => Str::slug($nameEn) . '-' . Str::random(5),
                'short_description_uz' => 'Mahsulot uchun o\'zbek tilida qisqacha tavsif.',
                'short_description_ru' => 'Краткое описание на русском языке для продукта.',
                'short_description_eng' => $faker->sentence(10),
                'description_uz' => '<p>Mahsulotning to\'liq tavsifi o\'zbek tilida.</p>',
                'description_ru' => '<p>Полное описание продукта на русском языке.</p>',
                'description_eng' => '<p>' . implode('</p><p>', $faker->paragraphs(2)) . '</p>',
                'price' => $faker->randomFloat(2, 10, 900),
                'old_price' => $faker->boolean(40) ? $faker->randomFloat(2, 950, 1200) : null,
                'stock' => $faker->numberBetween(10, 100),
                'image' => $imageUrl, 
                'is_featured' => $faker->boolean(15),
            ]);
        }
    }
}
