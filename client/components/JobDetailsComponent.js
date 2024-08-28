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
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
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
                            <button type="button" class="close" id="close-resume-modal">&times;</button>
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
        $('#jobDetailsModal').modal('show');

        document.querySelector('#jobDetailsModal .close').addEventListener('click', () => {
            $('#jobDetailsModal').modal('hide');
        });

        if (this.job.resumeText) {
            document.getElementById('view-resume-btn').addEventListener('click', () => {
                $('#resumeModal').modal('show');
            });
        }

        // Close the resume modal and return to the job details modal
        document.getElementById('close-resume-modal').addEventListener('click', () => {
            $('#resumeModal').modal('hide');
        });
    }
}
