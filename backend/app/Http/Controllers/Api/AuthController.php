<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //

    public function register(RegisterRequest $request){
        $user = User::create([
            'name'=> $request-> name,
            'email'=> $request-> email,
            'password'=> Hash::make($request->password),
            'role'=> $request->role,
        ]);
        
        if ($user->role === 'candidate') {
            $user->candidateProfile()->create();
        }
            
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success'=>true,
            'message'=>'User registered',
            'token'=>$token,
            'user'=>$user,
        ], 201);
    }

     public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'role' => $user->role,
            'user' => $user,
        ]);
    }

     public function profile()
    {
        return response()->json([
            'success' => true,
            'user' => auth()->user(),
        ]);
    }


public function logout()
    {
        auth()->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    }
