<?php
namespace App\Exceptions\CubeSummations;

use Exception;

class FormatNotInt extends Exception 
{
    protected $message = 'format_not_int';
    protected $code = 500;
}