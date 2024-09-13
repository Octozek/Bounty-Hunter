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
    
    <!-- Portfolio Section -->
    <p><strong>Portfolio:</strong> <a href="${this.userInfo.portfolioLink}">${this.userInfo.portfolioLink}</a> <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.portfolioLink}">Copy</button></p>
    <div class="section-divider"></div>

    <!-- LinkedIn Section -->
    <p><strong>LinkedIn:</strong> <a href="${this.userInfo.linkedinProfile}">${this.userInfo.linkedinProfile}</a> <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.linkedinProfile}">Copy</button></p>
    <div class="section-divider"></div>

    <!-- Facebook Section -->
    <p><strong>Facebook:</strong> <a href="${this.userInfo.facebookProfile}">${this.userInfo.facebookProfile}</a> <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.facebookProfile}">Copy</button></p>
    <div class="section-divider"></div>
    
    <!-- GitHub Section -->
    <p><strong>GitHub:</strong> <a href="${this.userInfo.githubProfile}">${this.userInfo.githubProfile}</a> <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.githubProfile}">Copy</button></p>
    <div class="section-divider"></div>
    
    <!-- Phone Number Section (Displayed like a link) -->
    <p><strong>Phone:</strong> <a href="tel:${this.userInfo.phoneNumber}">${this.userInfo.phoneNumber}</a> <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.phoneNumber}">Copy</button></p>
    <div class="section-divider"></div>

    <!-- Email Section (Displayed like a link) -->
    <p><strong>Email:</strong> <a href="mailto:${this.userInfo.email}">${this.userInfo.email}</a> <button class="btn btn-sm btn-secondary copy-btn" data-copy="${this.userInfo.email}">Copy</button></p>
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
