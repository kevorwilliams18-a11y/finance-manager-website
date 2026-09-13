class FinanceManager {
    constructor() {
        this.income = JSON.parse(localStorage.getItem('income')) || [];
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.budgets = JSON.parse(localStorage.getItem('budgets')) || [];
        this.debts = JSON.parse(localStorage.getItem('debts')) || [];
        this.goals = JSON.parse(localStorage.getItem('goals')) || [];
        this.incomeChart = null;
        this.expenseChart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAllDisplays();
    }

    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        document.getElementById('incomeForm').addEventListener('submit', (e) => this.addIncome(e));
        document.getElementById('expenseForm').addEventListener('submit', (e) => this.addExpense(e));
        document.getElementById('budgetForm').addEventListener('submit', (e) => this.addBudget(e));
        document.getElementById('debtForm').addEventListener('submit', (e) => this.addDebt(e));
        document.getElementById('taxForm').addEventListener('submit', (e) => this.calculateTaxes(e));
        document.getElementById('goalForm').addEventListener('submit', (e) => this.addGoal(e));
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
        event.target.classList.add('active');

        if (tabName === 'overview') {
            setTimeout(() => this.updateCharts(), 100);
        }
    }

    addIncome(e) {
        e.preventDefault();
        const income = {
            id: Date.now(),
            source: document.getElementById('incomeSource').value,
            amount: parseFloat(document.getElementById('incomeAmount').value),
            frequency: document.getElementById('incomeFrequency').value,
            date: document.getElementById('incomeDate').value
        };
        this.income.push(income);
        this.saveData();
        e.target.reset();
        this.updateAllDisplays();
    }

    addExpense(e) {
        e.preventDefault();
        const expense = {
            id: Date.now(),
            category: document.getElementById('expenseCategory').value,
            description: document.getElementById('expenseDesc').value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            type: document.getElementById('expenseType').value,
            date: document.getElementById('expenseDate').value
        };
        this.expenses.push(expense);
        this.saveData();
        e.target.reset();
        this.updateAllDisplays();
    }

    addBudget(e) {
        e.preventDefault();
        const budget = {
            id: Date.now(),
            category: document.getElementById('budgetCategory').value,
            limit: parseFloat(document.getElementById('budgetLimit').value)
        };
        this.budgets.push(budget);
        this.saveData();
        e.target.reset();
        this.updateAllDisplays();
    }

    addDebt(e) {
        e.preventDefault();
        const debt = {
            id: Date.now(),
            name: document.getElementById('debtName').value,
            amount: parseFloat(document.getElementById('debtAmount').value),
            rate: parseFloat(document.getElementById('debtRate').value),
            payment: parseFloat(document.getElementById('debtPayment').value),
            date: document.getElementById('debtDate').value
        };
        this.debts.push(debt);
        this.saveData();
        e.target.reset();
        this.updateAllDisplays();
    }

    addGoal(e) {
        e.preventDefault();
        const goal = {
            id: Date.now(),
            name: document.getElementById('goalName').value,
            target: parseFloat(document.getElementById('goalAmount').value),
            current: parseFloat(document.getElementById('goalSavings').value),
            deadline: document.getElementById('goalDeadline').value
        };
        this.goals.push(goal);
        this.saveData();
        e.target.reset();
        this.updateAllDisplays();
    }

    calculateTaxes(e) {
        e.preventDefault();
        const grossIncome = parseFloat(document.getElementById('grossIncome').value);
        const taxRate = parseFloat(document.getElementById('taxBracket').value);
        const deductions = parseFloat(document.getElementById('deductions').value);

        const taxableIncome = Math.max(0, grossIncome - deductions);
        const federalTax = taxableIncome * taxRate;
        const stateTax = taxableIncome * 0.05;
        const socialSecurity = grossIncome * 0.062;
        const medicare = grossIncome * 0.0145;
        const totalTax = federalTax + stateTax + socialSecurity + medicare;
        const netIncome = grossIncome - totalTax;
        const effectiveRate = (totalTax / grossIncome * 100).toFixed(2);

        const resultsHTML = `
            <div class="tax-item">
                <span>Gross Income:</span>
                <span>$${grossIncome.toFixed(2)}</span>
            </div>
            <div class="tax-item">
                <span>Deductions:</span>
                <span>$${deductions.toFixed(2)}</span>
            </div>
            <div class="tax-item">
                <span>Taxable Income:</span>
                <span>$${taxableIncome.toFixed(2)}</span>
            </div>
            <div class="tax-item">
                <span>Federal Tax:</span>
                <span>$${federalTax.toFixed(2)}</span>
            </div>
            <div class="tax-item">
                <span>State Tax:</span>
                <span>$${stateTax.toFixed(2)}</span>
            </div>
            <div class="tax-item">
                <span>Social Security (6.2%):</span>
                <span>$${socialSecurity.toFixed(2)}</span>
            </div>
            <div class="tax-item">
                <span>Medicare (1.45%):</span>
                <span>$${medicare.toFixed(2)}</span>
            </div>
            <div class="tax-item" style="border-left-color: #e74c3c; background: #ffe0e0;">
                <span><strong>Total Tax Liability:</strong></span>
                <span><strong>$${totalTax.toFixed(2)}</strong></span>
            </div>
            <div class="tax-item" style="border-left-color: #27ae60; background: #e0ffe0;">
                <span><strong>Net Income (Take Home):</strong></span>
                <span><strong>$${netIncome.toFixed(2)}</strong></span>
            </div>
            <div class="tax-item">
                <span>Effective Tax Rate:</span>
                <span>${effectiveRate}%</span>
            </div>
        `;

        document.getElementById('taxResultsContent').innerHTML = resultsHTML;
        document.getElementById('taxResults').style.display = 'block';
    }

    updateAllDisplays() {
        this.updateOverview();
        this.updateIncomeTable();
        this.updateExpenseTable();
        this.updateBudgetStatus();
        this.updateDebtTable();
        this.updateGoalsList();
        this.updateCharts();
    }

    updateOverview() {
        const monthlyIncome = this.income.filter(i => i.frequency === 'monthly').reduce((sum, i) => sum + i.amount, 0);
        const yearlyIncome = this.income.filter(i => i.frequency === 'yearly').reduce((sum, i) => sum + i.amount, 0) / 12;
        const oneTimeIncome = this.income.filter(i => i.frequency === 'oneTime').reduce((sum, i) => sum + i.amount, 0);
        const weeklyIncome = this.income.filter(i => i.frequency === 'weekly').reduce((sum, i) => sum + (i.amount * 4.33), 0);

        const totalIncome = monthlyIncome + yearlyIncome + oneTimeIncome + weeklyIncome;
        const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalDebt = this.debts.reduce((sum, d) => sum + d.amount, 0);
        const totalTax = this.calculateEstimatedTax(totalIncome);
        const netBalance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

        document.getElementById('totalIncome').textContent = '$' + totalIncome.toFixed(2);
        document.getElementById('totalExpenses').textContent = '$' + totalExpenses.toFixed(2);
        document.getElementById('totalDebt').textContent = '$' + totalDebt.toFixed(2);
        document.getElementById('netBalance').textContent = '$' + netBalance.toFixed(2);
        document.getElementById('totalTax').textContent = '$' + totalTax.toFixed(2);
        document.getElementById('savingsRate').textContent = savingsRate + '%';
    }

    calculateEstimatedTax(income) {
        return income === 0 ? 0 : income * 0.25;
    }

    updateIncomeTable() {
        const tbody = document.querySelector('#incomeTable tbody');
        tbody.innerHTML = '';
        this.income.forEach(inc => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${inc.source}</td>
                <td>$${inc.amount.toFixed(2)}</td>
                <td>${inc.frequency}</td>
                <td>${inc.date}</td>
                <td><button class="btn-danger" onclick="app.deleteIncome(${inc.id})">Delete</button></td>
            `;
        });
    }

    updateExpenseTable() {
        const tbody = document.querySelector('#expenseTable tbody');
        tbody.innerHTML = '';
        this.expenses.forEach(exp => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${exp.category}</td>
                <td>${exp.description}</td>
                <td>$${exp.amount.toFixed(2)}</td>
                <td>${exp.type}</td>
                <td>${exp.date}</td>
                <td><button class="btn-danger" onclick="app.deleteExpense(${exp.id})">Delete</button></td>
            `;
        });
    }

    updateBudgetStatus() {
        const container = document.getElementById('budgetStatus');
        container.innerHTML = '';
        this.budgets.forEach(budget => {
            const spent = this.expenses.filter(e => e.category === budget.category).reduce((sum, e) => sum + e.amount, 0);
            const percentage = (spent / budget.limit * 100).toFixed(1);
            const color = spent > budget.limit ? '#e74c3c' : '#27ae60';

            const div = document.createElement('div');
            div.className = 'budget-item';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong>${budget.category}</strong>
                    <span>$${spent.toFixed(2)} / $${budget.limit.toFixed(2)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background-color: ${color};"></div>
                </div>
                <small style="color: #666; margin-top: 5px; display: block;">${percentage}%</small>
                <button class="btn-danger" onclick="app.deleteBudget(${budget.id})" style="margin-top: 10px;">Delete Budget</button>
            `;
            container.appendChild(div);
        });
    }

    updateDebtTable() {
        const tbody = document.querySelector('#debtTable tbody');
        tbody.innerHTML = '';
        this.debts.forEach(debt => {
            const monthsToPayoff = Math.ceil(debt.amount / debt.payment);
            const payoffDate = new Date();
            payoffDate.setMonth(payoffDate.getMonth() + monthsToPayoff);
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${debt.name}</td>
                <td>$${debt.amount.toFixed(2)}</td>
                <td>${debt.rate.toFixed(2)}%</td>
                <td>$${debt.payment.toFixed(2)}</td>
                <td>${payoffDate.toLocaleDateString()}</td>
                <td><button class="btn-danger" onclick="app.deleteDebt(${debt.id})">Delete</button></td>
            `;
        });
    }

    updateGoalsList() {
        const container = document.getElementById('goalsList');
        container.innerHTML = '';
        this.goals.forEach(goal => {
            const percentage = (goal.current / goal.target * 100).toFixed(1);
            const remaining = (goal.target - goal.current).toFixed(2);
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

            const div = document.createElement('div');
            div.className = 'goal-item';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong>${goal.name}</strong>
                    <span style="color: #667eea;">$${goal.current.toFixed(2)} / $${goal.target.toFixed(2)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.9em; color: #666;">
                    <span>${percentage}% Complete</span>
                    <span>$${remaining} remaining</span>
                    <span>${daysLeft} days left</span>
                </div>
                <button class="btn-danger" onclick="app.deleteGoal(${goal.id})" style="margin-top: 10px; width: 100%;">Delete Goal</button>
            `;
            container.appendChild(div);
        });
    }

    updateCharts() {
        this.updateIncomeExpenseChart();
        this.updateExpenseChart();
    }

    updateIncomeExpenseChart() {
        const canvas = document.getElementById('incomeExpenseChart');
        const ctx = canvas.getContext('2d');
        const totalIncome = this.income.reduce((sum, i) => sum + i.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);

        if (this.incomeChart) this.incomeChart.destroy();

        this.incomeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{ label: 'Amount', data: [totalIncome, totalExpenses], backgroundColor: ['#27ae60', '#e74c3c'], borderRadius: 8 }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    updateExpenseChart() {
        const canvas = document.getElementById('expenseChart');
        const ctx = canvas.getContext('2d');
        const expenseByType = {};
        this.expenses.forEach(exp => {
            expenseByType[exp.type] = (expenseByType[exp.type] || 0) + exp.amount;
        });

        const labels = Object.keys(expenseByType);
        const data = Object.values(expenseByType);
        const colors = ['#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#c0392b'];

        if (this.expenseChart) this.expenseChart.destroy();

        this.expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{ data: data, backgroundColor: colors.slice(0, labels.length), borderColor: '#fff', borderWidth: 2 }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    deleteIncome(id) {
        this.income = this.income.filter(i => i.id !== id);
        this.saveData();
        this.updateAllDisplays();
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.saveData();
        this.updateAllDisplays();
    }

    deleteBudget(id) {
        this.budgets = this.budgets.filter(b => b.id !== id);
        this.saveData();
        this.updateAllDisplays();
    }

    deleteDebt(id) {
        this.debts = this.debts.filter(d => d.id !== id);
        this.saveData();
        this.updateAllDisplays();
    }

    deleteGoal(id) {
        this.goals = this.goals.filter(g => g.id !== id);
        this.saveData();
        this.updateAllDisplays();
    }

    saveData() {
        localStorage.setItem('income', JSON.stringify(this.income));
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
        localStorage.setItem('debts', JSON.stringify(this.debts));
        localStorage.setItem('goals', JSON.stringify(this.goals));
    }
}

const app = new FinanceManager();