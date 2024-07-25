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
                        <input type="password" class="form-control bg-dark text-light" id="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
                <button class="btn btn-secondary mt-3" id="signup-btn">Sign Up</button>
            </div>
        `;
    }
}
