module.exports = (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
        res.status(200).json({ message: 'Login bem-sucedido!' });
    } else {
        res.status(401).json({ message: 'Nome de usuário ou senha incorretos.' });
    }
}; 