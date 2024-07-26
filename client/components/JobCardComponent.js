class JobCardComponent {
    constructor(job) {
        this.job = job;
    }

    render() {
        return `
            <div class="col-md-12">
                <div class="card mb-3" data-id="${this.job._id}">
                    <div class="card-body position-relative">
                        <div class="dropdown position-absolute" style="top: 10px; right: 10px;">
                            <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton${this.job._id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                &bull;&bull;&bull;
                            </button>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton${this.job._id}">
                                <a class="dropdown-item delete-job-btn" href="#" data-id="${this.job._id}">Delete</a>
                                <a class="dropdown-item add-to-declined-btn" href="#" data-id="${this.job._id}">Add to Declined</a>
                            </div>
                        </div>
                        <h5 class="card-title">${this.job.company}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${this.job.title}</h6>
                        <p class="card-text"><small>${new Date(this.job.dateApplied).toLocaleDateString()}</small></p>
                    </div>
                </div>
            </div>
        `;
    }
}
