// Getting the DOM elements

const workButtonElement = document.querySelector('#workButton');
const loanButtonElement = document.querySelector('#loanButton');
const bankButtonElement = document.querySelector('#bankButton');

const bankBalanceElement = document.querySelector('#bankBalance');
const payBalanceElement = document.querySelector('#payBalance');

const selectElement = document.querySelector('#laptops');

const computerTitleElement = document.querySelector('#computerTitle');
const computerDesciptionElement = document.querySelector('#computerDescription');
const computerPriceElement = document.querySelector('#computerPrice');
const computerImageElement = document.querySelector('#computerImage');

// Getting API data

const BASE_URL = 'https://noroff-komputer-store-api.herokuapp.com';

let finalComputers;

(async () => {
	const computers = await getComputers(`${BASE_URL}/computers`);
	const imageUrls = getImageUrls(computers);

	finalComputers = computers.map((computer, idx) => ({
		...computer,
		image: imageUrls[idx]
	}));

	addDropdownOptions(finalComputers);
	displayComputer(finalComputers[0]);
})();

async function getComputers(url) {
	const req = await fetch(url);
	const json = await req.json();

	const computers = [...json];

	return computers;
}

function getImageUrls(computers) {
	const computerImages = [];

	for (computer of computers) {
		computerImages.push(`${BASE_URL}/${computer.image}`);
	}

	return computerImages;
}

function displayComputer(computer) {
	computerTitleElement.innerHTML = computer.title;
	computerDesciptionElement.innerHTML = computer.description;
	computerPriceElement.innerHTML = computer.price;
	computerImageElement.src = computer.image;
}

function addDropdownOptions(computers) {
	for (computer of computers) {
		const option = new Option(computer.title);
		selectElement.append(option);
	}
}

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

selectElement.addEventListener('change', e => {
	const computerTitle = e.target.value;
	const computer = finalComputers.find(computer => computer.title === computerTitle);

	displayComputer(computer);
});
