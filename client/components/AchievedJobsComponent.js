class AchievedJobsComponent {
    constructor() {
        this.achievedJobs = [];
        this.selectedJobId = null;
    }

    async fetchAchievedJobs() {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/jobs/achieved', {
            headers: {
                'x-auth-token': token
            }
        });
        this.achievedJobs = await response.json();
    }

    render() {
        const headerComponent = new HeaderComponent('achieved');
        const jobCards = this.renderJobCards();
        const deleteJobModal = this.renderDeleteJobModal();

        return `
            <div>
                ${headerComponent.render()}
                <div class="container mt-4">
                    <h3>Achieved Jobs</h3>
                    <div id="job-list" class="row">
                        ${jobCards}
                    </div>
                </div>
                ${deleteJobModal}
                <div id="job-details-modal-container"></div>
            </div>
        `;
    }

    renderJobCards() {
        return this.achievedJobs.map(job => `
            <div class="col-md-12">
                <div class="card mb-3" data-id="${job._id}">
                    <div class="card-body position-relative">
                        <div class="dropdown position-absolute" style="top: 10px; right: 10px;">
                            <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton${job._id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                &bull;&bull;&bull;
                            </button>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton${job._id}">
                                <a class="dropdown-item delete-job-btn" href="#" data-id="${job._id}">Delete</a>
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
        const headerComponent = new HeaderComponent('achieved');
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

        document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
            if (this.selectedJobId) {
                await this.deleteJob(this.selectedJobId);
                $('#deleteJobModal').modal('hide');
            }
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
                        const job = this.achievedJobs.find(job => job._id === jobId);
                        const jobDetailsComponent = new JobDetailsComponent(job);
                        document.getElementById('job-details-modal-container').innerHTML = jobDetailsComponent.render();
                        jobDetailsComponent.addEventListeners();
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
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to delete job');
            }

            // Remove job from local list and update UI
            this.achievedJobs = this.achievedJobs.filter(job => job._id !== jobId);
            document.querySelector(`.card[data-id="${jobId}"]`).remove();
        } catch (error) {
            console.error('Error deleting job:', error);
            alert(`There was an error deleting the job: ${error.message}. Please try again.`);
        }
    }
}
