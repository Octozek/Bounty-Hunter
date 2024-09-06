class HeaderComponent {
    constructor(activePage) {
        this.activePage = activePage;
    }

    render() {
        return `
            <header class="bg-discord-dark text-white">
                <h2>Bounty Hunter</h2>
                <nav>
                    <button class="btn btn-secondary discord-btn ${this.activePage === 'pending' ? 'active' : ''}" id="pending-btn">Pending</button>
                    <button class="btn btn-secondary discord-btn ${this.activePage === 'declined' ? 'active' : ''}" id="declined-btn">Declined</button>
                    <button class="btn btn-secondary discord-btn ${this.activePage === 'achieved' ? 'active' : ''}" id="achieved-btn">Achieved</button>
                    <button class="btn btn-secondary discord-btn ${this.activePage === 'about' ? 'active' : ''}" id="about-btn">About</button>
                </nav>
                <button class="btn btn-icon" id="settings-btn">
                    <i class="fas fa-cog"></i> <!-- Settings icon -->
                </button>
                <div class="dropdown-menu" id="settings-menu">
                    <a class="dropdown-item" id="your-info-btn">Your Info</a>
                    <a class="dropdown-item" id="logout-btn">Logout</a>
                </div>
            </header>
        `;
    }



    addEventListeners() {
        document.getElementById('pending-btn').addEventListener('click', async () => {
            const mainComponent = new MainComponent();
            await mainComponent.fetchJobs();
            document.getElementById('app').innerHTML = mainComponent.render();
            mainComponent.addEventListeners();
        });

        document.getElementById('declined-btn').addEventListener('click', async () => {
            const declinedJobsComponent = new DeclinedJobsComponent();
            await declinedJobsComponent.fetchDeclinedJobs();
            document.getElementById('app').innerHTML = declinedJobsComponent.render();
            declinedJobsComponent.addEventListeners();
        });

        document.getElementById('achieved-btn').addEventListener('click', async () => {
            const achievedJobsComponent = new AchievedJobsComponent();
            await achievedJobsComponent.fetchAchievedJobs();
            document.getElementById('app').innerHTML = achievedJobsComponent.render();
            achievedJobsComponent.addEventListeners();
        });

        document.getElementById('about-btn').addEventListener('click', async () => {
            const aboutComponent = new AboutComponent();
            await aboutComponent.fetchUserInfo();
            document.getElementById('app').innerHTML = aboutComponent.render();
            aboutComponent.addEventListeners();
        });

        document.getElementById('your-info-btn').addEventListener('click', () => {
            this.handleYourInfoClick();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogoutClick();
        });

        // Toggle settings dropdown
        document.getElementById('settings-btn').addEventListener('click', () => {
            const settingsMenu = document.getElementById('settings-menu');
            settingsMenu.classList.toggle('show');
        });

        // Handle dropdown close on click outside
        document.addEventListener('click', (event) => {
            const dropdown = document.getElementById('settings-menu');
            const settingsButton = document.getElementById('settings-btn');

            if (dropdown.classList.contains('show') && !dropdown.contains(event.target) && !settingsButton.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    handleYourInfoClick() {
        const settingsMenu = document.getElementById('settings-menu');
        settingsMenu.classList.remove('show');  // Close the dropdown
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
        $('#yourInfoModal').modal('show');

        // Reattach main component event listeners after closing the modal
        $('#yourInfoModal').on('hidden.bs.modal', () => {
            this.reattachMainEventListeners();
        });
    }

    handleLogoutClick() {
        const settingsMenu = document.getElementById('settings-menu');
        settingsMenu.classList.remove('show');  // Close the dropdown
        localStorage.removeItem('token');
        const loginComponent = new LoginComponent();
        document.getElementById('app').innerHTML = loginComponent.render();
        attachFormHandlers();
        this.reattachMainEventListeners();
    }

    reattachMainEventListeners() {
        const mainComponent = new MainComponent();
        mainComponent.addEventListeners();
    }
}
