<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            // return route('login');
            
            abort(response()->json(
                [
                    "error" => "Unauthentication error",
                    "message" => "Sorry cannot access API route, please sign up or login to access route"
                ], 
            403));
        }
    }
}
