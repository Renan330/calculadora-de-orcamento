// Aguarda o DOM ser totalmente carregado para iniciar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const incomeInput = document.getElementById('income');
    const expenseForm = document.getElementById('expense-form');
    const expenseDescriptionInput = document.getElementById('expense-description');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseList = document.getElementById('expense-list');

    // Elementos do resumo financeiro
    const totalIncomeDisplay = document.getElementById('total-income');
    const totalExpensesDisplay = document.getElementById('total-expenses');
    const balanceDisplay = document.getElementById('balance');

    // --- ESTADO DA APLICAÇÃO ---
    let totalIncome = 0;
    let expenses = []; // Array de objetos, ex: { id: 1, description: 'Aluguel', amount: 1200 }

    // --- FUNÇÕES ---

    /**
     * Formata um número para o padrão de moeda brasileira (BRL).
     * @param {number} amount - O valor a ser formatado.
     * @returns {string} - O valor formatado como string.
     */
    function formatCurrency(amount) {
        return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    /**
     * Atualiza o resumo financeiro (renda, despesas, saldo) na tela.
     */
    function updateSummary() {
        // Calcula o total de despesas somando os valores do array 'expenses'
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        // Calcula o saldo
        const balance = totalIncome - totalExpenses;

        // Atualiza o HTML com os valores formatados
        totalIncomeDisplay.textContent = formatCurrency(totalIncome);
        totalExpensesDisplay.textContent = formatCurrency(totalExpenses);
        balanceDisplay.textContent = formatCurrency(balance);

        // Muda a cor do saldo com base no valor (positivo ou negativo)
        balanceDisplay.classList.remove('positive', 'negative');
        if (balance >= 0) {
            balanceDisplay.classList.add('positive');
        } else {
            balanceDisplay.classList.add('negative');
        }
    }

    /**
     * Renderiza (desenha) a lista de despesas na tela.
     */
    function renderExpenses() {
        // Limpa a lista atual para evitar duplicatas
        expenseList.innerHTML = '';

        // Cria um elemento <li> para cada despesa no array
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.classList.add('expense-item');
            // Adiciona um atributo 'data-id' para identificar o item
            li.dataset.id = expense.id;

            li.innerHTML = `
                <span>${expense.description}</span>
                <span>${formatCurrency(expense.amount)}</span>
                <button class="btn-delete"><i class="fas fa-trash-alt"></i></button>
            `;
            expenseList.appendChild(li);
        });
    }

    /**
     * Adiciona uma nova despesa.
     * @param {string} description - A descrição da despesa.
     * @param {number} amount - O valor da despesa.
     */
    function addExpense(description, amount) {
        const newExpense = {
            id: Date.now(), // ID único baseado no tempo atual
            description: description,
            amount: amount
        };
        expenses.push(newExpense);
        
        // Atualiza a tela
        renderExpenses();
        updateSummary();
    }

    /**
     * Deleta uma despesa com base no seu ID.
     * @param {number} id - O ID da despesa a ser deletada.
     */
    function deleteExpense(id) {
        // Filtra o array, mantendo apenas as despesas que NÃO têm o ID correspondente
        expenses = expenses.filter(expense => expense.id !== id);
        
        // Atualiza a tela
        renderExpenses();
        updateSummary();
    }

    // --- EVENT LISTENERS (OUVINTES DE EVENTOS) ---

    // Evento para atualizar a renda quando o valor do input muda
    incomeInput.addEventListener('input', (e) => {
        totalIncome = parseFloat(e.target.value) || 0;
        updateSummary();
    });

    // Evento para adicionar uma despesa quando o formulário é enviado
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        const description = expenseDescriptionInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value);

        // Validação simples
        if (description === '' || isNaN(amount) || amount <= 0) {
            alert('Por favor, preencha a descrição e um valor válido para a despesa.');
            return;
        }

        addExpense(description, amount);

        // Limpa os campos do formulário
        expenseDescriptionInput.value = '';
        expenseAmountInput.value = '';
    });

    // Evento para deletar uma despesa (usando delegação de eventos)
    expenseList.addEventListener('click', (e) => {
        // Verifica se o clique foi no botão de deletar ou no seu ícone
        if (e.target.classList.contains('btn-delete') || e.target.closest('.btn-delete')) {
            // Encontra o elemento <li> pai e pega o seu 'data-id'
            const li = e.target.closest('.expense-item');
            const id = parseInt(li.dataset.id);
            deleteExpense(id);
        }
    });

    // --- INICIALIZAÇÃO ---
    // Chama a função para garantir que a tela comece com os valores corretos
    updateSummary();
});
