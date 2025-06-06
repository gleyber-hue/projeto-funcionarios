const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Use 3306 como padrão se não definido
    ssl: {
        rejectUnauthorized: true // Garante verificação SSL
    }
});

module.exports = async (req, res) => {
    // Conectar ao MySQL
    db.connect(err => {
        if (err) {
            console.error('Erro ao conectar ao MySQL (funcionarios.js):', err);
            // Não retornar erro diretamente aqui, pois a conexão pode ser assíncrona ou em pool
        }
        console.log('Conectado ao MySQL via funcionarios.js');
    });

    if (req.method === 'GET') {
        const query = 'SELECT * FROM funcionarios';
        
        db.query(query, (err, results) => {
            if (err) {
                console.error('Erro no MySQL ao buscar funcionários:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(results);
        });
    } else if (req.method === 'POST') {
        const { nome, nascimento, sexo, telefone, email, cargo, salario } = req.body;
        
        const query = `
            INSERT INTO funcionarios 
            (nome, nascimento, sexo, telefone, email, cargo, salario) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.query(query, [nome, nascimento, sexo, telefone, email, cargo, salario], 
            (err, result) => {
                if (err) {
                    console.error('Erro no MySQL ao cadastrar funcionário:', err);
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ id: result.insertId });
            });
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}; 