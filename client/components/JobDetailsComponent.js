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
                            ${this.job.resumeUrl ? `
                                <button class="btn btn-primary" id="view-resume-btn">View Resume</button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
            ${this.job.resumeUrl ? this.renderResumeModal() : ''}
        `;
    }

    renderResumeModal() {
        return `
            <div class="modal fade" id="resumeModal" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Resume</h5>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body" id="resume-content">
                            <!-- Resume content will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadResumeContent() {
        try {
            const response = await fetch(this.job.resumeUrl);
            const resumeText = await response.text();
            document.getElementById('resume-content').textContent = resumeText;
            $('#resumeModal').modal('show');
        } catch (error) {
            console.error('Error loading resume:', error);
            alert('Failed to load resume content.');
        }
    }

    addEventListeners() {
        $('#jobDetailsModal').modal('show');
        document.querySelector('#jobDetailsModal .close').addEventListener('click', () => {
            $('#jobDetailsModal').modal('hide');
        });

        if (this.job.resumeUrl) {
            document.getElementById('view-resume-btn').addEventListener('click', () => {
                this.loadResumeContent();
            });
        }
    }
}
