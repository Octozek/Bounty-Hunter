document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const loginComponent = new LoginComponent();
    app.innerHTML = loginComponent.render();

    // Initial form handler attachment
    attachFormHandlers();

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
                const response = await fetch('https://bounty-hunter-mfbg.onrender.com/api/users/login', {
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
                const mainComponent = new MainComponent();
                await mainComponent.fetchJobs();
                document.getElementById('app').innerHTML = mainComponent.render();
                mainComponent.addEventListeners();
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
                const response = await fetch('https://bounty-hunter-mfbg.onrender.com/api/users/signup', {
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
                const mainComponent = new MainComponent();
                await mainComponent.fetchJobs();
                document.getElementById('app').innerHTML = mainComponent.render();
                mainComponent.addEventListeners();
            } catch (error) {
                console.error('Error signing up:', error);
            }
        });
    } else {
        console.log('Signup form not found');
    }
}
