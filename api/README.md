
# Installation

composer require laravel/passport

php artisan migrate:fresh --seed
php artisan passport:install

chmod 600 storage/oauth-private.key
chmod 600 storage/oauth-public.key
