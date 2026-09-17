<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Método não permitido."]);
    exit;
}

$nome = trim($_POST['nome'] ?? '');
$telefone = trim($_POST['telefone'] ?? '');
$endereco = trim($_POST['endereco'] ?? '');
$email = trim($_POST['email'] ?? '');

if ($nome === '' || $telefone === '' || $endereco === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos corretamente."]);
    exit;
}

$to = "Cassiomoncorvo@hotmail.com";
$subject = "Novo Cadastro de Voluntário";
$message = "Nome: $nome\nTelefone: $telefone\nEndereço: $endereco\nEmail: $email";
$headers = "From: noreply@seusite.com\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(["success" => true, "message" => "Cadastro enviado com sucesso!"]);
} else {
    echo json_encode(["success" => false, "message" => "Não foi possível enviar o cadastro."]);
}
