document.addEventListener('DOMContentLoaded', async function() {
    const listaFuncionarios = document.getElementById('listaFuncionarios');
    const btnVoltar = document.getElementById('btnVoltar');
    
    async function carregarFuncionarios() {
        try {
            const response = await fetch('/api/funcionarios');
            if (!response.ok) {
                throw new Error('Erro ao carregar funcionários');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
            throw error;
        }
    }
    
    async function exibirFuncionarios() {
        let funcionarios = [];
        let loadError = null;

        try {
            funcionarios = await carregarFuncionarios();
        } catch (error) {
            loadError = error;
        }

        const containerFuncionarios = listaFuncionarios; // Agora listaFuncionarios é o container dos cartões
        containerFuncionarios.innerHTML = ''; // Limpa o container
        
        if (loadError) {
            containerFuncionarios.innerHTML = `<p style="color: red;">Erro ao carregar funcionários: ${loadError.message}. Por favor, verifique se o servidor Node.js e o banco de dados MySQL estão em execução.</p>`;
            return;
        }
        
        if (funcionarios.length === 0) {
            containerFuncionarios.innerHTML = '<p>Nenhum funcionário cadastrado.</p>';
            return;
        }
        
        funcionarios.forEach(funcionario => {
            const card = document.createElement('div');
            card.className = 'bg-white p-6 rounded-lg shadow-md flex flex-col justify-between'; // Estilo do cartão
            
            card.innerHTML = `
                <h3 class="text-xl font-semibold mb-2 text-gray-800">${funcionario.nome}</h3>
                <p class="text-gray-700"><span class="font-medium">Nascimento:</span> ${new Date(funcionario.nascimento).toLocaleDateString('pt-BR')}</p>
                <p class="text-gray-700"><span class="font-medium">Sexo:</span> ${funcionario.sexo}</p>
                <p class="text-gray-700"><span class="font-medium">Telefone:</span> ${funcionario.telefone}</p>
                <p class="text-gray-700"><span class="font-medium">E-mail:</span> ${funcionario.email}</p>
                <p class="text-gray-700"><span class="font-medium">Cargo:</span> ${funcionario.cargo}</p>
                <p class="text-gray-700"><span class="font-medium">Salário:</span> R$ ${funcionario.salario}</p>
                <div class="mt-4 flex space-x-2">
                    <button class="btn-editar bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" data-id="${funcionario.id}">Editar</button>
                    <button class="btn-excluir bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" data-id="${funcionario.id}">Excluir</button>
                </div>
            `;
            
            containerFuncionarios.appendChild(card);
        });
        
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                window.location.href = `editar.html?id=${id}`;
            });
        });
        
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este funcionário?')) {
                    try {
                        const response = await fetch(`/api/funcionarios/${id}`, {
                            method: 'DELETE'
                        });
                        
                        if (response.ok) {
                            exibirFuncionarios();
                        } else {
                            throw new Error('Erro ao excluir funcionário');
                        }
                    } catch (error) {
                        console.error('Erro:', error);
                        alert('Erro ao excluir funcionário');
                    }
                }
            });
        });
    }
    
    btnVoltar.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    exibirFuncionarios();
});