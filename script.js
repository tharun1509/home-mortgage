let calculationData = {};

// CALCULATOR PAGE FUNCTIONS
function calculate() {
    const loanAmount = parseFloat(document.getElementById('loanAmount')?.value);
    const interestRate = parseFloat(document.getElementById('interestRate')?.value);
    const loanTerm = parseFloat(document.getElementById('loanTerm')?.value);

    if (!loanAmount || !interestRate || !loanTerm) {
        alert('Please fill in all fields');
        return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    const monthlyPayment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    calculationData = {
        loanAmount,
        interestRate,
        loanTerm,
        monthlyPayment,
        monthlyRate,
        numPayments
    };

    document.getElementById('monthlyPayment').textContent =
        '$' + monthlyPayment.toFixed(2);
    document.getElementById('result').classList.add('show');
}

function clearForm() {
    document.getElementById('loanAmount').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('loanTerm').value = '';
    document.getElementById('result').classList.remove('show');
    calculationData = {};
}

function viewAmortization() {
    if (!calculationData.monthlyPayment) {
        alert('Please calculate first before viewing amortization');
        return;
    }

    const params = new URLSearchParams({
        loanAmount: calculationData.loanAmount,
        interestRate: calculationData.interestRate,
        loanTerm: calculationData.loanTerm,
        monthlyPayment: calculationData.monthlyPayment,
        monthlyRate: calculationData.monthlyRate,
        numPayments: calculationData.numPayments
    });

    window.location.href = "amortization.html?" + params.toString();
}

// AMORTIZATION PAGE LOGIC
document.addEventListener("DOMContentLoaded", function () {
    if (!window.location.search) return;

    const params = new URLSearchParams(window.location.search);

    const loanAmount = parseFloat(params.get('loanAmount'));
    const interestRate = parseFloat(params.get('interestRate'));
    const loanTerm = parseFloat(params.get('loanTerm'));
    const monthlyPayment = parseFloat(params.get('monthlyPayment'));
    const monthlyRate = parseFloat(params.get('monthlyRate'));
    const numPayments = parseFloat(params.get('numPayments'));

    if (!loanAmount || !monthlyPayment) return;

    document.getElementById('summaryLoan').textContent = '$' + loanAmount.toLocaleString();
    document.getElementById('summaryRate').textContent = interestRate + '%';
    document.getElementById('summaryTerm').textContent = loanTerm + ' years';
    document.getElementById('summaryPayment').textContent = '$' + monthlyPayment.toFixed(2);

    generateSchedule(loanAmount, monthlyPayment, monthlyRate, numPayments);
});

function generateSchedule(loanAmount, monthlyPayment, monthlyRate, numPayments) {
    let balance = loanAmount;
    const tbody = document.getElementById('scheduleBody');

    for (let month = 1; month <= numPayments; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance = balance - principalPayment;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month}</td>
            <td>$${monthlyPayment.toFixed(2)}</td>
            <td>$${principalPayment.toFixed(2)}</td>
            <td>$${interestPayment.toFixed(2)}</td>
            <td>$${Math.max(0, balance).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    }
}

function goBack() {
    window.location.href = "az.html";
}
