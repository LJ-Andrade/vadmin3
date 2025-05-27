<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $login = $request->input('user');
        $password = $request->input('password');
        
        if (empty($login) || empty($password)) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario y contraseña requeridos',
            ], 422);
        }

        // Intentar login por username primero, luego por email
        $credentialsUsername = ['user' => $login, 'password' => $password];
        $credentialsEmail    = ['email'    => $login, 'password' => $password];

        if (Auth::attempt($credentialsUsername)) {
            $user = Auth::user();
        } elseif (Auth::attempt($credentialsEmail)) {
            $user = Auth::user();
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales inválidas',
            ], 401);
        }

        $user = $request->user();

        $tokenResult = $user->createToken('Personal Access Token');

        return response()->json([
            'data' => [
                'id'          => $user->id,
                'roles'       => $user->getRoleNames(),
                'user'        => $user->user,
                'email'       => $user->email,
                'first_name'  => $user->first_name,
                'last_name'   => $user->last_name,
                'avatar'      => $user->avatar,
                'client'      => $user->client,
                'customer'    => $user->customer,
                'created_at'  => $user->created_at->timestamp,
            ],
            'token' => [
                'access_token' => $tokenResult->accessToken,
                'token_type'   => 'Bearer',
                'expires_at'   => $tokenResult->token->expires_at ? $tokenResult->token->expires_at->timestamp : null,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return response()->json([
            'success' => true,
            'status'  => true,
            'message' => 'Success',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'id'          => $user->id,
                'roles'       => $user->roles->pluck('name'), // Ajusta según tu relación
                'user'        => $user->user,
                'email'       => $user->email,
                'first_name'  => $user->first_name,
                'last_name'   => $user->last_name,
                'avatar'      => $user->avatar,
                'client'      => $user->client,
                'customer'    => $user->customer,
                'created_at'  => $user->created_at->timestamp,
            ],
        ]);
    }
}
