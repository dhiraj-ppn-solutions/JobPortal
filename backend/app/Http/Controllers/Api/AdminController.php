<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    //
    public function dashboard(){
        return response()->json([
            'success' => true,
            'message' => 'Welcome Admin Dashboard'
        ]);
    }

    public function user(){
        $users = User::select(
            'id ,
            name,
            email,
            role,
            created_at,
            updated_at'
        )->get();       
        return response()->json([
            'success' => true,
            'users' => $users
        ]); 
    }
}
