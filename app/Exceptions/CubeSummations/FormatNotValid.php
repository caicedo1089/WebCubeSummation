<?php
namespace App\Exceptions\CubeSummations;

use Exception;

class FormatNotValid extends Exception 
{
    protected $message = 'format_not_valid';
    protected $code = 500;
}