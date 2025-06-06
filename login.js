document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            console.log('Status da Resposta do Servidor:', response.status);
            console.log('Resposta OK (2xx):', response.ok);

            const data = await response.json();
            console.log('Dados parseados da resposta:', data);

            if (response.ok) {
                // Redirecionar para a tela de cadastro após o login bem-sucedido
                window.location.href = 'index.html'; 
            } else {
                errorMessage.textContent = data.message || 'Erro no login';
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Erro de rede ou servidor:', error);
            errorMessage.textContent = 'Não foi possível conectar ao servidor.';
            errorMessage.classList.remove('hidden');
        }
    });
    
    // Garante que o errorMessage esteja oculto no carregamento da página
    errorMessage.classList.add('hidden');
});