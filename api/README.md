
# Installation

composer require laravel/passport

php artisan migrate:fresh --seed
php artisan passport:install

chmod 600 storage/oauth-private.key
chmod 600 storage/oauth-public.key

php artisan passport:client --personal


Manejo de imagenes
composer require spatie/laravel-medialibrary
php artisan vendor:publish --provider="Spatie\MediaLibrary\MediaLibraryServiceProvider" --tag="medialibrary-migrations"
php artisan migrate
php artisan storage:link