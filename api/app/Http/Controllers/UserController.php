<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use App\Traits\CrudOperations;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use CrudOperations;

    public function __construct(private readonly UserService $service) {}

    public function index(Request $request)
    {
        $query = $this->service->list($request->all());

        return $this->respondWithCollection(
            $request,
            $query,
            UserResource::class,
            defaultPerPage: 10
        );
    }

    public function show(User $user)
    {
        return new UserResource($user->load('roles'));
    }

    public function store(Request $request)
    {   
        \Illuminate\Support\Facades\Log::info('ROLE STORE REQUEST:', $request->all());
        
        $validated = $request->validate([
            'username'   => 'required|string|max:255|unique:users,username',
            'email'      => 'required|email|max:255|unique:users,email',
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'password'   => 'required|string|min:8',
            'roles'      => 'array',
        ]);

        $user = $this->service->create($validated);

        return $this->ok(['id' => $user->id], 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'username'   => "sometimes|string|max:255|unique:users,username,{$user->id}",
            'email'      => "sometimes|email|max:255|unique:users,email,{$user->id}",
            'first_name' => 'sometimes|string|max:255',
            'last_name'  => 'sometimes|string|max:255',
            'password'   => 'sometimes|string|min:8',
            'roles'      => 'sometimes|array',
        ]);

        $this->service->update($user, $validated);

        return $this->ok(status: 204);
    }

    public function destroy(User $user)
    {
        $this->service->delete($user);
        return $this->ok(status: 204);
    }
}
