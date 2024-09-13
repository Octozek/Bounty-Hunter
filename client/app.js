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
        loginComponent.addEventListeners(); // Attach the event listeners
    }

    // Event listeners for navigation buttons (between signup and login)
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'signup-btn') {
            const signupComponent = new SignupComponent();
            app.innerHTML = signupComponent.render();
            signupComponent.addEventListeners(); // Attach the event listeners
        } else if (e.target.id === 'login-btn') {
            const loginComponent = new LoginComponent();
            app.innerHTML = loginComponent.render();
            loginComponent.addEventListeners(); // Attach the event listeners
        }
    });

    // Clear the token when the user closes the app
    window.addEventListener('beforeunload', () => {
        localStorage.removeItem('token');
    });
});

function attachFormHandlers() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.createElement('p');
    errorMessage.className = 'text-danger mt-2';

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${window.config.apiUrl}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    throw new Error('Login failed');
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);
                loadMainComponent();
            } catch (error) {
                console.error('Error logging in:', error);
                errorMessage.textContent = 'Wrong email or password. Please try again.';
                loginForm.querySelector('.btn-primary').after(errorMessage);
            }
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${window.config.apiUrl}/users/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    throw new Error('Signup failed');
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);
                loadMainComponent();
            } catch (error) {
                console.error('Error signing up:', error);
                errorMessage.textContent = 'Signup failed. Please try again.';
                signupForm.querySelector('.btn-primary').after(errorMessage);
            }
        });
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
        const loginComponent = new LoginComponent();
        document.getElementById('app').innerHTML = loginComponent.render();
        loginComponent.addEventListeners();
    }
}
