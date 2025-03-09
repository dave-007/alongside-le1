# API Documentation

This document outlines the API endpoints available in the application.

## Base URL

For local development: `http://localhost:3000/api`

## Authentication

Currently, the API does not require authentication. This will be implemented in a future update.

## Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Error responses follow this format:

```json
{
  "error": {
    "message": "Error message description",
    "code": "ERROR_CODE"
  }
}
```

## API Endpoints

### Presentations

#### Get All Presentations

```
GET /api/presentations
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (default: "createdAt")
- `order`: Sort order ("asc" or "desc", default: "desc")
- `search`: Search term

**Response**:

```json
{
  "data": [
    {
      "id": "1",
      "title": "Building a Next.js App with AI",
      "summary": "A markdown summary of the presentation...",
      "videoUrl": "https://youtube.com/watch?v=example",
      "githubUrl": "https://github.com/username/repo",
      "authorId": "user123",
      "authorName": "Jane Developer",
      "createdAt": "2023-03-15T10:30:00Z",
      "updatedAt": "2023-03-15T10:30:00Z"
    },
    {
      "id": "2",
      "title": "TypeScript Best Practices",
      "summary": "Another markdown summary...",
      "videoUrl": "https://youtube.com/watch?v=example2",
      "githubUrl": "https://github.com/username/typescript-demo",
      "authorId": "user456",
      "authorName": "John Coder",
      "createdAt": "2023-03-14T08:15:00Z",
      "updatedAt": "2023-03-15T09:20:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

#### Get Presentation by ID

```
GET /api/presentations/:id
```

**Parameters**:
- `id`: Presentation ID

**Response**:

```json
{
  "id": "1",
  "title": "Building a Next.js App with AI",
  "summary": "A markdown summary of the presentation...",
  "videoUrl": "https://youtube.com/watch?v=example",
  "githubUrl": "https://github.com/username/repo",
  "authorId": "user123",
  "authorName": "Jane Developer",
  "createdAt": "2023-03-15T10:30:00Z",
  "updatedAt": "2023-03-15T10:30:00Z",
  "comments": [
    {
      "id": "comment1",
      "content": "Great presentation! I learned a lot.",
      "userId": "user789",
      "userName": "Alice Viewer",
      "createdAt": "2023-03-16T14:25:00Z"
    }
  ]
}
```

#### Create Presentation

```
POST /api/presentations
```

**Request Body**:

```json
{
  "title": "New Presentation",
  "summary": "# Markdown Summary\n\nThis is a summary of my presentation.",
  "videoUrl": "https://youtube.com/watch?v=example3",
  "githubUrl": "https://github.com/username/new-repo"
}
```

**Response**:

```json
{
  "id": "3",
  "title": "New Presentation",
  "summary": "# Markdown Summary\n\nThis is a summary of my presentation.",
  "videoUrl": "https://youtube.com/watch?v=example3",
  "githubUrl": "https://github.com/username/new-repo",
  "authorId": "user123",
  "authorName": "Jane Developer",
  "createdAt": "2023-03-16T14:20:00Z",
  "updatedAt": "2023-03-16T14:20:00Z"
}
```

#### Update Presentation

```
PUT /api/presentations/:id
```

**Parameters**:
- `id`: Presentation ID

**Request Body**:

```json
{
  "title": "Updated Presentation Title",
  "summary": "# Updated Summary\n\nThis is the updated summary.",
  "videoUrl": "https://youtube.com/watch?v=updated",
  "githubUrl": "https://github.com/username/updated-repo"
}
```

**Response**:

```json
{
  "id": "1",
  "title": "Updated Presentation Title",
  "summary": "# Updated Summary\n\nThis is the updated summary.",
  "videoUrl": "https://youtube.com/watch?v=updated",
  "githubUrl": "https://github.com/username/updated-repo",
  "authorId": "user123",
  "authorName": "Jane Developer",
  "createdAt": "2023-03-15T10:30:00Z",
  "updatedAt": "2023-03-16T15:45:00Z"
}
```

#### Delete Presentation

```
DELETE /api/presentations/:id
```

**Parameters**:
- `id`: Presentation ID

**Response**:

```json
{
  "success": true,
  "message": "Presentation deleted successfully"
}
```

### Comments

#### Get Comments for a Presentation

```
GET /api/presentations/:id/comments
```

**Parameters**:
- `id`: Presentation ID

**Response**:

```json
[
  {
    "id": "comment1",
    "content": "Great presentation! I learned a lot.",
    "userId": "user789",
    "userName": "Alice Viewer",
    "createdAt": "2023-03-16T14:25:00Z",
    "updatedAt": "2023-03-16T14:25:00Z"
  },
  {
    "id": "comment2",
    "content": "Could you explain more about the architecture?",
    "userId": "user456",
    "userName": "John Coder",
    "createdAt": "2023-03-16T16:30:00Z",
    "updatedAt": "2023-03-16T16:30:00Z"
  }
]
```

#### Add Comment to Presentation

```
POST /api/presentations/:id/comments
```

**Parameters**:
- `id`: Presentation ID

**Request Body**:

```json
{
  "content": "This is my comment on the presentation."
}
```

**Response**:

```json
{
  "id": "comment3",
  "content": "This is my comment on the presentation.",
  "userId": "user123",
  "userName": "Jane Developer",
  "createdAt": "2023-03-17T09:15:00Z",
  "updatedAt": "2023-03-17T09:15:00Z"
}
```

### Content Requests

#### Request Additional Content

```
POST /api/presentations/:id/requests
```

**Parameters**:
- `id`: Presentation ID

**Request Body**:

```json
{
  "requestType": "course",
  "description": "I would like a full course on this topic.",
  "offerAmount": 99.99
}
```

**Response**:

```json
{
  "id": "request1",
  "presentationId": "1",
  "requestType": "course",
  "description": "I would like a full course on this topic.",
  "offerAmount": 99.99,
  "status": "pending",
  "userId": "user789",
  "userName": "Alice Viewer",
  "createdAt": "2023-03-17T10:20:00Z",
  "updatedAt": "2023-03-17T10:20:00Z"
}
```

## Data Models

### Presentation

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| title | string | Presentation title |
| summary | string | Markdown summary |
| videoUrl | string | YouTube URL or local video path |
| githubUrl | string | GitHub repository URL |
| authorId | string | Creator's user ID |
| authorName | string | Creator's display name |
| createdAt | string (ISO date) | Creation timestamp |
| updatedAt | string (ISO date) | Last update timestamp |

### Comment

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| content | string | Comment text |
| userId | string | Commenter's user ID |
| userName | string | Commenter's display name |
| presentationId | string | Associated presentation ID |
| createdAt | string (ISO date) | Creation timestamp |
| updatedAt | string (ISO date) | Last update timestamp |

### ContentRequest

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| presentationId | string | Associated presentation ID |
| requestType | string | Type of request (e.g., "course", "tutorial") |
| description | string | Request details |
| offerAmount | number | Payment offer amount |
| status | string | Request status (pending, accepted, rejected) |
| userId | string | Requester's user ID |
| userName | string | Requester's display name |
| createdAt | string (ISO date) | Creation timestamp |
| updatedAt | string (ISO date) | Last update timestamp |

## Future API Enhancements

- Authentication and authorization
- Pagination for list endpoints
- Filtering and sorting options
- Rate limiting
- Webhooks for real-time updates
- Payment processing integration
- User profile management 