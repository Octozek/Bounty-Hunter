class LoginComponent {
    render() {
        return `
            <div class="container">
                <h2>Login</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" class="form-control" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
                <button class="btn btn-secondary" id="signup-btn">Sign Up</button>
            </div>
        `;
    }
}
