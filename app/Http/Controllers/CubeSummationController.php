<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

use App\Http\Requests;

use App\Exceptions\CubeSummations\FormatNotValid;
use App\PCaicedo\Util;

class CubeSummationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Util::coreJsonResponse();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Util::coreJsonResponse();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //Respuesta Genérica
        $result = [];
        $msg = 'format_not_valid';
        $limits = [
            'case' => 50,
            'matrix' => 100,
            'operation' => 1000,
            'update' => [-1000000000, 1000000000],
        ];
        $intCode = 500;

        //Obtenemos la información
        $insRequest = Input::instance();
        $arrData = $insRequest->json()->all();

        //Cargamos la información
        $nroCases = $this->coreValid($arrData['nroCases'], $limits, 'case');
        
        //Cargamos los casos
        $cases = [];
        if(!empty($arrData['cases']))
        {
            $cases = $arrData['cases'];
        }

        //Valido que los nro de casos Coincidan con la data enviada
        if(count($cases) != $nroCases)
        {
            throw new FormatNotValid();
        }

        //Procesamos los casos
        $processCases = [];
        for ($i=0; $i<$nroCases; ++$i)
        {
            $case = $cases[$i];
            $arrMatrix = [];
            
            //Cargamos los datos del caso
            $tamMatrix = $this->coreValid($case['tamMatrix'], $limits, 'matrix');
            //Actualizamos para validar las coordenadas
            $limits['matrix'] = $tamMatrix;

            $nroOperations =  $this->coreValid($case['nroOperations'], $limits, 'operation');

            $operations = [];
            if(!empty($case['operations']))
            {
                $operations = $case['operations']; 
            }

            //Valido que los nro de operaciones Coincidan con la data enviada
            if(count($operations) != $nroOperations)
            {
                throw new FormatNotValid();
            }

            //Inicializamos la matrix con 0
            for($x=0; $x<$tamMatrix; ++$x)
            {
                $arrMatrix[] = [];
                for($y=0; $y<$tamMatrix; ++$y)
                {
                    $arrMatrix[$x][] = [];
                    for($z=0; $z<$tamMatrix; ++$z)
                    {
                        array_push($arrMatrix[$x][$y], 0);
                    }
                }
            }  
            
            //Recorremos las operaciones
            for($k=0; $k<$nroOperations; ++$k)
            {
                $operation = $operations[$k];

                //Procesamos las operaciones y 
                $resultOperation = $this->processOperation($arrMatrix, $operation, $limits);
                
                //Guardamos el resultado
                if(!is_null($resultOperation))
                {
                    array_push(
                        $result,
                        $resultOperation
                    );
                }
            }

            //Ejecución Correcta
            $msg = 'OK';
            $intCode = 200;
        }

        return Util::coreJsonResponse($intCode, $msg, $result);
    }

    /**
     * Display the specified resource.
     *
     * @param  arry  $matrix
     * @param  object  $operation Ej: {type:"type", data []}
     * @return \Illuminate\Http\Response
     */
    protected function processOperation(&$matrix, $operation, &$limits)
    {
        $result = null;

        //Cargamos los datos
        $type = '';
        if(!empty($operation['type']))
        {
            $type = $operation['type'];
        }

        $data = [];
        if(!empty($operation['data']))
        {
            $data = $operation['data'];
        }
        
        //Validamos el tamaño de los arreglos
        if(count($data) != 4 && count($data) != 6)
        {
            throw new FormatNotValid();
        }

        $x1 = $this->coreValid($data[0] , $limits, 'matrix') - 1;
        $y1 = $this->coreValid($data[1] , $limits, 'matrix') - 1;
        $z1 = $this->coreValid($data[2] , $limits, 'matrix') - 1;

        switch ($type)
        {
            case 'UPDATE':
                if(count($data) != 4)
                {
                    throw new FormatNotValid();
                }

                $value = $this->coreValid(array_pop($data) , $limits, 'update');
                $matrix[$x1][$y1][$z1] = $value;
                break;

            case 'QUERY':
                if(count($data) != 6)
                {
                    throw new FormatNotValid();
                }

                $x2 = $this->coreValid($data[3] , $limits, 'matrix');
                $y2 = $this->coreValid($data[4] , $limits, 'matrix');
                $z2 = $this->coreValid($data[5] , $limits, 'matrix');
                
                $result = 0;
                for($x=$x1; $x<$x2; ++$x)
                {   
                    for($y=$y1; $y<$y2; ++$y)
                    {
                        for($z=$z1; $z<$z2; ++$z)
                        {
                            $result += $matrix[$x][$y][$z];
                        }
                    }
                }
                break;
            default:
                throw new FormatNotValid();
                break;
        }

        return $result;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Util::coreJsonResponse();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return Util::coreJsonResponse();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        return Util::coreJsonResponse();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Util::coreJsonResponse();
    }
}
