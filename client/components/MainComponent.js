class MainComponent {
    constructor() {
        this.jobs = [];
        this.filteredJobs = [];
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
        this.filteredJobs = this.jobs;
    }

    render() {
        const headerComponent = new HeaderComponent('pending');
        const jobCards = this.renderJobCards();
        const deleteJobModal = this.renderDeleteJobModal();
        const addJobComponent = new AddJobComponent();

        return `
            <div>
                ${headerComponent.render()}
                <div class="container mt-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3>Pending Jobs</h3>
                        <button class="btn btn-primary discord-btn" id="add-job-btn" data-toggle="modal" data-target="#addJobModal">Add Job</button>
                    </div>
                    <div class="mb-4">
                        <input type="text" id="search-name" class="form-control d-inline-block" style="width: 200px;" placeholder="Search by name">
                        <input type="date" id="search-start-date" class="form-control d-inline-block" style="width: 200px;">
                        <input type="date" id="search-end-date" class="form-control d-inline-block" style="width: 200px;">
                        <button class="btn btn-primary discord-btn" id="search-btn">Search</button>
                    </div>
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
        return this.filteredJobs.map(job => {
            const jobCardComponent = new JobCardComponent(job);
            return jobCardComponent.render();
        }).join('');
    }

    addEventListeners() {
        document.getElementById('add-job-btn').addEventListener('click', () => {
            $('#addJobModal').modal('show');
        });

        document.getElementById('search-btn').addEventListener('click', () => {
            this.filterJobs();
        });

        const headerComponent = new HeaderComponent('pending');
        headerComponent.addEventListeners();

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
                const addToAchievedBtn = card.querySelector('.add-to-achieved-btn');

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

                if (addToAchievedBtn) {
                    addToAchievedBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const jobId = e.target.dataset.id;
                        await this.addToAchieved(jobId);
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
            this.filteredJobs = this.filteredJobs.filter(job => job._id !== jobId);
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
            this.filteredJobs = this.filteredJobs.filter(job => job._id !== jobId);
            document.querySelector(`.card[data-id="${jobId}"]`).remove();
        } catch (error) {
            console.error('Error declining job:', error);
            alert(`There was an error declining the job: ${error.message}. Please try again.`);
        }
    }

    async addToAchieved(jobId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/achieve`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to achieve job');
            }

            // Remove job from local list and update UI
            this.jobs = this.jobs.filter(job => job._id !== jobId);
            this.filteredJobs = this.filteredJobs.filter(job => job._id !== jobId);
            document.querySelector(`.card[data-id="${jobId}"]`).remove();
        } catch (error) {
            console.error('Error achieving job:', error);
            alert(`There was an error achieving the job: ${error.message}. Please try again.`);
        }
    }

    filterJobs() {
        const searchName = document.getElementById('search-name').value.toLowerCase();
        const searchStartDate = document.getElementById('search-start-date').value;
        const searchEndDate = document.getElementById('search-end-date').value;

        this.filteredJobs = this.jobs.filter(job => {
            const jobNameMatch = job.company.toLowerCase().includes(searchName);
            const jobTitleMatch = job.title.toLowerCase().includes(searchName);

            const jobDate = new Date(job.dateApplied);
            const startDate = searchStartDate ? new Date(searchStartDate) : null;
            const endDate = searchEndDate ? new Date(searchEndDate) : null;

            const jobDateMatch = (!startDate || jobDate >= startDate) && (!endDate || jobDate <= endDate);

            return (jobNameMatch || jobTitleMatch) && jobDateMatch;
        });

        document.getElementById('job-list').innerHTML = this.renderJobCards();
        this.attachCardEventListeners();
    }
}
