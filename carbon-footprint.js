// Carbon Footprint
// form fields
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');

// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');

// respond to user actions
form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));
init();

function init() {
    // Check if user has previously saved API credentials
	const storedApiKey = localStorage.getItem('apiKey');
	const storedRegion = localStorage.getItem('regionName');

    // Set extension icon to generic green (placeholder for future lesson)
	// TODO: Implement icon update in next lesson
	console.log('region:', storedRegion);
    if (storedApiKey === null || storedRegion === null) {
        // First-time user: show the setup form
		form.style.display = 'block';
        results.style.display = 'none';
		loading.style.display = 'none';
		clearBtn.style.display = 'none';
		errors.textContent = '';
    } else {
        // Returning user: load their saved data automatically
        displayCarbonUsage(storedApiKey, storedRegion);
		results.style.display = 'none';
		form.style.display = 'none';
		clearBtn.style.display = 'block';
    }
}

function reset(e) {
    e.preventDefault();
    // Clear stored region to allow user to choose a new location
	localStorage.removeItem('regionName');
	// Restart the initialization process
	init();
}

function handleSubmit(e) {
	e.preventDefault();
	setUpUser(apiKey.value, region.value);
}

function setUpUser(apiKey, regionName) {
    // Save user credentials for future sessions
	localStorage.setItem('apiKey', apiKey);
	localStorage.setItem('regionName', regionName);

    // Update UI to show loading state
	loading.style.display = 'block';
	errors.textContent = '';
	clearBtn.style.display = 'block';

    // Fetch carbon usage data with user's credentials
	displayCarbonUsage(apiKey, regionName);
}

// Modern fetch API approach (no external dependencies needed)
async function displayCarbonUsage(apiKey, region) {
    try {
        // Fetch carbon intensity data from CO2 Signal API
        const response = await fetch('https://api.electricitymaps.com/v4/carbon-intensity/latest',
            {
                method: 'GET',
                headers: {
                    'auth-token': apiKey,
                    'Content-Type': 'application/json'
			    },
                // Add query parameters for the specific region
                ...new URLSearchParams({ countryCode: region }) && {
                    url: `https://api.electricitymaps.com/v4/carbon-intensity/latest?zone=${region}`
                }
            }
        );

        // Check if the API request was successful
		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`);
		}
        console.log(response);
        const carbonData = await response.json();
        console.log('response - carbon intens: ',carbonData);

        // Calculate rounded carbon intensity value
		const carbonIntensity = Math.round(carbonData.carbonIntensity);
        calculateColor(carbonIntensity);
        // Update the user interface with fetched data
		loading.style.display = 'none';
		form.style.display = 'none';
		myregion.textContent = region.toUpperCase();
		usage.textContent = `${carbonIntensity} grams (grams CO₂ emitted per kilowatt hour)`;
		results.style.display = 'block';
    } catch(error){
        console.error('Error fetching carbon data:', error);
        
		// Show user-friendly error message
		loading.style.display = 'none';
		results.style.display = 'none';
		errors.textContent = 'Sorry, we couldn\'t fetch data for that region. Please check your API key and region code.';
    }
}

function calculateColor(value) {
	// Define CO2 intensity scale (grams per kWh)
	const co2Scale = [0, 150, 600, 750, 800];
	// Corresponding colors from green (clean) to dark brown (high carbon)
	const colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];

	// Find the closest scale value to our input
	const closestNum = co2Scale.sort((a, b) => {
		return Math.abs(a - value) - Math.abs(b - value);
	})[0];
	
	console.log(`${value} is closest to ${closestNum}`);
	
	// Find the index for color mapping
	const num = (element) => element > closestNum;
	const scaleIndex = co2Scale.findIndex(num);

	const closestColor = colors[scaleIndex];
	console.log(scaleIndex, closestColor);

	// Send color update message to background script
	//chrome.runtime.sendMessage({ action: 'updateIcon', value: { color: closestColor } });
}