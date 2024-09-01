class HeaderComponent {
    constructor(activePage) {
        this.activePage = activePage;
    }

    render() {
        return `
            <header class="d-flex justify-content-between align-items-center p-3 bg-discord-dark text-white">
                <h2>Bounty Hunter</h2>
                <nav>
                    <button class="btn btn-secondary discord-btn ${this.activePage === 'pending' ? 'active' : ''}" id="pending-btn">Pending Jobs</button>
                    <button class="btn btn-secondary discord-btn ${this.activePage === 'declined' ? 'active' : ''}" id="declined-btn">Declined Jobs</button>
                    <button class="btn btn-secondary discord-btn ${this.activePage === 'achieved' ? 'active' : ''}" id="achieved-btn">Achieved Jobs</button>
                    <button class="btn btn-secondary discord-btn ${this.activePage === 'about' ? 'active' : ''}" id="about-btn">About</button>
                    <div class="dropdown">
                        <button class="btn btn-secondary discord-btn dropdown-toggle" id="settings-btn" data-toggle="dropdown">Settings</button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" id="your-info-btn">Your Info</a>
                            <a class="dropdown-item" id="logout-btn">Logout</a>
                        </div>
                    </div>
                </nav>
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

        // Handle dropdown close on click outside
        document.addEventListener('click', (event) => {
            const dropdown = document.querySelector('.dropdown-menu');
            const settingsButton = document.getElementById('settings-btn');

            if (dropdown.style.display === 'block' && !dropdown.contains(event.target) && !settingsButton.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    handleYourInfoClick() {
        $('#settings-btn').dropdown('toggle');  // Close the dropdown
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
        $('#settings-btn').dropdown('toggle');  // Close the dropdown
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
