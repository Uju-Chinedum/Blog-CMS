# Blog Content Management System for Students

This is a student-oriented blog CMS (Content Management System). Users may register, validate their email address, log in, create blogs, make comments, like blogs, and execute other user-related operations. Node.js, Express, and MongoDB are used to build the CMS.

You can view the project at <https://blog-cms-2f0u.onrender.com>

## Prerequisites

Before running the application, make sure you have [Node.js (v12 or higher)](https://nodejs.org/en) and [Git](https://git-scm.com/downloads) installed. Additionally, remember to configure your environment variables by generating a `.env` file containing the required settings, which can be found in the `sample.env` file. Make sure you have a MongoDB database accessible because the program needs it to store data.

## Installation

1. Clone this repository using Git

   ```sh
   git clone https://github.com/Uju-Chinedum/Blog-CMS.git
   ```

2. Navigate to the project directory

   ```sh
   cd Blog-CMS
   ```

3. Install the required dependencies

   ``` sh
   npm install
   ```

## Running the Application

Once you have completed the installation, run the application by using `npm start`. This will start the Node.js server, and you should see the message "Server started on port `port`" in the console. The application will be available at <http://localhost:5000>.

## Routes

The application implements the following endpoints:

### Authentication

- **Register - _POST_ /api/v1/auth/register**: Establishes a new user account. Requests the user's email address, password, and complete name. Sends the user an email asking for verification.
- **Verify Email - _POST_ /api/v1/auth/verify-email**: Uses a verification token that is emailed to the user to confirm their email address.
- **Login - _POST_ /api/v1/auth/login**: Uses a user's email address and password to log them in. Uses cookies to verify users.
- **Login with Google - _GET_ /api/v1/auth/google**: Initiates Google Sign-In
- **Login with Google - _GET_ /api/v1/auth/callback**: Handles Google Sign-In callback
- **Forgot Password - _POST_ /api/v1/auth/forgot-password**: Emails the user's registered email address with a password reset
- **Reset Password - _POST_ /api/v1/auth/reset-password**: Resets the user's password by sending an email with a valid reset token
- **Logout - _POST_ /api/v1/auth/logout**: The presently authenticated user is logged out by invalidating the access and refresh tokens

### User Operations

- **Get All Users - _GET_ /api/v1/user**: This method returns a list of all registered users. Sorting and pagination are supported. Authentication is required
- **Get Single User - _GET_ /api/v1/user/:user_id**: This method gets the details of a single user by their ID. Authentication is required
- **Show Current User - _GET_ /api/v1/user/show-me**: This method gets the details of the currently authenticated user. Authentication is required
- **Update User - _PATCH_ /api/v1/user/update-user**: This method updates the profile details of the currently authenticated user. Authentication is required
- **Update Profile Picture - _PATCH_ /api/v1/user/update-picture**: This method updates the profile picture of the currently authenticated user. Authentication and file upload is required
- **Update Password - _PATCH_ /api/v1/user/update-password**: This method updates the password of the currently authenticated user. Authentication is required
- **Delete User - _DELETE_ /api/v1/user/delete-user**: This method deletes the account of the currently authenticated user. Authentication is required

### Blog Operations

- **Create Blog - _POST_ /api/v1/blog**: Creates a new blog post. Requires authentication
- **Get All Blogs - _GET_ /api/v1/blog**: Gets a list of all blog posts. Supports sorting and pagination. Requires authentication
- **Get Single Blog - _GET_ /api/v1/blog/:blog_id**: Gets details of a single blog post by its ID. Requires authentication
- **Update Blog - _PATCH_ /api/v1/blog/:blog_id**: Updates an existing blog post. Requires authentication and ownership verification
- **Delete Blog - _DELETE_ /api/v1/blog/:blog_id**: Deletes an existing blog post. Requires authentication and ownership verification

### Comment Operations

- **Create Comment - _POST_ /api/v1/blog/:blog_id/comment**: Adds a comment to a specific blog post. Requires authentication
- **Get All Comments - _GET_ /api/v1/blog/:blog_id/comment**: Gets all comments for a specific blog post. Requires authentication
- **Delete Comment - _DELETE_ /api/v1/blog/:blog_id/comment/:comment_id**: Deletes a comment from a specific blog post. Requires authentication and ownership verification

### Like Operations

- **Switch Like - _DELETE_ /api/v1/blog/:blog_id/like**: Toggles the like status for a specific blog post. Requires authentication.

Visit the Swagger API documentation at <https://blog-cms-2f0u.onrender.com/api-docs> for detailed information on available endpoints and request/response formats.
