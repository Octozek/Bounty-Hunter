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
                            <form id="add-job-form">
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
            const company = document.getElementById('company').value;
            const title = document.getElementById('title').value;
            const pay = document.getElementById('pay').value;
            const dateApplied = document.getElementById('dateApplied').value;
            const type = document.getElementById('type').value;
            const link = document.getElementById('link').value;
            const notes = document.getElementById('notes').value;

            const job = { company, title, pay, dateApplied, type, link, notes };
            const token = localStorage.getItem('token');

            try {
                console.log('Sending job data to server:', job);
                const response = await fetch(`${config.apiUrl}/jobs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(job)
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
