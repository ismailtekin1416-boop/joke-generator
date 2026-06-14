// API configuration
const API_BASE_URL = 'https://official-joke-api.appspot.com';
let jokeCount = 0;

// DOM elements
const jokeText = document.getElementById('jokeText');
const getJokeBtn = document.getElementById('getJokeBtn');
const copyBtn = document.getElementById('copyBtn');
const categorySelect = document.getElementById('categorySelect');
const jokeCountDisplay = document.getElementById('jokeCount');
const loadingDiv = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');

// Event listeners
getJokeBtn.addEventListener('click', getJoke);
copyBtn.addEventListener('click', copyJoke);

// Get a random joke from the API
async function getJoke() {
    try {
        // Show loading state
        setLoading(true);
        hideError();
        
        // Get selected category
        const category = categorySelect.value;
        
        // Build API URL
        let apiUrl = `${API_BASE_URL}/jokes/random`;
        if (category) {
            apiUrl = `${API_BASE_URL}/jokes/${category}/random`;
        }
        
        // Fetch joke from API
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const joke = await response.json();
        
        // Format the joke
        let jokeString = '';
        if (joke.type === 'two_part') {
            jokeString = `${joke.setup}\n\n${joke.delivery}`;
        } else {
            jokeString = joke.joke;
        }
        
        // Display the joke
        displayJoke(jokeString);
        
        // Increment counter
        jokeCount++;
        jokeCountDisplay.textContent = jokeCount;
        
        // Hide loading state
        setLoading(false);
        
    } catch (error) {
        console.error('Error fetching joke:', error);
        showError('Failed to load joke. Please try again!');
        setLoading(false);
    }
}

// Display joke with animation
function displayJoke(joke) {
    // Add fade-out effect
    jokeText.style.opacity = '0';
    
    // Wait for animation to complete
    setTimeout(() => {
        jokeText.textContent = joke;
        // Fade in with new joke
        jokeText.style.opacity = '1';
    }, 300);
}

// Copy joke to clipboard
function copyJoke() {
    const jokeContent = jokeText.textContent;
    
    if (jokeContent === 'Click the button to get a random joke!') {
        showError('Please load a joke first!');
        return;
    }
    
    // Copy to clipboard using modern API
    navigator.clipboard.writeText(jokeContent).then(() => {
        // Show success feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.background = '#51cf66';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showError('Failed to copy joke to clipboard');
    });
}

// Show loading state
function setLoading(isLoading) {
    if (isLoading) {
        loadingDiv.style.display = 'flex';
        getJokeBtn.disabled = true;
        copyBtn.disabled = true;
        categorySelect.disabled = true;
    } else {
        loadingDiv.style.display = 'none';
        getJokeBtn.disabled = false;
        copyBtn.disabled = false;
        categorySelect.disabled = false;
    }
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
}

// Add smooth fade transition to joke text
jokeText.style.transition = 'opacity 0.3s ease-in-out';

// Load initial joke on page load
window.addEventListener('load', () => {
    getJoke();
});
