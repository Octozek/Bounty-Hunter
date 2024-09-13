class LoginComponent {
    render() {
        return `
            <div class="container mt-5">
                <h2 class="mb-4">Login</h2>
                <form id="login-form">
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
                    <div id="error-message" class="text-danger mt-2"></div> <!-- Placeholder for error message -->
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
                <button class="btn btn-secondary mt-3" id="signup-btn">Sign Up</button>
            </div>
        `;
    }

    addEventListeners() {
        const togglePassword = document.getElementById('togglePassword');
        const passwordField = document.getElementById('password');

        // Toggle password visibility
        togglePassword.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye-slash');
        });

        // Handle form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const errorMessage = document.getElementById('error-message');

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
                    errorMessage.textContent = 'Wrong email or password. Please try again.'; // Show error message
                }
            });
        }
    }
}
