<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EmployerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        if ($request->user()->role !== 'employer') {
            return response()->json([
                'success' => false,
                'message' => 'Access Denied. Employers only.'
            ], 403);
        }

        // Check if employer is approved
        if ($request->user()->employer_status !== 'approved' && !$request->is('api/employer/verify')) {
            return response()->json([
                'success' => false,
                'message' => 'Access Denied. Your employer account is pending approval or has been rejected.',
                'employer_status' => $request->user()->employer_status
            ], 403);
        }

        return $next($request);
    }
}
