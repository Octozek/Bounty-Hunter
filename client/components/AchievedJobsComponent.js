class AchievedJobsComponent {
    constructor() {
        this.achievedJobs = [];
        this.filteredAchievedJobs = [];
        this.selectedJobId = null;
        this.showSearchOptions = false;
    }

    async fetchAchievedJobs() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.config.apiUrl}/jobs/achieved`, {
            headers: {
                'x-auth-token': token
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch achieved jobs');
        }
        this.achievedJobs = await response.json();
        this.filteredAchievedJobs = this.achievedJobs;
    }

    render() {
        const headerComponent = new HeaderComponent('achieved');
        const jobCards = this.renderJobCards();
        const deleteJobModal = this.renderDeleteJobModal();

        return `
            <div>
                ${headerComponent.render()}
                <div class="container mt-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3>Achieved Jobs</h3>
                    </div>
                    <div id="job-list-container" class="job-list-container"> <!-- Reusing shared styles for container -->
                        <div id="achieved-job-list" class="job-list"> <!-- Full-width job list -->
                            ${jobCards}
                        </div>
                    </div>
                </div>
                ${deleteJobModal}
                <div id="job-details-modal-container"></div>
            </div>
        `;
    }

    renderJobCards() {
        return this.filteredAchievedJobs.map(job => `
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
    }

    addEventListeners() {
        const pendingBtn = document.getElementById('pending-btn');
        if (pendingBtn) {
            pendingBtn.addEventListener('click', async () => {
                const mainComponent = new MainComponent();
                await mainComponent.fetchJobs();
                document.getElementById('app').innerHTML = mainComponent.render();
                mainComponent.addEventListeners();
            });
        }

        const declinedBtn = document.getElementById('declined-btn');
        if (declinedBtn) {
            declinedBtn.addEventListener('click', async () => {
                const declinedJobsComponent = new DeclinedJobsComponent();
                await declinedJobsComponent.fetchDeclinedJobs();
                document.getElementById('app').innerHTML = declinedJobsComponent.render();
                declinedJobsComponent.addEventListeners();
            });
        }

        const aboutBtn = document.getElementById('about-btn');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', async () => {
                const aboutComponent = new AboutComponent();
                await aboutComponent.fetchUserInfo();
                document.getElementById('app').innerHTML = aboutComponent.render();
                aboutComponent.addEventListeners();
            });
        }

        const toggleSearchBtn = document.getElementById('toggle-search-btn');
        if (toggleSearchBtn) {
            toggleSearchBtn.addEventListener('click', () => {
                const searchOptions = document.getElementById('search-options');
                this.showSearchOptions = !this.showSearchOptions;
                searchOptions.style.display = this.showSearchOptions ? 'block' : 'none';
            });
        }

        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filterJobs();
            });
        }

        this.attachCardEventListeners();

        const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', async () => {
                if (this.selectedJobId) {
                    await this.deleteJob(this.selectedJobId);
                    $('#deleteJobModal').modal('hide');
                }
            });
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                const loginComponent = new LoginComponent();
                document.getElementById('app').innerHTML = loginComponent.render();
                attachFormHandlers();
            });
        }
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
                        $(e.target).next('.dropdown-menu').toggle();
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
                        const job = this.filteredAchievedJobs.find(job => job._id === jobId);
                        if (job) {
                            const jobDetailsComponent = new JobDetailsComponent(job);
                            document.getElementById('job-details-modal-container').innerHTML = jobDetailsComponent.render();
                            jobDetailsComponent.addEventListeners();
                        }
                    }
                });
            });
        }
    }

    renderDeleteJobModal() {
        return `
            <div class="modal fade" id="deleteJobModal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Confirm Deletion</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>Are you sure you want to delete this job?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                            <button type="button" class="btn btn-danger" id="confirm-delete-btn">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async deleteJob(jobId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${window.config.apiUrl}/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to delete job');
            }

            this.achievedJobs = this.achievedJobs.filter(job => job._id !== jobId);
            this.filteredAchievedJobs = this.filteredAchievedJobs.filter(job => job._id !== jobId);
            document.querySelector(`.card[data-id="${jobId}"]`).remove();
        } catch (error) {
            console.error('Error deleting job:', error);
            alert(`There was an error deleting the job: ${error.message}. Please try again.`);
        }
    }

    filterJobs() {
        const searchName = document.getElementById('search-name').value.toLowerCase();
        const searchStartDate = document.getElementById('search-start-date').value;
        const searchEndDate = document.getElementById('search-end-date').value;

        this.filteredAchievedJobs = this.achievedJobs.filter(job => {
            const jobNameMatch = job.company.toLowerCase().includes(searchName) || job.title.toLowerCase().includes(searchName);
            const jobDate = new Date(job.dateApplied);
            const startDate = searchStartDate ? new Date(searchStartDate) : null;
            const endDate = searchEndDate ? new Date(searchEndDate) : null;
            const jobDateMatch = (!startDate || jobDate >= startDate) && (!endDate || jobDate <= endDate);
            return jobNameMatch && jobDateMatch;
        });

        document.getElementById('achieved-job-list').innerHTML = this.renderJobCards();
        this.attachCardEventListeners();
    }
}
