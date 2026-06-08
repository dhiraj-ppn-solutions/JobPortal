<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Exception;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => $request->role,
            ]);
            
            if ($user->role === 'candidate') {
                $user->candidateProfile()->create();
            }
                
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'User registered',
                'token'   => $token,
                'user'    => $user,
            ], 201);

        } catch (Exception $e) {
            // Logs the actual error for debugging
            Log::error('Registration Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong during registration.',
                'error'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
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
                'token'   => $token,
                'role'    => $user->role,
                'user'    => $user,
            ]);

        } catch (Exception $e) {
            Log::error('Login Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong during login.',
                'error'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function updateProfile(\Illuminate\Http\Request $request)
    {
        try {
            $user = $request->user();
            
            $request->validate([
                'name' => 'required|string|min:3|max:50',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:6'
            ]);

            $data = [
                'name' => $request->name,
                'email' => $request->email,
            ];

            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            $user->update($data);

            if ($user->role === 'candidate') {
                $user->load('candidateProfile');
            }

            return response()->json([
                'success' => true,
                'message' => 'Account settings updated successfully',
                'user' => $user
            ]);
        } catch (Exception $e) {
            Log::error('Profile Update Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update account settings.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function profile()
    {
        try {
            $user = auth()->user();
            if ($user->role === 'candidate') {
                $user->load('candidateProfile');
            }
            return response()->json([
                'success' => true,
                'user'    => $user,
            ]);
        } catch (Exception $e) {
            Log::error('Profile Retrieval Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Could not retrieve profile.',
            ], 500);
        }
    }

    public function logout()
    {
        try {
            auth()->user()->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (Exception $e) {
            Log::error('Logout Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong during logout.',
            ], 500);
        }
    }
}