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
                        <input type="password" class="form-control bg-dark text-light" id="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Sign Up</button>
                </form>
                <button class="btn btn-secondary mt-3" id="login-btn">Login</button>
            </div>
        `;
    }
}
