class DeclinedJobsComponent {
    constructor() {
        this.declinedJobs = [];
    }

    async fetchDeclinedJobs() {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/jobs/declined', {
            headers: {
                'x-auth-token': token
            }
        });
        this.declinedJobs = await response.json();
    }

    render() {
        const jobCards = this.declinedJobs.map(job => `
            <div class="col-md-12">
                <div class="card mb-3" data-id="${job._id}">
                    <div class="card-body position-relative">
                        <div class="dropdown position-absolute" style="top: 10px; right: 10px;">
                            <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton${job._id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                &bull;&bull;&bull;
                            </button>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton${job._id}">
                                <a class="dropdown-item delete-job-btn" href="#" data-id="${job._id}">Delete Job</a>
                            </div>
                        </div>
                        <h5 class="card-title">${job.company}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${job.title}</h6>
                        <p class="card-text"><small>${new Date(job.dateApplied).toLocaleDateString()}</small></p>
                    </div>
                </div>
            </div>
        `).join('');

        const headerComponent = new HeaderComponent();

        return `
            <div>
                ${headerComponent.render()}
                <div class="container">
                    <div id="job-list" class="row">
                        ${jobCards}
                    </div>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        const headerComponent = new HeaderComponent();
        headerComponent.addEventListeners();

        this.attachCardEventListeners();

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                if (dropdown.style.display === 'block' && !dropdown.contains(event.target)) {
                    dropdown.style.display = 'none';
                }
            });
        });
    }

    attachCardEventListeners() {
        const cards = document.querySelectorAll('.card');
        if (cards) {
            cards.forEach(card => {
                const dropdownToggle = card.querySelector('.dropdown-toggle');
                const deleteJobBtn = card.querySelector('.delete-job-btn');

                if (dropdownToggle) {
                    dropdownToggle.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const dropdownMenu = e.target.nextElementSibling;
                        if (dropdownMenu) {
                            dropdownMenu.style.display = 'block';
                        }
                    });
                }

                if (deleteJobBtn) {
                    deleteJobBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.selectedJobId = e.target.dataset.id;
                        $('#deleteJobModal').modal('show');
                    });
                }

                card.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('dropdown-toggle') && !e.target.classList.contains('delete-job-btn')) {
                        const jobId = e.currentTarget.dataset.id;
                        const job = this.declinedJobs.find(job => job._id === jobId);
                        const jobDetailsComponent = new JobDetailsComponent(job);
                        document.getElementById('job-details-modal-container').innerHTML = jobDetailsComponent.render();
                        jobDetailsComponent.addEventListeners();
                    }
                });
            });
        }
    }
}
