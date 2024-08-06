// script.js
document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const expenseIdInput = document.getElementById('expense-id');
    const dateInput = document.getElementById('date');
    const amountInput = document.getElementById('amount');
    const titleInput = document.getElementById('title');
    const categoryInputs = document.getElementsByName('category');
    const newCategoryInput = document.getElementById('new-category');
    const paymentModeInputs = document.getElementsByName('payment-mode');
    const recurringInput = document.getElementById('recurring');
    const beneficiaryInputs = document.getElementsByName('beneficiary');
    const tagsInput = document.getElementById('tags');
    const submitBtn = document.getElementById('submit-btn');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Set default date to today
    dateInput.value = new Date().toISOString().split('T')[0];

    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${expense.date} - $${expense.amount} - ${expense.title} - ${expense.category} - ${expense.paymentMode} - ${expense.recurring ? 'Recurring' : 'One-time'} - ${expense.beneficiary} - Tags: ${expense.tags.join(', ')}
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
        const title = titleInput.value;
        let category = '';
        for (const input of categoryInputs) {
            if (input.checked) {
                category = input.value;
                break;
            }
        }
        if (!category && newCategoryInput.value) {
            category = newCategoryInput.value;
            const newOption = document.createElement('label');
            newOption.innerHTML = `<input type="radio" name="category" value="${category}"> ${category}`;
            document.getElementById('category-options').appendChild(newOption);
        }
        let paymentMode = '';
        for (const input of paymentModeInputs) {
            if (input.checked) {
                paymentMode = input.value;
                break;
            }
        }
        const recurring = recurringInput.checked;
        let beneficiary = '';
        for (const input of beneficiaryInputs) {
            if (input.checked) {
                beneficiary = input.value;
                break;
            }
        }
        const tags = tagsInput.value.split(',').map(tag => tag.trim());

        if (expenseId) {
            const index = parseInt(expenseId, 10);
            expenses[index] = { date, amount, title, category, paymentMode, recurring, beneficiary, tags };
            expenseIdInput.value = '';
            submitBtn.textContent = 'Add Expense';
        } else {
            expenses.push({ date, amount, title, category, paymentMode, recurring, beneficiary, tags });
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
            titleInput.value = expense.title;
            for (const input of categoryInputs) {
                if (input.value === expense.category) {
                    input.checked = true;
                    break;
                }
            }
            newCategoryInput.value = '';
            for (const input of paymentModeInputs) {
                if (input.value === expense.paymentMode) {
                    input.checked = true;
                    break;
                }
            }
            recurringInput.checked = expense.recurring;
            for (const input of beneficiaryInputs) {
                if (input.value === expense.beneficiary) {
                    input.checked = true;
                    break;
                }
            }
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
