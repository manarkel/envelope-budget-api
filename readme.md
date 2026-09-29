# Envelope Budget API

A REST API for envelope budgeting — a personal finance method where you
allocate money into named "envelopes" (categories) and track spending
against each one.

Built with **Node.js** and **Express**. Uses an in-memory data store
(resets on server restart).

## Features

- Create, read, update, and delete budget envelopes
- Track a running balance per envelope
- Spend from and fund individual envelopes
- Transfer money between envelopes
- Automatic total budget calculation
- Input validation with meaningful error messages

## Tech Stack

- Node.js
- Express
- In-memory array as data store
- Git for version control
- Postman for API testing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- Git (optional, for cloning)

### Installation

```bash
git clone https://github.com/manarkel/envelope-budget-api.git
cd envelope-budget-api
npm install
```

### Running the Server

```bash
node server.js
```

The server starts at:

```
http://localhost:3000
```

For development with auto-restart, install `nodemon` and use:

```bash
npx nodemon server.js
```

## Data Model

Each envelope has the following shape:

```json
{
  "id": 1,
  "name": "Groceries",
  "budget": 500,
  "balance": 500
}
```

| Field     | Type   | Description                                    |
|-----------|--------|------------------------------------------------|
| `id`      | number | Unique identifier, auto-assigned               |
| `name`    | string | Envelope label (e.g. "Groceries")              |
| `budget`  | number | Original allocated amount                      |
| `balance` | number | Current available funds (changes with activity)|

## API Endpoints

Base URL: `http://localhost:3000`

### Envelopes

| Method   | Endpoint                  | Description                          |
|----------|---------------------------|--------------------------------------|
| `GET`    | `/envelopes`              | List all envelopes                   |
| `GET`    | `/envelopes/total`        | Get total budget across all envelopes|
| `GET`    | `/envelopes/:id`          | Get a single envelope by ID          |
| `POST`   | `/envelopes`              | Create a new envelope                |
| `PUT`    | `/envelopes/:id`          | Update an envelope's name or budget  |
| `DELETE` | `/envelopes/:id`          | Delete an envelope                   |

### Balance Operations

| Method   | Endpoint                  | Description                          |
|----------|---------------------------|--------------------------------------|
| `POST`   | `/envelopes/:id/spend`    | Subtract from an envelope's balance  |
| `POST`   | `/envelopes/:id/fund`     | Add to an envelope's balance         |
| `POST`   | `/envelopes/transfer/:from/:to` | Transfer between two envelopes |

## Usage Examples

### List all envelopes

```http
GET /envelopes
```

Response:

```json
[
  { "id": 1, "name": "Groceries", "budget": 500, "balance": 500 },
  { "id": 2, "name": "Rent",      "budget": 1500, "balance": 1500 },
  { "id": 3, "name": "Utilities", "budget": 300, "balance": 300 }
]
```

### Create an envelope

```http
POST /envelopes
Content-Type: application/json

{
  "name": "Gas",
  "budget": 150
}
```

Response (`201 Created`):

```json
{
  "message": "Envelope created",
  "envelope": {
    "id": 4,
    "name": "Gas",
    "budget": 150,
    "balance": 150
  },
  "totalBudget": 2450
}
```

### Spend from an envelope

```http
POST /envelopes/1/spend
Content-Type: application/json

{
  "amount": 50
}
```

Response (`200 OK`):

```json
{
  "id": 1,
  "name": "Groceries",
  "budget": 500,
  "balance": 450
}
```

### Fund an envelope

```http
POST /envelopes/1/fund
Content-Type: application/json

{
  "amount": 25
}
```

Response (`200 OK`):

```json
{
  "id": 1,
  "name": "Groceries",
  "budget": 500,
  "balance": 475
}
```

### Transfer between envelopes

```http
POST /envelopes/transfer/1/2
Content-Type: application/json

{
  "amount": 100
}
```

Response (`200 OK`):

```json
{
  "message": "Transferred 100 from Groceries to Rent",
  "from": { "id": 1, "name": "Groceries", "budget": 500, "balance": 400 },
  "to":   { "id": 2, "name": "Rent",      "budget": 1500, "balance": 1600 }
}
```

### Update an envelope

```http
PUT /envelopes/1
Content-Type: application/json

{
  "name": "Food",
  "budget": 600
}
```

Response (`200 OK`):

```json
{
  "id": 1,
  "name": "Food",
  "budget": 600,
  "balance": 400
}
```

### Delete an envelope

```http
DELETE /envelopes/3
```

Response: `204 No Content` (empty body)

## Error Responses

All errors return JSON with an `error` field.

| Status | Meaning                                    | Example Cause                        |
|--------|--------------------------------------------|--------------------------------------|
| `400`  | Bad Request — invalid input                | Missing `name`, negative `budget`    |
| `404`  | Not Found — envelope doesn't exist         | Invalid ID                           |
| `500`  | Server Error — unexpected issue            | Unhandled exception                  |

Example error response:

```json
{
  "error": "Envelope name is required"
}
```

## Testing with Postman

1. Open Postman
2. Import the collection from `postman/Envelope-Budget-API.postman_collection.json`
   (if included in this repo)
3. Ensure the server is running on `http://localhost:3000`
4. Run requests individually or use the **Collection Runner** to execute all

## Project Structure

```
envelope-budget-api/
├── data/
│   └── envelopes.js         # In-memory store & data operations
├── routes/
│   └── envelopes.js         # Route handlers for /envelopes
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js                # Express app setup & mount points
```

## Design Notes

### Why two files named `envelopes.js`?

They live in different folders and have different responsibilities:

- `data/envelopes.js` — pure data logic. Knows nothing about HTTP.
- `routes/envelopes.js` — HTTP handlers. Knows nothing about how data is stored.

This separation means switching from an in-memory array to a real database
only requires changes in `data/envelopes.js`.

### Budget vs. balance

- **`budget`** — the original allocated amount. Fixed until explicitly updated.
- **`balance`** — current available funds. Changes with spend, fund, and transfer.

Transfers move **balance**, not budget. This mirrors real envelope budgeting:
you allocate a plan, then move actual cash around.

### In-memory storage

Data lives in a JavaScript array. Restarting the server resets everything to
the seed values. This is intentional for a learning/demo project — a production
version would use a database.

## Future Improvements

- Persist data to SQLite or PostgreSQL
- Add user authentication
- Add transaction history per envelope
- Add monthly budget cycles
- Build a frontend

## License

MIT — free to use, modify, and distribute.

## Author

**Manarkel** — [github.com/manarkel](https://github.com/manarkel)