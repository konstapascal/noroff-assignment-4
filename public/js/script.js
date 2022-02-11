// Getting the DOM elements

// Buttons
const workButtonElement = document.querySelector('#workButton');
const loanButtonElement = document.querySelector('#loanButton');
const bankButtonElement = document.querySelector('#bankButton');
const repayLoanButtonElement = document.querySelector('#repayLoanButton');

// Balances
const bankBalanceElement = document.querySelector('#bankBalance');
const payBalanceElement = document.querySelector('#payBalance');
const loanBalanceElement = document.querySelector('#loanBalance');

// Computer elements
const computerTitleElement = document.querySelector('#computerTitle');
const computerDesciptionElement = document.querySelector('#computerDescription');
const computerPriceElement = document.querySelector('#computerPrice');
const computerImageElement = document.querySelector('#computerImage');
const computerFeaturesElement = document.querySelector('#laptopFeatures');

const selectElement = document.querySelector('#laptops');

// Getting API data

let computers;
let boughtComputers = [];

const parse = Number.parseInt;

(async () => {
	const BASE_URL = 'https://noroff-komputer-store-api.herokuapp.com';
	const tempComputers = await getComputers(`${BASE_URL}/computers`);

	computers = tempComputers.map(computer => ({
		...computer,
		image: `${BASE_URL}/${computer.image}`
	}));

	addDropdownOptions(computers);

	displayComputer(computers[0]);
	displayComputerFeatures(computers[0]);
})();

async function getComputers(url) {
	const res = await fetch(url);
	const computersJson = await res.json();

	return [...computersJson];
}

function displayComputer(computer) {
	computerTitleElement.innerText = computer.title;
	computerDesciptionElement.innerText = computer.description;
	computerPriceElement.innerText = computer.price;
	computerImageElement.src = computer.image;
}

function displayComputerFeatures(computer) {
	computerFeaturesElement.innerHTML = '';

	for (const feature of computer.specs) {
		const listItem = document.createElement('li');
		const text = document.createTextNode(feature);

		listItem.appendChild(text);
		computerFeaturesElement.append(listItem);
	}
}

function addDropdownOptions(computers) {
	for (const computer of computers) {
		const option = document.createElement('option');
		option.innerText = computer.title;

		selectElement.append(option);
	}
}

function hasUnpaidLoan() {
	return parse(loanBalanceElement.innerText) > 0;
}

// Adding event listeners

workButtonElement.addEventListener('click', e => {
	const prevPayTotal = parse(payBalanceElement.innerText);
	payBalanceElement.innerText = prevPayTotal + 100;
});

bankButtonElement.addEventListener('click', e => {
	const prevBankTotal = parse(bankBalanceElement.innerText);
	const payBalance = parse(payBalanceElement.innerText);

	bankBalanceElement.innerText = prevBankTotal + payBalance;
	payBalanceElement.innerText = 0;
});

loanButtonElement.addEventListener('click', () => {
	if (hasUnpaidLoan()) return console.error('You cannot take another loan!');

	const bankBalance = parse(bankBalanceElement.innerText);
	const loanAmount = window.prompt('Choose your loan amount:');

	if (loanAmount === null || loanAmount === '') return console.error('Please enter a value!');
	if (parse(loanAmount) > bankBalance) return console.error('Loan amount too high!');

	loanBalanceElement.innerText = loanAmount;
	bankBalanceElement.innerText = parse(bankBalance) + parse(loanAmount);

	repayLoanButtonElement.classList.toggle('hidden');
});

selectElement.addEventListener('change', e => {
	const computerTitle = e.target.value;
	const computer = computers.find(computer => computer.title === computerTitle);

	displayComputer(computer);
	displayComputerFeatures(computer);
});

computerImageElement.addEventListener(
	'error',
	event =>
		(event.target.src =
			'https://media.istockphoto.com/vectors/error-icon-vector-illustration-vector-id922024308?k=6&m=922024308&s=612x612&w=0&h=i9EnqwhCGrL08hXRkvF9N0lGFHxJSagZW-jTd1SqlW4=')
);
