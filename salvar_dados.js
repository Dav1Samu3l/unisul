const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');


function verificarIdentificacao() {
    const identificarSim = document.getElementById('identificarSim');
    const nomeContainer = document.getElementById('nomeContainer');

    if (identificarSim.checked) {
      nomeContainer.style.display = 'block'; // Exibe o campo e o texto
      document.getElementById('nome').required = true; // Torna o campo obrigatório
    } else {
      nomeContainer.style.display = 'none'; // Oculta o campo e o texto
      document.getElementById('nome').required = false; // Remove a obrigatoriedade
    }
  }
  
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Configurações do banco de dados
const servidor = 'localhost';
const usuario = 'seu_usuario';
const senha = 'sua_senha';
const banco = 'nome_do_banco';

// Criando conexão
const conn = mysql.createConnection({
    host: servidor,
    user: usuario,
    password: senha,
    database: banco
});

// Verificando conexão
conn.connect(err => {
    if (err) {
        console.error('Falha na conexão: ' + err.message);
        process.exit(1);
    }
    console.log('Conexão bem-sucedida ao banco de dados.');
});

// Criando tabela no MySQL (caso ainda não exista)
const tabela = `
CREATE TABLE IF NOT EXISTS pesquisa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tema VARCHAR(50) NOT NULL,
    aspectos_positivos TEXT NOT NULL,
    aspectos_melhorias TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

conn.query(tabela, (err, result) => {
    if (err) {
        console.error('Erro ao criar a tabela: ' + err.message);
        process.exit(1);
    }
    console.log("Tabela 'pesquisa' criada ou já existente.");
});

// Rota para receber dados do formulário
app.post('/salvar', (req, res) => {
    const { nome, tema, aspectosPositivos, aspectosMelhorias } = req.body;

    // Inserindo dados no banco
    const sql = `
    INSERT INTO pesquisa (nome, tema, aspectos_positivos, aspectos_melhorias)
    VALUES (?, ?, ?, ?)`;

    conn.query(sql, [nome, tema, aspectosPositivos, aspectosMelhorias], (err, result) => {
        if (err) {
            console.error('Erro ao salvar os dados: ' + err.message);
            res.status(500).send('Erro ao salvar os dados.');
        } else {
            console.log('Dados salvos com sucesso!');
            res.send('Dados salvos com sucesso!');
        }
    });
});

// Iniciando o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});