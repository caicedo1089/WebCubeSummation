<?php

namespace App\Http\Middleware;

use Closure;

class ValidateFormat
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $intCode = 500;
        $result = [
            'msg' => 'format_not_valid'
        ];

        $arrData = $request->json()->all();

        $jsonData = json_encode($arrData);

        if (empty($arrData) || $jsonData === FALSE)
        {
            return response($result, $intCode);
        }

        return $next($request);
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
     protected function execCubeSummation(&$arrData)
     {
         if($arrData[''])
         {

         }
     }
}
