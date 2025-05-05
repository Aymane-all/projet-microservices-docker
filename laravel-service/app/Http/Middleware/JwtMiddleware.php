<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        try {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
            
            // Make user data available in the request
            $request->merge(['user' => $decoded]);
            
            // Check roles if specified
            if (!empty($roles) && !in_array($decoded->role, $roles)) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
            
            return $next($request);
        } catch (Exception $e) {
            return response()->json(['message' => 'Unauthorized: ' . $e->getMessage()], 401);
        }
    }
}