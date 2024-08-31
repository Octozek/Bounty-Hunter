class SettingsComponent {
    constructor() {
        this.isOpen = false;
    }

    render() {
        return `
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" id="settings-btn">Settings</button>
                <div class="dropdown-menu">
                    <button class="dropdown-item" id="your-info-btn">Your Info</button>
                    <button class="dropdown-item" id="logout-btn">Log out</button>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        document.getElementById('settings-btn').addEventListener('click', () => this.toggleDropdown());

        document.getElementById('your-info-btn').addEventListener('click', () => {
            this.closeDropdown();  // Ensure dropdown closes
            this.openYourInfoModal();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.closeDropdown();  // Ensure dropdown closes
            this.logout();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            const dropdownMenu = document.querySelector('.dropdown-menu');
            if (this.isOpen && !dropdownMenu.contains(event.target) && !document.getElementById('settings-btn').contains(event.target)) {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        const dropdownMenu = document.querySelector('.dropdown-menu');
        this.isOpen = !this.isOpen;
        dropdownMenu.classList.toggle('show', this.isOpen);
    }

    closeDropdown() {
        const dropdownMenu = document.querySelector('.dropdown-menu');
        dropdownMenu.classList.remove('show');
        this.isOpen = false;
    }

    openYourInfoModal() {
        // Check if modal already exists
        if (!document.getElementById('yourInfoModal')) {
            const yourInfoComponent = new YourInfoComponent({
                portfolioLink: '',
                linkedinProfile: '',
                facebookProfile: '',
                phoneNumber: '',
                email: '',
                githubProfile: ''
            });
            document.getElementById('app').innerHTML += yourInfoComponent.render();
            yourInfoComponent.addEventListeners();
        }
        $('#yourInfoModal').modal('show');
    }

    logout() {
        localStorage.removeItem('token');
        window.location.reload(); // Refresh the page to reset the application state
    }
}
