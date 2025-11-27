<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
        User::firstOrCreate(
            ['email' => 'teacher@gmail.com'],
            [
                'name' => 'teacher',
                'password' => Hash::make('password'),
                'role' => 'teacher',
            ]
        );
        User::firstOrCreate(
            ['email' => 'teacher2@gmail.com'],
            [
                'name' => 'teacher',
                'password' => Hash::make('password'),
                'role' => 'teacher',
            ]
        );
        User::firstOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'user',
                'password' => Hash::make('password'),
                'role' => 'user',
                'class_name' => 'IT 3A'
            ]
        );
        User::firstOrCreate(
            ['email' => 'user2@gmail.com'],
            [
                'name' => 'user',
                'password' => Hash::make('password'),
                'role' => 'user',
                'class_name' => 'IT 3B'
            ]
        );
    }
}
