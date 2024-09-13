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
                    <div class="info-item">
                        <p><strong>Portfolio:</strong></p>
                        <p>${this.userInfo.portfolioLink} <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.portfolioLink}">Copy</button></p>
                    </div>
                    <div class="info-item">
                        <p><strong>LinkedIn:</strong></p>
                        <p>${this.userInfo.linkedinProfile} <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.linkedinProfile}">Copy</button></p>
                    </div>
                    <div class="info-item">
                        <p><strong>Facebook:</strong></p>
                        <p>${this.userInfo.facebookProfile} <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.facebookProfile}">Copy</button></p>
                    </div>
                    <div class="info-item">
                        <p><strong>Phone #:</strong></p>
                        <p>${this.userInfo.phoneNumber} <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.phoneNumber}">Copy</button></p>
                    </div>
                    <div class="info-item">
                        <p><strong>Email:</strong></p>
                        <p>${this.userInfo.email} <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.email}">Copy</button></p>
                    </div>
                    <div class="info-item">
                        <p><strong>GitHub:</strong></p>
                        <p>${this.userInfo.githubProfile} <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.githubProfile}">Copy</button></p>
                    </div>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        // Reattach the header's event listeners
        const headerComponent = new HeaderComponent('about');
        headerComponent.addEventListeners();

        // Add event listeners for copy buttons
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const textToCopy = event.target.getAttribute('data-copy');
                navigator.clipboard.writeText(textToCopy).catch(err => {
                    console.error('Failed to copy text:', err);
                });
            });
        });
    }
}
