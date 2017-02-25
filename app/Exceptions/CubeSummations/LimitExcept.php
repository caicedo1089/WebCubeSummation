<?php
namespace App\Exceptions\CubeSummations;

use Exception;

class LimitExcept extends Exception 
{
    protected $message = 'except_limit';
    protected $code = 500;
}