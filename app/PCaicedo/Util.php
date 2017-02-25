<?php

namespace App\PCaicedo;

class Util
{
    /**
     * Arma la respuesta JSON
     */
     public static function coreJsonResponse($intCode = 500, $msg = 'not_support', $data = null )
     {
         $result = [
             'msg' => $msg
         ];

         if(!is_null($data))
         {
             $result['data'] = $data;
         }

         return response($result, $intCode);
     }
}
