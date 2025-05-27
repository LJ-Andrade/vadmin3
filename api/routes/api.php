<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Spatie\Permission\Middleware\PermissionMiddleware;

Route::get('/health', function () {
    return response()->json(["success" => true, "message" => "Server is responding"]);
});

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});


Route::middleware('auth:api')->group(function () {
    Route::prefix('users')->group(function() {
        Route::get('/', [UserController::class, 'index'])
            ->name('users.list')
            ->middleware([PermissionMiddleware::class . ':users.list']);
        Route::post('/', [UserController::class, 'store'])
            ->name('users.store')
            ->middleware([PermissionMiddleware::class . ':users.store']);
        Route::get('/{id}', [UserController::class, 'show'])
            ->name('users.show')
            ->middleware([
                PermissionMiddleware::class . ':users.show',
                'user.exist'
            ]);
        Route::put('/{id}', [UserController::class, 'update'])
            ->name('users.update')
            ->middleware([
                PermissionMiddleware::class . ':users.update',
                'user.exist'
            ]);
        Route::delete('/{id}', [UserController::class, 'delete'])
            ->name('users.delete')
            ->middleware([
                PermissionMiddleware::class . ':users.delete',
                'user.exist',
                'user.is.not.the.same'
            ]);
    });
});
