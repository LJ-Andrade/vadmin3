<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;

class UserService
{
    public function list(array $filters = [])
    {
        $query = User::with(['roles', 'media']);

        if ($search = Arr::get($filters, 'search')) {
            $query->where(function ($q) use ($search) {
                $q->where('user',  'like', "%$search%")
                  ->orWhere('first_name','like', "%$search%")
                  ->orWhere('last_name','like', "%$search%")
                  ->orWhere('email','like', "%$search%");
            });
        }

        return $query;
    }

    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $roles = $data['roles'] ?? [];
            $user = User::create(Arr::except($data, ['roles', 'password']) + [
                'password' => bcrypt($data['password']),
            ]);
            if ($roles) {
                $user->syncRoles($roles);
            }
            return $user;
        });
    }

    public function update(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {
            $roles = $data['roles'] ?? null;
            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            }
            $user->update(Arr::except($data, ['roles']));
            if ($roles !== null) {
                $user->syncRoles($roles);
            }
            return $user;
        });
    }

    public function delete(User $user): void
    {
        $user->delete();
    }
}
