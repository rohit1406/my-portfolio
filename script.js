const routes = {
  "/login": { templateId: "login" },
  "/dashboard": { templateId: "dashboard", init: refresh  },
};

// This holds the current user's account data
// JavaScript Immutability with freeze
let state = Object.freeze({account: null});
const storageKey = 'savedAccount';

/**
 * This method first updates the current URL based on the path given, then updates the template.
 */
function navigate(path) {
  // update the URL in the browser window and create a new entry in the browsing history, without reloading the HTML
  window.history.pushState({}, path, path);
  updateRoute();
}

function updateRoute() {
  // get only the path section from the URL of the browser window
  const path = window.location.pathname;
  const route = routes[path];

  // Before: If a route cannot be found, we'll now redirect to the login page.
  // After persistence impl: Update the default route to take advantage of persistence.
  if (!route) {
    //return navigate("/login");
    return navigate('/dashboard');
  }

  // 3 steps process
  // 1. Retrieve the template element in the DOM
  const template = document.getElementById(route.templateId);
  // 2. Clone the template element
  const view = template.content.cloneNode(true);
  // 3. Attach it to the DOM under a visible element
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(view);

  if (typeof route.init === 'function') {
    route.init();
    }
}

/**
 * a function to get the URL when a link is clicked, and to prevent the browser's default link behavior.
 * The onclick attribute on the <a> tag binds the click event to JavaScript code.
 */
function onLinkClick(event) {
  event.preventDefault();
  //navigate(event.target.href);
  logout();
}

// Modern event-driven form handling
async function register() {
  const registerForm = document.getElementById("registerForm");
  const submitButton = registerForm.querySelector('button[type="submit"]');

  try {
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = "Creating Account...";
    // Process form data
    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData);
    const jsonData = JSON.stringify(data);

    console.log("Form data prepared:", data);

    // Send to server
    const result = await createAccount(jsonData);
    if (result.error) {
      console.error('Registration failed:', result.error);
      //alert(`Registration failed: ${result.error}`);
      return updateElement('registerError', result.error);
    }
    console.log('Account created successfully!', result);
    //alert(`Welcome, ${result.user}! Your account has been created.`);
    // Add these lines at the end of your register function
    updateState('account', result);
    navigate('/dashboard');
    // Reset form after successful registration
    registerForm.reset();
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("An unexpected error occurred. Please try again.");
  } finally {
    // Restore button state
    submitButton.disabled = false;
    submitButton.textContent = "Create Account";
  }
}

// Attach event listener when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission
    register();
  });
});

async function createAccount(account) {
  try {
    const response = await fetch("//localhost:5000/api/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: account,
    });

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Account creation failed:", error);
    return { error: error.message || "Network error occurred" };
  }
}

async function login() {
  const loginForm = document.getElementById('loginForm');
  const user = loginForm.user.value;

  const data = await getAccount(user);

  if (data.error) {
    console.log('loginError', data.error);
    return updateElement('loginError', data.error);
  }

  updateState('account', data);
  navigate('/dashboard');
}

async function getAccount(user) {
  try {
    // encodeURIComponent() to safely handle special characters in URLs,
    // it ensures your message arrives exactly as intended, preventing characters like "#" or "&" from being misinterpreted.
    const response = await fetch('//localhost:5000/api/accounts/' + encodeURIComponent(user));
    return await response.json();
  } catch (error) {
    return { error: error.message || 'Unknown error' };
  }
}

function updateElement(id, textOrNode) {
  const element = document.getElementById(id);
  element.textContent = ''; // Removes all children
  element.append(textOrNode);
}

function updateDashboard() {
    const account = state.account;
    if (!account) {
        return logout();
    }

    updateElement('description', account.description);
    updateElement('balance', account.balance.toFixed(2));
    updateElement('currency', account.currency);

    const transactionsRows = document.createDocumentFragment();
    for (const transaction of account.transactions) {
        const transactionRow = createTransactionRow(transaction);
        transactionsRows.appendChild(transactionRow);
    }
    updateElement('transactions', transactionsRows);
}

function createTransactionRow(transaction) {
    const template = document.getElementById('transaction');
    const transactionRow = template.content.cloneNode(true);
    const tr = transactionRow.querySelector('tr');
    tr.children[0].textContent = transaction.date;
    tr.children[1].textContent = transaction.object;
    tr.children[2].textContent = transaction.amount.toFixed(2);
    return transactionRow;
}

function updateState(property, newData) {
    state = Object.freeze(
        {
            ...state,
            [property]: newData
        }
    );
    console.log(state);
    localStorage.setItem(storageKey, JSON.stringify(state.account));
}

function logout() {
    updateState('account', null);
    navigate('/login');
}

function init() {
    const savedAccount = localStorage.getItem(storageKey);
    if (savedAccount) {
        updateState('account', JSON.parse(savedAccount));
    }

    // Our previous initialization code
    /**
     * Making the Back and Forward Buttons Work:
     * if the state changes (browser url changes by pressing back and forward button) - meaning that we moved to a different URL - the popstate event is triggered
     */
    window.onpopstate = () => updateRoute();
    updateRoute();
}

init();

/**
 * Implement Data Refresh System to handle Data Freshness Problem
 */
async function updateAccountData() {
    const account = state.account;
    if (!account) {
        return logout();
    }

    const data = await getAccount(account.user);
    if (data.error) {
        return logout();
    }

    updateState('account', data);
}

async function refresh() {
  await updateAccountData();
  updateDashboard();
}