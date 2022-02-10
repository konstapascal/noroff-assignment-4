// Getting the DOM elements

const workButtonElement = document.querySelector('#workButton');
const bankBalanceElement = document.querySelector('#bankBalance');
const payBalanceElement = document.querySelector('#payBalance');
const loanButtonElement = document.querySelector('#loanButton');
const bankButtonElement = document.querySelector('#bankButton');

// Adding event listeners

workButtonElement.addEventListener('click', e => {
	const prevTotal = Number.parseInt(payBalanceElement.innerHTML);
	payBalanceElement.innerHTML = prevTotal + 100;
});

bankButtonElement.addEventListener('click', e => {
	const prevTotal = Number.parseInt(bankBalanceElement.innerHTML);
	const payBalance = Number.parseInt(payBalanceElement.innerHTML);

	bankBalanceElement.innerHTML = prevTotal + payBalance;
	payBalanceElement.innerHTML = 0;
});

// loanButtonElement.addEventListener('click', e => {
// 	const prevTotal = Number.parseInt(payBalanceElement.innerHTML);
// 	payBalanceElement.innerHTML = prevTotal + 100;
// });
