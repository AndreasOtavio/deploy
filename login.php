<?php
    if(!isset($_SESSION['login'])){
        
        if(isset($_POST['acao'])) {
            $login = 'teste';
            $senha = 'teste';

            $loginForm = $_POST['login'];
            $senhaForm = $_POST['senha'];

            if($login == $loginForm && $senha == $senhaForm){
                //logado com sucesso!
                $_SESSION['login'] = true;
                header('Location: profile.html');
            }else{
                //algum erro ocorreu.
                echo 'Dados Inválidos!';
                echo 'Tente novamente.'
            }

        }


        include('login.html');
    }else{
        include('index.html');
    }
?>