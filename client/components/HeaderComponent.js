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
    }
}
