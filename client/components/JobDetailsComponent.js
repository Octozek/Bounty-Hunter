class JobDetailsComponent {
    constructor(job) {
        this.job = job;
    }

    render() {
        return `
            <div class="modal fade" id="jobDetailsModal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${this.job.company}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Job Title:</strong> ${this.job.title}</p>
                            <p><strong>Link:</strong> <a href="${this.job.link}" target="_blank">Click here for link</a></p>
                            <p><strong>Pay:</strong> ${this.job.pay}</p>
                            <p><strong>Date Applied:</strong> ${new Date(this.job.dateApplied).toLocaleDateString()}</p>
                            <p><strong>Job Type:</strong> ${this.job.type}</p>
                            <p><strong>Notes:</strong> ${this.job.notes}</p>
                            ${this.job.resumeText ? `
                                <button class="btn btn-primary" id="view-resume-btn">View Resume</button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
            ${this.job.resumeText ? this.renderResumeModal() : ''}
        `;
    }

    renderResumeModal() {
        return `
            <div class="modal fade" id="resumeModal" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Resume</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" id="resume-content" style="color: white; background-color: #2f3136;">
                            <pre>${this.job.resumeText}</pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        // Ensure jobDetailsModal exists before trying to show it
        const jobDetailsModal = document.getElementById('jobDetailsModal');
        if (jobDetailsModal) {
            $('#jobDetailsModal').modal('show');

            const closeButton = jobDetailsModal.querySelector('.close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    $('#jobDetailsModal').modal('hide');
                });
            }

            if (this.job.resumeText) {
                const viewResumeButton = document.getElementById('view-resume-btn');
                if (viewResumeButton) {
                    viewResumeButton.addEventListener('click', () => {
                        $('#resumeModal').modal('show');
                    });
                }

                // Make sure to get the close button from the resume modal only after it's rendered
                const resumeModal = document.getElementById('resumeModal');
                if (resumeModal) {
                    const closeResumeButton = resumeModal.querySelector('.close');
                    if (closeResumeButton) {
                        closeResumeButton.addEventListener('click', () => {
                            $('#resumeModal').modal('hide');
                        });
                    }
                }
            }
        } else {
            console.error('Job Details Modal not found');
        }
    }
}
