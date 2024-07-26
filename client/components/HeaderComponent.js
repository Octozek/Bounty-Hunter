class HeaderComponent {
    render() {
        return `
            <header class="d-flex justify-content-between align-items-center mt-4 mb-4">
                <h2>Welcome to Bounty Hunter</h2>
                <div>
                    <button class="btn btn-primary" id="home-btn">Home</button>
                    <button class="btn btn-primary" id="declined-btn">Declined Jobs</button>
                </div>
            </header>
        `;
    }

    addEventListeners() {
        document.getElementById('home-btn').addEventListener('click', async () => {
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
    }
}
