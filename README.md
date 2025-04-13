# Polling App

A full-stack web application that allows users to create, share, and vote on polls. Built with React for the frontend and Express for the backend.

## Features

- **User Authentication**: Create an account and log in to manage your polls
- **Poll Creation**: Registered users can create custom polls with multiple options
- **Theme**: User can change poll theme.
- **Public Sharing**: Share polls with anyone via unique links
- **Voting System**: One vote per poll per browser
- **Results Visualization**: See results after voting

## Prerequisites

- Node.js 
- npm
- Git

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/45h1m/poll-app.git
   cd poll-app
   ```

2. Install dependencies and build the frontend:
   ```
   npm run build
   ```

3. Create a `.env` file **in the root directory of client** with the following variables:
   ```
   VITE_API_URL=your-server-url
   ```

## Running the Application

Start both the backend and frontend with a single command:

```
npm start
```

The application will be available at post 80, change if needed

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Polls
- `GET /api/polls` - Get all public polls
- `GET /api/polls/:id` - Get a specific poll
- `POST /api/polls` - Create a new poll (authenticated)
- `POST /api/update/:id` - Update a poll (owner only)

### Votes
- `POST /api/polls/vote/:id` - Vote on a poll

## Technologies

- **Frontend**: React, React Router, Axios
- **Backend**: Express.js
- **Authentication**: JSON Web Tokens (JWT)
