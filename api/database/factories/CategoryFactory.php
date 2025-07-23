<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition()
    {
        $types = ['Article', 'Product'];
        return [
            'name' => $this->faker->unique()->word(),
            'module' => $this->faker->randomElement($types),
        ];
    }
}
