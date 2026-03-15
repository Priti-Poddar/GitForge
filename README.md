# GitForge
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Priti-Poddar/GitForge)

GitForge is a full-stack web application that emulates the core functionalities of GitHub. It provides a platform for users to manage software development projects, including repository hosting, issue tracking, and user profile management. The project is divided into a Node.js backend and a React frontend, and it also features a custom command-line interface that mimics basic Git commands for repository operations.

## Features

*   **User Authentication**: Secure user signup and login using JWT and bcrypt for password hashing.
*   **Repository Management**: Create, view, update, and delete repositories with options for public or private visibility.
*   **Issue Tracking**: Create, view, edit, and manage the status of issues within each repository.
*   **Version Control CLI**: A custom, simplified Git-like CLI (`init`, `add`, `commit`, `revert`) that syncs with an AWS S3 bucket (`push`, `pull`), simulating a remote version control system.
*   **User Profiles**: View user profiles featuring contribution statistics, a GitHub-style activity heatmap, and repository lists.
*   **Social Interaction**: Follow and unfollow other users on the platform.
*   **Explore Page**: Discover public repositories with search and filtering capabilities.
*   **Real-time Communication**: Includes a basic real-time component using Socket.IO.

## Tech Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB with Mongoose ODM
*   **Authentication**: JSON Web Tokens (JWT)
*   **Command-Line Interface**: Yargs
*   **File Storage**: AWS S3 for remote repository "push/pull"
*   **Real-time**: Socket.IO

### Frontend
*   **Framework**: React (with Vite)
*   **Routing**: React Router
*   **Styling**: Custom CSS with a design system inspired by Primer
*   **UI Components**: `@primer/react`, `@uiw/react-heat-map`
*   **API Communication**: Axios

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm
*   MongoDB instance (local or cloud-hosted)
*   AWS account and an S3 bucket with credentials

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add your environment variables:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET_KEY=your_jwt_secret

    # AWS Credentials for S3
    AWS_REGION=your_aws_region
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret_key
    ```

4.  **Start the backend server:**
    ```sh
    node index.js start
    ```
    The server will be running on `http://localhost:3000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `frontend` directory to point to your backend API:
    ```env
    VITE_API_URL=http://localhost:3000
    ```

4.  **Start the frontend development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Usage

### Web Application

Once both the backend and frontend are running, you can access the GitForge web application in your browser. You can sign up for a new account, create repositories, manage issues, and explore projects created by other users.

### Command-Line Interface (CLI)

The backend includes a custom version control CLI that mimics basic Git commands. To use it, navigate to the `backend` directory in your terminal.

*   **Initialize a repository:** Initializes a `.apnaGit` directory to track commits.
    ```sh
    node index.js init
    ```

*   **Add files to staging:** Stages a file for the next commit.
    ```sh
    node index.js add <file-name>
    # Example: node index.js add hello.txt
    ```

*   **Commit staged files:** Creates a new commit with a message.
    ```sh
    node index.js commit "<commit-message>"
    # Example: node index.js commit "Initial commit"
    ```

*   **Push commits to S3:** Pushes all local commits to your configured AWS S3 bucket.
    ```sh
    node index.js push
    ```

*   **Pull commits from S3:** Fetches commits from the S3 bucket and updates the local repository.
    ```sh
    node index.js pull
    ```

*   **Revert to a previous commit:** Reverts the project's files to the state of a specific commit ID.
    ```sh
    node index.js revert <commit-id>