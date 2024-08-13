class AddJobComponent {
    render() {
        return `
            <div class="modal fade" id="addJobModal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Job</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="add-job-form" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label for="company">Company Name</label>
                                    <input type="text" class="form-control" id="company" required>
                                </div>
                                <div class="form-group">
                                    <label for="title">Job Title</label>
                                    <input type="text" class="form-control" id="title" required>
                                </div>
                                <div class="form-group">
                                    <label for="pay">Pay</label>
                                    <input type="text" class="form-control" id="pay">
                                </div>
                                <div class="form-group">
                                    <label for="type">Job Type</label>
                                    <select class="form-control" id="type">
                                        <option value="">Select</option>
                                        <option value="frontend">Frontend</option>
                                        <option value="backend">Backend</option>
                                        <option value="fullstack">Fullstack</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="dateApplied">Date Applied</label>
                                    <input type="date" class="form-control" id="dateApplied" required>
                                </div>
                                <div class="form-group">
                                    <label for="link">Link</label>
                                    <input type="url" class="form-control" id="link">
                                </div>
                                <div class="form-group">
                                    <label for="notes">Notes</label>
                                    <textarea class="form-control" id="notes" rows="3"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="resume">Resume (PDF)</label>
                                    <input type="file" class="form-control-file" id="resume" accept="application/pdf">
                                </div>
                                <button type="submit" class="btn btn-primary">Done!</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        document.getElementById('add-job-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('company', document.getElementById('company').value);
            formData.append('title', document.getElementById('title').value);
            formData.append('pay', document.getElementById('pay').value);
            formData.append('dateApplied', document.getElementById('dateApplied').value);
            formData.append('type', document.getElementById('type').value);
            formData.append('link', document.getElementById('link').value);
            formData.append('notes', document.getElementById('notes').value);

            const resumeFile = document.getElementById('resume').files[0];
            if (resumeFile) {
                formData.append('resume', resumeFile);
            }

            const token = localStorage.getItem('token');

            try {
                console.log('Sending job data with resume to server:', formData);
                const response = await fetch(`${config.apiUrl}/jobs`, {
                    method: 'POST',
                    headers: {
                        'x-auth-token': token
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Failed to add job');
                }

                const newJob = await response.json();
                $('#addJobModal').modal('hide');

                // Update the jobs list and re-attach event listeners
                const mainComponent = new MainComponent();
                await mainComponent.fetchJobs();
                document.getElementById('job-list').innerHTML = mainComponent.renderJobCards();
                mainComponent.attachCardEventListeners();
            } catch (error) {
                console.error('Error adding job:', error);
                alert(`There was an error adding the job: ${error.message}. Please try again.`);
            }
        });
    }
}
