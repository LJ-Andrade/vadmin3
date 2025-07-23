<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        // Crea 10 categorías aleatorias
        Category::factory()->count(10)->create();

        // Crea algunas categorías fijas
        Category::create(['name' => 'News', 'module' => 'Article']);
        Category::create(['name' => 'Tech', 'module' => 'Article']);
        Category::create(['name' => 'Games', 'module' => 'Product']);
        Category::create(['name' => 'Women', 'module' => 'Product']);
    }
}
