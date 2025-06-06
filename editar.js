document.addEventListener('DOMContentLoaded', async function() {
    const formEditar = document.getElementById('formEditar');
    const btnCancelar = document.getElementById('btnCancelarEditar');
    
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    async function carregarFuncionario(id) {
        try {
            const response = await fetch(`http://localhost:3002/funcionarios/${id}`);
            if (!response.ok) throw new Error('Erro ao carregar funcionário');
            console.log(response);
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return null;
        }
    }
    
    const funcionario = await carregarFuncionario(id);
    
    if (!funcionario) {
        alert('Funcionário não encontrado!');
        window.location.href = 'cadastros.html';
        return;
    }
    
    document.getElementById('idEditar').value = funcionario.id;
    document.getElementById('nomeEditar').value = funcionario.nome;
    document.getElementById('nascimentoEditar').value = funcionario.nascimento;
    document.querySelector(`input[name="sexoEditar"][value="${funcionario.sexo}"]`).checked = true;
    document.getElementById('telefoneEditar').value = funcionario.telefone;
    document.getElementById('emailEditar').value = funcionario.email;
    document.getElementById('cargoEditar').value = funcionario.cargo;
    document.getElementById('salarioEditar').value = funcionario.salario;
    
    formEditar.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const dadosAtualizados = {
            nome: document.getElementById('nomeEditar').value,
            nascimento: document.getElementById('nascimentoEditar').value,
            sexo: document.querySelector('input[name="sexoEditar"]:checked').value,
            telefone: document.getElementById('telefoneEditar').value,
            email: document.getElementById('emailEditar').value,
            cargo: document.getElementById('cargoEditar').value,
            salario: parseFloat(document.getElementById('salarioEditar').value)
        };
        
        try {
            const response = await fetch(`http://localhost:3002/funcionarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosAtualizados)
            });
            
            if (response.ok) {
                window.location.href = 'cadastros.html';
            } else {
                throw new Error('Erro ao atualizar funcionário');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao atualizar funcionário');
        }
    });
    
    btnCancelar.addEventListener('click', function() {
        window.location.href = 'cadastros.html';
    });
});