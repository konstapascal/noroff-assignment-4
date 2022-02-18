// Declaring DOM variables
const workButtonElement = document.querySelector('#workButton');
const loanButtonElement = document.querySelector('#loanButton');
const bankButtonElement = document.querySelector('#bankButton');
const repayLoanButtonElement = document.querySelector('#repayLoanButton');
const buyComputerButtonElement = document.querySelector('#buyComputerButton');

const bankBalanceElement = document.querySelector('#bankBalance');
const payBalanceElement = document.querySelector('#payBalance');
const loanBalanceElement = document.querySelector('#loanBalance');

const computerTitleElement = document.querySelector('#computerTitle');
const computerDesciptionElement = document.querySelector('#computerDescription');
const computerPriceElement = document.querySelector('#computerPrice');
const computerImageElement = document.querySelector('#computerImage');
const computerFeaturesElement = document.querySelector('#laptopFeatures');

const selectElement = document.querySelector('#laptops');

// Global computers and bought computers
let computers;
let boughtComputers = [];

// Shortcut for common method within the app
const parse = Number.parseInt;

// Init function
(async () => {
	const BASE_URL = 'https://noroff-komputer-store-api.herokuapp.com';
	const tempComputers = await getComputers(`${BASE_URL}/computers`);

	// Add image links to computers
	computers = tempComputers.map(computer => ({
		...computer,
		image: `${BASE_URL}/${computer.image}`
	}));

	// Populate dropdown and display initial computer
	addDropdownOptions(computers);
	displayComputer(computers[0]);
})();

// Get all computers from the API
async function getComputers(url) {
	const res = await fetch(url);
	const computersJson = await res.json();

	return [...computersJson];
}

// Display a computer to the screen
function displayComputer(computer) {
	// Display info
	computerTitleElement.innerText = computer.title;
	computerDesciptionElement.innerText = computer.description;
	computerPriceElement.innerText = computer.price;
	computerImageElement.src = computer.image;

	// Display features list
	displayComputerFeatures(computer);
}

// For every computer feature, append a list item tag
function displayComputerFeatures(computer) {
	// Reset area of previous items
	computerFeaturesElement.innerHTML = '';

	for (const feature of computer.specs) {
		const listItem = document.createElement('li');
		const text = document.createTextNode(feature);

		listItem.appendChild(text);
		computerFeaturesElement.append(listItem);
	}
}

// For each computer, add a dropdown option
function addDropdownOptions(computers) {
	for (const computer of computers) {
		const option = document.createElement('option');

		option.innerText = computer.title;
		selectElement.append(option);
	}
}

// Simple check to see if user has upaid loan
function hasUnpaidLoan() {
	return parse(loanBalanceElement.innerText) > 0;
}

// Adding event listeners
// Work button
workButtonElement.addEventListener('click', e => {
	const payBalance = parse(payBalanceElement.innerText);

	// Increment pay balance by 100
	payBalanceElement.innerText = payBalance + 100;
});

// Bank button
bankButtonElement.addEventListener('click', e => {
	const bankBalance = parse(bankBalanceElement.innerText);
	const payBalance = parse(payBalanceElement.innerText);

	// If has unpaid loan
	if (hasUnpaidLoan()) {
		const tenPercentOfPay = payBalance * 0.1;
		const payToDeposit = payBalance - tenPercentOfPay;

		// Deposit 90% and pay loan with the rest
		bankBalanceElement.innerText = bankBalance + payToDeposit;
		loanBalanceElement.innerText = parse(loanBalanceElement.innerText) - tenPercentOfPay;
		payBalanceElement.innerText = 0;

		return;
	}

	// If has no unpaid loan, deposit 100% of pay balance
	bankBalanceElement.innerText = bankBalance + payBalance;
	payBalanceElement.innerText = 0;
});

// Loan button
loanButtonElement.addEventListener('click', () => {
	// If has unpaid loan, return error
	if (hasUnpaidLoan()) return console.error('You cannot take another loan!');

	const bankBalance = parse(bankBalanceElement.innerText);
	const loanAmount = window.prompt('Choose your loan amount:');

	// If no amount is given, is too high or is invalid number
	if (isNaN(loanAmount)) return console.error('Please enter a numeric value!');
	if (loanAmount === null || loanAmount === '') return console.error('Please enter a value!');
	if (parse(loanAmount) > bankBalance) return console.error('Loan amount too high!');

	// Get loan
	loanBalanceElement.innerText = loanAmount;
	bankBalanceElement.innerText = parse(bankBalance) + parse(loanAmount);

	// Display repay loan button
	repayLoanButtonElement.classList.toggle('hidden');
});

// Repay loan button
repayLoanButtonElement.addEventListener('click', () => {
	const bankBalance = parse(bankBalanceElement.innerText);
	const payBalance = parse(payBalanceElement.innerText);
	const loanBalance = parse(loanBalanceElement.innerText);

	// If you have have more pay balance than upaid loan
	if (payBalance >= loanBalance) {
		const payToDeposit = payBalance - loanBalance;

		// Deposit the rest of pay after paying off loan
		bankBalanceElement.innerText = bankBalance + payToDeposit;
		payBalanceElement.innerText = 0;
		loanBalanceElement.innerText = 0;

		// Hide button since loan is paid off
		repayLoanButtonElement.classList.toggle('hidden');

		return;
	}

	// if less pay balance than loan
	loanBalanceElement.innerText = loanBalance - payBalance;
	payBalanceElement.innerText = 0;
});

// Buy computer button
buyComputerButtonElement.addEventListener('click', e => {
	const computerPrice = parse(computerPriceElement.innerText);
	const bankBalance = parse(bankBalanceElement.innerText);

	// Not enough money
	if (computerPrice > bankBalance) return console.error('Not enough funds to buy this computer!');

	bankBalanceElement.innerText = bankBalance - computerPrice;

	// Push computer to bought computers array
	// Disable button
	boughtComputers.push(computerTitleElement.innerText);
	buyComputerButtonElement.disabled = true;
});

// Select option dropwdown
selectElement.addEventListener('change', e => {
	const computerTitle = e.target.value;
	// Find the clicked computer in the global computers array
	const computer = computers.find(computer => computer.title === computerTitle);

	// Display computer and its features
	displayComputer(computer);
	displayComputerFeatures(computer);

	// If it has been bought, disable its button
	if (boughtComputers.includes(computerTitle)) {
		buyComputerButtonElement.disabled = true;
		return;
	}

	// Otherwise, enable button
	buyComputerButtonElement.disabled = false;
});

// Set default image if anything goes wrong
computerImageElement.addEventListener(
	'error',
	event =>
		(event.target.src =
			'https://media.istockphoto.com/vectors/error-icon-vector-illustration-vector-id922024308?k=6&m=922024308&s=612x612&w=0&h=i9EnqwhCGrL08hXRkvF9N0lGFHxJSagZW-jTd1SqlW4=')
);
