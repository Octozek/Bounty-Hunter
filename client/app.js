document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const token = localStorage.getItem('token');

    if (token) {
        // User is already logged in
        loadMainComponent();
    } else {
        // Show login form by default
        const loginComponent = new LoginComponent();
        app.innerHTML = loginComponent.render();
        attachFormHandlers();
    }

    // Event listeners for navigation buttons
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'signup-btn') {
            const signupComponent = new SignupComponent();
            app.innerHTML = signupComponent.render();
            attachFormHandlers();
        } else if (e.target.id === 'login-btn') {
            const loginComponent = new LoginComponent();
            app.innerHTML = loginComponent.render();
            attachFormHandlers();
        }
    });

    // Clear the token when the user closes the app
    window.addEventListener('beforeunload', () => {
        localStorage.removeItem('token');
    });

    // === Hammer.js Swipe Functionality ===
    // Initialize Hammer.js for swipe detection
    const hammer = new Hammer(document.body);

    hammer.on('swipeleft', () => {
        handleSwipe('left');
    });

    hammer.on('swiperight', () => {
        handleSwipe('right');
    });
});

function attachFormHandlers() {
    console.log('Attaching form handlers...');

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            console.log('Login form submitted:', { email, password });

            // Handle login logic here
            try {
                const response = await fetch(`${window.config.apiUrl}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Login response:', data);

                // Store the token and redirect to the main component
                localStorage.setItem('token', data.token);
                loadMainComponent();
            } catch (error) {
                console.error('Error logging in:', error);
            }
        });
    } else {
        console.log('Login form not found');
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        console.log('Signup form found');
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            console.log('Signup form submitted:', { email, password });

            // Handle signup logic here
            try {
                const response = await fetch(`${window.config.apiUrl}/users/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Signup response:', data);

                // Store the token and redirect to the main component
                localStorage.setItem('token', data.token);
                loadMainComponent();
            } catch (error) {
                console.error('Error signing up:', error);
            }
        });
    } else {
        console.log('Signup form not found');
    }
}

async function loadMainComponent() {
    try {
        const mainComponent = new MainComponent();
        await mainComponent.fetchJobs();
        document.getElementById('app').innerHTML = mainComponent.render();
        mainComponent.addEventListeners();
    } catch (error) {
        console.error('Error loading main component:', error);
        // If a 401 error occurs, redirect to the login page
        const loginComponent = new LoginComponent();
        document.getElementById('app').innerHTML = loginComponent.render();
        attachFormHandlers();
    }
}

// === Swipe Handling for Page Navigation ===
let currentPage = 'pending'; // Start with the pending page

function handleSwipe(direction) {
    if (direction === 'left') {
        if (currentPage === 'pending') goToPage('declined');
        else if (currentPage === 'declined') goToPage('achieved');
        else if (currentPage === 'achieved') goToPage('about');
    } else if (direction === 'right') {
        if (currentPage === 'about') goToPage('achieved');
        else if (currentPage === 'achieved') goToPage('declined');
        else if (currentPage === 'declined') goToPage('pending');
    }
}

function goToPage(page) {
    const app = document.getElementById('app');
    if (page === 'pending') {
        const mainComponent = new MainComponent();
        mainComponent.fetchJobs().then(() => {
            app.innerHTML = mainComponent.render();
            mainComponent.addEventListeners();
        });
    } else if (page === 'declined') {
        const declinedComponent = new DeclinedJobsComponent();
        declinedComponent.fetchDeclinedJobs().then(() => {
            app.innerHTML = declinedComponent.render();
            declinedComponent.addEventListeners();
        });
    } else if (page === 'achieved') {
        const achievedComponent = new AchievedJobsComponent();
        achievedComponent.fetchAchievedJobs().then(() => {
            app.innerHTML = achievedComponent.render();
            achievedComponent.addEventListeners();
        });
    } else if (page === 'about') {
        const aboutComponent = new AboutComponent();
        aboutComponent.fetchUserInfo().then(() => {
            app.innerHTML = aboutComponent.render();
            aboutComponent.addEventListeners();
        });
    }
    currentPage = page;
}
