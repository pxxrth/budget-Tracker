
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const addTransaction = document.getElementById("addTransaction");
const transactionList = document.getElementById("transactionHistory");
const balanceTotal = document.querySelector("#total .totalTab:nth-child(1) .totalNumber");
const incomeTotal = document.querySelector("#total .totalTab:nth-child(2) .totalNumber");
const expensesTotal = document.querySelector("#total .totalTab:nth-child(3) .totalNumber");


let transactions = [];


function init() {
    
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }
    
    renderTransactions();
    updateTotals();
}

function renderTransactions() {
    transactionList.innerHTML = "";
    
    const selectedType = type.value;
    
    const filteredTransactions = transactions.filter(function(transaction) {
        return transaction.type === selectedType;
    });

    if (filteredTransactions.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.textContent = "No transactions to display";
        emptyMessage.style.textAlign = "center";
        emptyMessage.style.padding = "20px";
        emptyMessage.style.color = "#666";
        transactionList.appendChild(emptyMessage);
        return;
    }

    filteredTransactions.forEach(function(transaction) {
        const item = document.createElement("div");
        item.className = "transaction-item " + transaction.type;
        item.innerHTML = `
            <h3 class="transaction-text">${transaction.description}</h3>
            <div class="historyNumber">${transaction.amount}</div>
            <button class="delete-btn" data-id="${transaction.id}">delete</button>
        `;
        transactionList.appendChild(item);
    });
}


function updateTotals() {
    const income = transactions.reduce(function(total, transaction) {
        return transaction.type === "income" ? total + transaction.amount : total;
    }, 0);

    const expenses = transactions.reduce(function(total, transaction) {
        return transaction.type === "expenses" ? total + transaction.amount : total;
    }, 0);

    const balance = income - expenses;

    incomeTotal.textContent = income;
    expensesTotal.textContent = expenses;
    balanceTotal.textContent = balance;
}

addTransaction.addEventListener("click", function() {
    if (!description.value || !amount.value) {
        alert("Please enter both description and amount");
        return;
    }

    const newTransaction = {
        id: Date.now(),
        description: description.value,
        amount: parseFloat(amount.value),
        type: type.value
    };

    transactions.push(newTransaction);
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    renderTransactions();
    updateTotals();

    
    description.value = "";
    amount.value = "";
});


transactionList.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
        const id = parseInt(e.target.getAttribute("data-id"));
        transactions = transactions.filter(function(transaction) {
            return transaction.id !== id;
        });
        
        
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        renderTransactions();
        updateTotals();
    }
});


type.addEventListener("change", function() {
    renderTransactions();
});

init();