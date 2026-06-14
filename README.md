# REST API — User Management

A RESTful API built with **Node.js**, **Express**, and **Mongoose** for performing CRUD operations on a Users collection in **MongoDB Atlas**.

---

## Features

- Full CRUD endpoints for user management
- Mongoose schema validation (required fields, unique email, age constraints)
- Environment-based configuration with `dotenv`
- Automatic `createdAt` / `updatedAt` timestamps
- Structured error responses with appropriate HTTP status codes

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| [Express](https://expressjs.com/) | Web framework and routing |
| [Mongoose](https://mongoosejs.com/) | MongoDB ODM (schema, validation, queries) |
| [dotenv](https://www.npmjs.com/package/dotenv) | Environment variable management |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud-hosted database |

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (included with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local MongoDB instance)
- [Postman](https://www.postman.com/) (or any HTTP client) for testing

---

## Project Structure

```
REST-API/
├── config/
│   ├── .env              # Environment variables (not committed — create locally)
│   └── .env.example      # Template for required environment variables
├── models/
│   └── User.js           # Mongoose schema and User model
├── server.js             # Express server, DB connection, and API routes
├── package.json
├── .gitignore
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jerriecruiz001-prog/rest-API.git
cd rest-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp config/.env.example config/.env
```

Edit `config/.env`:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/restapi_db
```

> **Important:** Never commit `config/.env`. It is listed in `.gitignore` because it contains sensitive credentials.

### 4. Start the server

```bash
npm start
```

Expected output:

```
🚀 Server running on http://localhost:3000
✅ Connected to MongoDB
```

---

## User Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | User's full name (trimmed) |
| `email` | String | Yes | Unique email address (stored lowercase) |
| `age` | Number | No | Must be 0 or greater |
| `createdAt` | Date | Auto | Set by Mongoose timestamps |
| `updatedAt` | Date | Auto | Set by Mongoose timestamps |

---

## API Reference

Base URL: `http://localhost:3000`

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `GET` | `/users` | Retrieve all users | `200`, `500` |
| `POST` | `/users` | Create a new user | `201`, `400` |
| `PUT` | `/users/:id` | Update a user by ID | `200`, `400`, `404` |
| `DELETE` | `/users/:id` | Delete a user by ID | `200`, `404`, `500` |

---

### GET `/users`

Returns all users in the database.

**Example request:**

```http
GET http://localhost:3000/users
```

**Example response (`200 OK`):**

```json
[
  {
    "_id": "6840fa12c3b9a1d4e5f67890",
    "name": "Alice",
    "email": "alice@example.com",
    "age": 25,
    "createdAt": "2026-06-02T10:00:00.000Z",
    "updatedAt": "2026-06-02T10:00:00.000Z"
  }
]
```

---

### POST `/users`

Creates a new user. Requires `Content-Type: application/json`.

**Example request:**

```http
POST http://localhost:3000/users
Content-Type: application/json
```

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "age": 25
}
```

**Example response (`201 Created`):**

```json
{
  "_id": "6840fa12c3b9a1d4e5f67890",
  "name": "Alice",
  "email": "alice@example.com",
  "age": 25,
  "createdAt": "2026-06-02T10:00:00.000Z",
  "updatedAt": "2026-06-02T10:00:00.000Z"
}
```

---

### PUT `/users/:id`

Updates an existing user by MongoDB `_id`. Only include fields you want to change.

**Example request:**

```http
PUT http://localhost:3000/users/6840fa12c3b9a1d4e5f67890
Content-Type: application/json
```

```json
{
  "name": "Alice Updated",
  "age": 30
}
```

**Example response (`200 OK`):**

```json
{
  "_id": "6840fa12c3b9a1d4e5f67890",
  "name": "Alice Updated",
  "email": "alice@example.com",
  "age": 30,
  "createdAt": "2026-06-02T10:00:00.000Z",
  "updatedAt": "2026-06-02T10:30:00.000Z"
}
```

**Example response (`404 Not Found`):**

```json
{
  "message": "User not found"
}
```

---

### DELETE `/users/:id`

Removes a user from the database by MongoDB `_id`.

**Example request:**

```http
DELETE http://localhost:3000/users/6840fa12c3b9a1d4e5f67890
```

**Example response (`200 OK`):**

```json
{
  "message": "User deleted successfully",
  "user": {
    "_id": "6840fa12c3b9a1d4e5f67890",
    "name": "Alice",
    "email": "alice@example.com",
    "age": 25
  }
}
```

---

## Testing with Postman

1. Start the server: `npm start`
2. Open Postman and create a new request for each route
3. Test in this order: **POST → GET → PUT → DELETE**
4. Copy the `_id` from the POST response for PUT and DELETE requests
5. For POST and PUT, set **Body → raw → JSON** and add `Content-Type: application/json`

---

## Troubleshooting

### `querySrv ECONNREFUSED` when connecting to MongoDB Atlas

Some networks or routers fail to resolve MongoDB SRV DNS records. This project includes a workaround in `server.js` that routes DNS through public servers (`8.8.8.8`, `1.1.1.1`).

If the issue persists:

- Verify your `MONGO_URI` in `config/.env`
- Confirm your IP is whitelisted in MongoDB Atlas → **Network Access**
- Try a standard connection string (`mongodb://...`) instead of `mongodb+srv://...`

---

## Author

**Jerrie Cruiz**
