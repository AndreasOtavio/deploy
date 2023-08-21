<?php

    $dbHost = 'Localhost';
    $dbUsername = 'root';
    $dbPassword = '';
    $dbName = 'formulario-earthfund';

    $conexao = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

    if($conexao -> connect_erro)
    {
        echo "Erro";
    }else{
        echo "Conectado com sucesso!";
    }


?>