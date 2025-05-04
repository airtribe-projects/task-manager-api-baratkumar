# Task Manager API

A simple Node.js/Express API for managing tasks, supporting CRUD operations, validation, pagination, sorting, and more.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete tasks.
- **Data Persistence**: Tasks are stored in a local `task.json` file.
- **Input Validation**: Uses Joi for validating task data on creation and update.
- **Pagination**: GET `/tasks` supports pagination (10 tasks per page).
- **Sorting**: Sort tasks by `priority`, `timestamp`, or `completed` status using query parameters.
- **Filtering**: Retrieve a single task by its ID.
- **Timestamps**: Each task has a `timestamp` (created) and `updatedOn` (last updated).
- **Priority**: Each task has a `priority` (`low`, `medium`, or `high`).
- **Dynamic Routing**: All route files in the `routes` directory are loaded automatically.
- **Dev Tools**: Nodemon for auto-reloading during development.

## Endpoints

### GET `/tasks`
- Returns a paginated list of tasks.
- Query params:
  - `page`: Page number (default: 1)
  - `priority`, `timestamp`, `completed`: Sort by these fields (add `order=asc` for ascending, default is descending)
- Example: `/tasks?priority&order=asc&page=2`

### GET `/tasks/:id`
- Returns a single task by ID.

### POST `/tasks`
- Creates a new task.
- Body:
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "completed": false,
    "priority": "low" // or "medium", "high"
  }
  ```

### PUT `/tasks/:id`
- Updates an existing task.
- Body: Any subset of the fields allowed in POST.
- Adds/updates the `updatedOn` timestamp.

### DELETE `/tasks/:id`
- Deletes a task by ID.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the server**
   ```bash
   npm run dev
   ```
   (Make sure `nodemon` is installed as a dev dependency.)

3. **API will be available at** `http://localhost:3000/`

## Project Structure
