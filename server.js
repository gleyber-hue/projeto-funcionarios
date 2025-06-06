const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Adiciona middleware para servir arquivos estáticos

// Configuração da conexão com o MySQL (usando porta 3306)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Gl90Th93@",
    database: "projeto-funcionarios",
    port: 3306  // Adicionando a porta explicitamente
});

// Conectar ao MySQL
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL na porta 3306');
});

// Rota para servir o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Nova rota GET para /funcionarios (listar todos)
app.get('/funcionarios', (req, res) => {
    const query = 'SELECT * FROM funcionarios';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro no MySQL ao buscar funcionários:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Rota para buscar funcionário por ID
app.get('/funcionarios/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM funcionarios WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro no MySQL ao buscar funcionário por ID:', err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }
        res.status(200).json(results[0]);
    });
});

// Rotas da API (mantidas iguais)
app.post('/funcionarios', (req, res) => {
    const { nome, nascimento, sexo, telefone, email, cargo, salario } = req.body;
    
    const query = `
        INSERT INTO funcionarios 
        (nome, nascimento, sexo, telefone, email, cargo, salario) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [nome, nascimento, sexo, telefone, email, cargo, salario], 
        (err, result) => {
            if (err) {
                console.error('Erro no MySQL:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: result.insertId });
        });
});

// Nova rota PUT para /funcionarios/:id (atualizar funcionário)
app.put('/funcionarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, nascimento, sexo, telefone, email, cargo, salario } = req.body;

    const query = `
        UPDATE funcionarios
        SET nome = ?, nascimento = ?, sexo = ?, telefone = ?, email = ?, cargo = ?, salario = ?
        WHERE id = ?
    `;

    db.query(query, [nome, nascimento, sexo, telefone, email, cargo, salario, id],
        (err, result) => {
            if (err) {
                console.error('Erro no MySQL ao atualizar funcionário:', err);
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }
            res.status(200).json({ message: 'Funcionário atualizado com sucesso' });
        });
});

// Nova rota DELETE para /funcionarios/:id (excluir funcionário)
app.delete('/funcionarios/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM funcionarios WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro no MySQL ao excluir funcionário:', err);
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }
        res.status(200).json({ message: 'Funcionário excluído com sucesso' });
    });
});

// Nova rota para lidar com o login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Credenciais hardcoded para teste
    if (username === 'admin' && password === 'admin') {
        res.status(200).json({ message: 'Login bem-sucedido!' });
    } else {
        res.status(401).json({ message: 'Nome de usuário ou senha incorretos.' });
    }
});

const PORT = 3002; // Porta do servidor Node (pode manter diferente da porta do MySQL)
app.listen(PORT, () => {
    console.log(`Servidor Node.js rodando na porta ${PORT}`);
});