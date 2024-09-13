class SignupComponent {
    render() {
        return `
            <div class="container mt-5">
                <h2 class="mb-4">Sign Up</h2>
                <form id="signup-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control bg-dark text-light" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="password-wrapper">
                            <input type="password" class="form-control bg-dark text-light" id="password" required>
                            <i class="fas fa-eye toggle-password" id="togglePassword"></i>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Sign Up</button>
                </form>
                <button class="btn btn-secondary mt-3" id="login-btn">Login</button>
            </div>
        `;
    }

    addEventListeners() {
        // Attach form submission event
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
                }
            });
        }

        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const passwordField = document.getElementById('password');
        
        if (togglePassword && passwordField) {
            togglePassword.addEventListener('click', () => {
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);
                togglePassword.classList.toggle('fa-eye-slash');
            });
        }

        // Handle the navigation to the login page
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                const loginComponent = new LoginComponent();
                document.getElementById('app').innerHTML = loginComponent.render();
                loginComponent.addEventListeners();
            });
        }
    }
}
