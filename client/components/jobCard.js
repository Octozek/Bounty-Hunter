class JobCardComponent {
    constructor(job) {
        this.job = job;
    }

    render() {
        return `
            <div class="col-md-4">
                <div class="card" data-id="${this.job._id}">
                    <div class="card-body">
                        <h5 class="card-title">${this.job.company}</h5>
                        <p class="card-text">${this.job.title}</p>
                        <small>${this.job.dateApplied}</small>
                    </div>
                </div>
            </div>
        `;
    }
}
