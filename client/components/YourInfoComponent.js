class YourInfoComponent {
    constructor(userInfo = {}) {
        this.userInfo = userInfo;
    }

    render() {
        return `
            <div class="modal fade" id="yourInfoModal" tabindex="-1" role="dialog" aria-labelledby="yourInfoModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="yourInfoModalLabel">Your Info</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            ${this.renderField('portfolioLink', 'Portfolio Link')}
                            ${this.renderField('linkedinProfile', 'LinkedIn Profile')}
                            ${this.renderField('facebookProfile', 'Facebook Profile')}
                            ${this.renderField('phoneNumber', 'Phone Number')}
                            ${this.renderField('email', 'Email')}
                            ${this.renderField('githubProfile', 'GitHub Profile')}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="save-info-btn">Done</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderField(field, label) {
        const value = this.userInfo[field] || '';
        return `
            <div class="form-group">
                <label for="${field}">${label}</label>
                <input type="text" class="form-control" id="${field}" value="${value}" />
            </div>
        `;
    }

    addEventListeners() {
        const modalElement = document.getElementById('yourInfoModal');

        document.getElementById('save-info-btn').addEventListener('click', () => this.saveInfo());

        $(modalElement).on('hidden.bs.modal', () => {
            this.cleanup();
            this.reattachMainEventListeners();
        });

        $(modalElement).modal({
            backdrop: 'static',
            keyboard: true
        });
    }

    async saveInfo() {
        const fields = ['portfolioLink', 'linkedinProfile', 'facebookProfile', 'phoneNumber', 'email', 'githubProfile'];
        fields.forEach(field => {
            this.userInfo[field] = document.getElementById(field).value;
        });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${window.config.apiUrl}/users/user-info`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(this.userInfo)
            });

            if (!response.ok) {
                throw new Error('Failed to save user info');
            }

            $('#yourInfoModal').modal('hide');
        } catch (error) {
            console.error('Error saving user info:', error);
        }
    }

    cleanup() {
        document.getElementById('save-info-btn').removeEventListener('click', () => this.saveInfo());
    }

    reattachMainEventListeners() {
        const headerComponent = new HeaderComponent();
        headerComponent.addEventListeners();

        const mainComponent = new MainComponent();
        mainComponent.addEventListeners();
    }
}
