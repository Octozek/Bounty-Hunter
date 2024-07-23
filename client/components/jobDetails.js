class JobDetailsComponent {
    constructor(job) {
        this.job = job;
    }

    render() {
        return `
            <div class="modal" id="jobDetailsModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${this.job.company}</h5>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Job Title:</strong> ${this.job.title}</p>
                            <p><strong>Link:</strong> <a href="${this.job.link}" target="_blank">${this.job.link}</a></p>
                            <p><strong>Pay:</strong> ${this.job.pay}</p>
                            <p><strong>Date Applied:</strong> ${this.job.dateApplied}</p>
                            <p><strong>Job Type:</strong> ${this.job.type}</p>
                            <img src="${this.job.image}" class="img-fluid">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
