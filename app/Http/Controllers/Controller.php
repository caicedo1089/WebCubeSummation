<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesResources;

use App\Exceptions\CubeSummations\FormatNotValid;
use App\Exceptions\CubeSummations\FormatNotInt;
use App\Exceptions\CubeSummations\LimitExcept;

class Controller extends BaseController
{
    use AuthorizesRequests, AuthorizesResources, DispatchesJobs, ValidatesRequests;

    //Valida los límites
     protected function coreLimit($int, $limit)
     {
         $intMin = 1;
         $intMax = $limit;

         if(is_array($limit))
         {
            $intMin = $limit[0];
            $intMax = $limit[1];
         }

         return ($int <= $intMax && $int >= $intMin);
     }

     //Valida todo
     protected function coreValid($variable, &$limits, $key)
     {
        $result = 0;
        
        if(!empty($variable))
        {
            if(is_int($variable))
            {   
                if($this->coreLimit($variable, $limits[$key]))
                {
                    $result = $variable;
                }
                else
                {
                    throw new LimitExcept();
                }
            } 
            else
            {
                throw new FormatNotInt();
            } 
        }
        else
        {
            throw new FormatNotValid();
        }

        return $result;
     } 
}
