document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.getElementById('formCadastro');
    const btnVerCadastros = document.getElementById('btnVerCadastros');
    
    formCadastro.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const funcionario = {
            nome: document.getElementById('nome').value,
            nascimento: document.getElementById('nascimento').value,
            sexo: document.querySelector('input[name="sexo"]:checked').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            cargo: document.getElementById('cargo').value,
            salario: parseFloat(document.getElementById('salario').value)
        };
        
        try {
            const response = await fetch('http://localhost:3002/funcionarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(funcionario)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao cadastrar funcionário');
            }
            
            alert('Funcionário cadastrado com sucesso! ID: ' + data.id);
            formCadastro.reset();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao cadastrar: ' + error.message);
        }
    });
    
    btnVerCadastros.addEventListener('click', function() {
        window.location.href = 'cadastros.html';
    });
});