class AddJobComponent {
    render() {
        return `
            <div class="modal" id="addJobModal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Job</h5>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form id="add-job-form">
                                <div class="form-group">
                                    <label for="job-title">Job Title</label>
                                    <input type="text" class="form-control" id="job-title">
                                </div>
                                <div class="form-group">
                                    <label for="company-name">Company Name</label>
                                    <input type="text" class="form-control" id="company-name">
                                </div>
                                <div class="form-group">
                                    <label for="job-link">Link</label>
                                    <input type="url" class="form-control" id="job-link">
                                </div>
                                <div class="form-group">
                                    <label for="pay">Pay</label>
                                    <input type="text" class="form-control" id="pay">
                                </div>
                                <div class="form-group">
                                    <label for="applied-date">Date Applied</label>
                                    <input type="date" class="form-control" id="applied-date">
                                </div>
                                <div class="form-group">
                                    <label for="job-type">Job Type</label>
                                    <select class="form-control" id="job-type">
                                        <option>Front End</option>
                                        <option>Back End</option>
                                        <option>Full Stack</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="job-image">Job Image</label>
                                    <input type="file" class="form-control-file" id="job-image">
                                </div>
                                <button type="submit" class="btn btn-primary" id="done-btn">Done!</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
