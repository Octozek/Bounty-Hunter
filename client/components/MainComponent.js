class MainComponent {
    constructor() {
        this.jobs = [];
        this.selectedJobId = null;
    }

    async fetchJobs() {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/jobs', {
            headers: {
                'x-auth-token': token
            }
        });
        this.jobs = await response.json();
    }

    render() {
        const jobCards = this.renderJobCards();

        const deleteJobModal = this.renderDeleteJobModal();
        const addJobComponent = new AddJobComponent();
        const headerComponent = new HeaderComponent();

        return `
            <div>
                ${headerComponent.render()}
                <div class="container">
                    <button class="btn btn-primary mt-4 mb-4" id="add-job-btn" data-toggle="modal" data-target="#addJobModal">Add Job</button>
                    <div id="job-list" class="row">
                        ${jobCards}
                    </div>
                </div>
                ${deleteJobModal}
                ${addJobComponent.render()}
                <div id="job-details-modal-container"></div>
            </div>
        `;
    }

    renderJobCards() {
        return this.jobs.map(job => {
            const jobCardComponent = new JobCardComponent(job);
            return jobCardComponent.render();
        }).join('');
    }

    addEventListeners() {
        const headerComponent = new HeaderComponent();
        headerComponent.addEventListeners();

        document.getElementById('add-job-btn').addEventListener('click', () => {
            $('#addJobModal').modal('show');
        });

        this.attachCardEventListeners();

        document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
            if (this.selectedJobId) {
                await this.deleteJob(this.selectedJobId);
                $('#deleteJobModal').modal('hide');
            }
        });

        const addJobComponent = new AddJobComponent();
        addJobComponent.addEventListeners();

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
                const addToDeclinedBtn = card.querySelector('.add-to-declined-btn');

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

                if (addToDeclinedBtn) {
                    addToDeclinedBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const jobId = e.target.dataset.id;
                        await this.addToDeclined(jobId);
                    });
                }

                card.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('dropdown-toggle') && !e.target.classList.contains('delete-job-btn')) {
                        const jobId = e.currentTarget.dataset.id;
                        const job = this.jobs.find(job => job._id === jobId);
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
            this.jobs = this.jobs.filter(job => job._id !== jobId);
            document.querySelector(`.card[data-id="${jobId}"]`).remove();
        } catch (error) {
            console.error('Error deleting job:', error);
            alert(`There was an error deleting the job: ${error.message}. Please try again.`);
        }
    }

    async addToDeclined(jobId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/decline`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to decline job');
            }

            // Remove job from local list and update UI
            this.jobs = this.jobs.filter(job => job._id !== jobId);
            document.querySelector(`.card[data-id="${jobId}"]`).remove();
        } catch (error) {
            console.error('Error declining job:', error);
            alert(`There was an error declining the job: ${error.message}. Please try again.`);
        }
    }
}
