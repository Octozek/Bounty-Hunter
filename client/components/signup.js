class SignupComponent {
    render() {
        return `
            <div class="container">
                <h2>Sign Up</h2>
                <form id="signup-form">
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" class="form-control" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Sign Up</button>
                </form>
                <button class="btn btn-secondary" id="login-btn">Login</button>
            </div>
        `;
    }
}
