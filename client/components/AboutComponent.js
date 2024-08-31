class AboutComponent {
    constructor() {
        this.userInfo = {};
    }

    async fetchUserInfo() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${window.config.apiUrl}/users/user-info`, {
                headers: {
                    'x-auth-token': token,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }

            this.userInfo = await response.json();
            this.render();
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    render() {
        const headerComponent = new HeaderComponent('about');
        return `
            <div>
                ${headerComponent.render()}
                <div class="container mt-4">
                    <h3>About</h3>
                    <p><strong>Portfolio Link:</strong> ${this.userInfo.portfolioLink}</p>
                    <p><strong>LinkedIn Profile:</strong> ${this.userInfo.linkedinProfile}</p>
                    <p><strong>Facebook Profile:</strong> ${this.userInfo.facebookProfile}</p>
                    <p><strong>Phone Number:</strong> ${this.userInfo.phoneNumber}</p>
                    <p><strong>Email:</strong> ${this.userInfo.email}</p>
                    <p><strong>GitHub Profile:</strong> ${this.userInfo.githubProfile}</p>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        // Reattach the header's event listeners
        const headerComponent = new HeaderComponent('about');
        headerComponent.addEventListeners();
    }
}
