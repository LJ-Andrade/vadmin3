<?php

// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\AIQueryController;
// use Spatie\Permission\Middleware\PermissionMiddleware;


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

Route::post('/ai-query', [ AIQueryController::class, 'handle' ]);
Route::post('/ai-chat', [AIQueryController::class, 'testRawAI']);

// Ruta temporal para debuggear sin autenticación
Route::get('/debug/users/{id}', [UserController::class, 'show']);
Route::post('/debug/users/{id}/avatar', [UserController::class, 'uploadAvatar']);

Route::middleware('auth:api')->group(function () {

    Route::prefix('users')->group(function () {
        Route::get   ('/',     [UserController::class, 'index'  ])->name('users.index');
        Route::post  ('/',     [UserController::class, 'store'  ])->name('users.store');
        Route::get   ('/{id}', [UserController::class, 'show'   ])->name('users.show');
        Route::post   ('/{id}', [UserController::class, 'update' ])->name('users.update');
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('users.destroy');
    });

    
    Route::prefix('roles')->group(function () {
        Route::get   ('/',     [RoleController::class, 'index'  ])->name('roles.index');
        Route::get   ('/{id}', [RoleController::class, 'show'   ])->name('roles.show');
        Route::post  ('/',     [RoleController::class, 'store'  ])->name('roles.store');
        Route::post   ('/{id}', [RoleController::class, 'update' ])->name('roles.update');
        Route::delete('/{id}', [RoleController::class, 'destroy'])->name('roles.destroy');
    });

});
