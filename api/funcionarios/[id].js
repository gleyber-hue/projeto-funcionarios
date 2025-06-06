const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: {
        rejectUnauthorized: true
    }
});

module.exports = async (req, res) => {
    // Conectar ao MySQL
    db.connect(err => {
        if (err) {
            console.error('Erro ao conectar ao MySQL (funcionarios/[id].js):', err);
            // Não retornar erro diretamente aqui
        }
        console.log('Conectado ao MySQL via funcionarios/[id].js');
    });

    const { id } = req.query;

    if (req.method === 'GET') {
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
    } else if (req.method === 'PUT') {
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
    } else if (req.method === 'DELETE') {
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
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}; 