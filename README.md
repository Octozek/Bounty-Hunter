# Bounty-Hunter# Bounty Hunter

**Bounty Hunter** is a job application tracking app designed to help users efficiently manage their job search process. The app allows users to track the status of their applications by organizing them into Pending, Declined, and Achieved categories. Users can upload resumes, swipe between sections, and enjoy a clean, Discord-inspired interface. The app is monetized with Google AdSense.

## Features

- **User Authentication**: Secure login and registration powered by JWT.
- **Job Tracking**: Organize jobs into Pending, Declined, and Achieved categories.
- **Resume Upload**: Upload and view resumes directly within the app.
- **Swipe Navigation**: Swipe between job statuses for mobile users.
- **Responsive Design**: Optimized for mobile and desktop with a Discord-inspired UI.
- **Monetization**: Integrated Google AdSense ads for revenue generation.

## Table of Contents

- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [License](#license)

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20.x or higher)
- MongoDB Atlas or a local MongoDB instance

### Clone the Repository

```bash
git clone https://github.com/Octozek/Bounty-Hunter.git
cd Bounty-Hunter
```
### Install Dependencies

```bash
# Install server-side dependencies
npm install

# Install client-side dependencies
npm run install-client
```

### Set Up Environment Variables

Create a .env file in the root of the project with the following contents:

```bash
MONGODB_URI=<Your MongoDB connection string>
JWT_SECRET=<Your JWT secret key>
```

### Run the Application

To start the application in development mode, run:
```bash
npm run dev
```

## Technologies Used

- **Frontend**:
  - HTML5, CSS3
  - Bootstrap 4
  - Font Awesome
  - Hammer.js (for swipe functionality)
  
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB & Mongoose (for database management)
  
- **Authentication**:
  - JWT (JSON Web Tokens)
  
- **File Handling**:
  - Multer (for resume upload)
  
- **Other Libraries**:
  - dotenv (for environment variables)
  - Google AdSense (for monetization)

## Usage

1. **Sign Up**: Register a new account by providing an email and password.
2. **Add Jobs**: Use the Add Job feature to add job applications. You can categorize jobs into Pending, Declined, or Achieved.
3. **Resume Upload**: Upload your resume in PDF format for each job application and view the resume from the job details.
4. **Swipe Between Pages**: Mobile users can swipe between job statuses (Pending, Declined, Achieved, About).
5. **Manage Personal Info**: Update your portfolio, LinkedIn, GitHub, and other information via the Your Info section.
6. **Monetization**: Google AdSense is integrated to display ads, generating revenue as users interact with the app.

## Screenshots

(Include screenshots here of the app in various states like the job list, resume upload, and swipe navigation)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
