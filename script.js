// script.js
document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const expenseIdInput = document.getElementById('expense-id');
    const dateInput = document.getElementById('date');
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');
    const categoryInput = document.getElementById('category');
    const paymentModeInput = document.getElementById('payment-mode');
    const recurringInput = document.getElementById('recurring');
    const beneficiaryInput = document.getElementById('beneficiary');
    const tagsInput = document.getElementById('tags');
    const submitBtn = document.getElementById('submit-btn');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${expense.date} - $${expense.amount} - ${expense.description} - ${expense.category} - ${expense.paymentMode} - ${expense.recurring ? 'Recurring' : 'One-time'} - ${expense.beneficiary} - Tags: ${expense.tags.join(', ')}
                <button class="edit" data-index="${index}">Edit</button>
                <button class="delete" data-index="${index}">Delete</button>
            `;
            expenseList.appendChild(li);
        });
    }

    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const expenseId = expenseIdInput.value;
        const date = dateInput.value;
        const amount = amountInput.value;
        const description = descriptionInput.value;
        const category = categoryInput.value;
        const paymentMode = paymentModeInput.value;
        const recurring = recurringInput.checked;
        const beneficiary = beneficiaryInput.value;
        const tags = tagsInput.value.split(',').map(tag => tag.trim());

        if (expenseId) {
            const index = parseInt(expenseId, 10);
            expenses[index] = { date, amount, description, category, paymentMode, recurring, beneficiary, tags };
            expenseIdInput.value = '';
            submitBtn.textContent = 'Add Expense';
        } else {
            expenses.push({ date, amount, description, category, paymentMode, recurring, beneficiary, tags });
        }

        saveExpenses();
        renderExpenses();
        expenseForm.reset();
    });

    expenseList.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit')) {
            const index = e.target.getAttribute('data-index');
            const expense = expenses[index];
            expenseIdInput.value = index;
            dateInput.value = expense.date;
            amountInput.value = expense.amount;
            descriptionInput.value = expense.description;
            categoryInput.value = expense.category;
            paymentModeInput.value = expense.paymentMode;
            recurringInput.checked = expense.recurring;
            beneficiaryInput.value = expense.beneficiary;
            tagsInput.value = expense.tags.join(', ');
            submitBtn.textContent = 'Update Expense';
        } else if (e.target.classList.contains('delete')) {
            const index = e.target.getAttribute('data-index');
            expenses.splice(index, 1);
            saveExpenses();
            renderExpenses();
        }
    });

    renderExpenses();
});
