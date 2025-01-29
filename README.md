# 🚀 GetItDone.ai

## 🌟 Overview
GetItDone.ai is an AI-powered task management web application that helps users efficiently manage their to-do lists while interacting with an AI assistant. The application is built using React.js for the frontend and Express.js for the backend, integrating OpenAI for AI interactions and PostgreSQL for data storage.

## ✨ Features
- 🤖 AI-powered task management assistant
- 💬 Real-time AI chat assistant for task-related queries
- ✅ CRUD operations on to-do tasks
- 🔐 Secure database connection with PostgreSQL
- 🎨 Responsive UI with Tailwind CSS

## 🛠 Tech Stack
### Frontend
- ⚛️ React.js
- 🟦 TypeScript
- 🔄 Axios
- 🎨 Tailwind CSS
- 🎭 Lucide Icons

### Backend
- 🌍 Node.js
- 🚀 Express.js
- 🧠 OpenAI API
- 🗄 PostgreSQL
- 🔐 dotenv for environment variables

## 📥 Installation

### 🔧 Prerequisites
Ensure you have the following installed:
- 📌 Node.js (v16+)
- 🗄 PostgreSQL (configured with the required database)

### 📌 Clone the repository
```sh
git clone https://github.com/your-repository/getitdone.ai.git
cd getitdone.ai
```

### ⚙️ Setup Frontend
```sh
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory and configure the backend URL:
```env
VITE_APP_BACKEND_URL=url
```

Start the frontend:
```sh
npm run dev
```

### 🖥 Setup Backend
```sh
cd backend
npm install
```

Create a `.env` file in the `backend` directory and configure database and API keys:
```env
BACKEND_PORT_NO=
OPENAI_API_KEY=
RENDER_DB=
```

Start the backend:
```sh
npm start
```

## 📡 API Endpoints

### 🤖 AI Chat Response
```http
POST /ai-response
```
**Request:**
```json
{
  "message": "What is my next task?"
}
```
**Response:**
```json
{
  "response": "You have a pending task: Buy groceries."
}
```

### 📝 Fetch To-Do List
```http
POST /get-todo
```
**Response:**
```json
{
  "tasks": [
    { "id": "1", "todo": "Buy groceries", "completed": false, "category": "Shopping" }
  ]
}
```

## 🛠 Function Usage and Code Snippets

### 🔍 `getAllTodos()`
Retrieves all to-do items from the database.
```js
async function getAllTodos() {
    const query = 'SELECT * FROM todos;';
    const result = await db.query(query);
    return result.rows;
}
```

### ➕ `createTodos(todo)`
Creates a new to-do task.
```js
async function createTodos(todo) {
    const query = `INSERT INTO todos (todo) VALUES ($1) RETURNING id;`;
    const values = [todo];
    const result = await db.query(query, values);
    return result.rows[0];
}
```

### 🔎 `searchTodo(search)`
Searches for to-do tasks based on a query string.
```js
async function searchTodo(search) {
    const query = `SELECT * FROM todos WHERE todo ILIKE $1;`;
    const values = [`%${search}%`];
    const result = await db.query(query, values);
    return result.rows;
}
```

### ❌ `deleteTodo(id)`
Deletes a to-do task by ID.
```js
async function deleteTodo(id) {
    const query = `DELETE FROM todos WHERE id = $1;`;
    const values = [id];
    await db.query(query, values);
    console.log(`🗑 Todo with ID ${id} has been deleted.`);
}
```

## 🗂 Database Schema
```sql
CREATE TABLE "todos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "todos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"todo" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
```

## 📂 Project Structure
```
getitdone.ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── main.jsx
│   ├── public/
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── index.js
│   │   ├── systemPrompt.js
│   ├── .env
│   ├── package.json
│   ├── server.js
```

## 🤝 Contributing
If you'd like to contribute, please fork the repository and submit a pull request.

## 📜 License
This project is licensed under the MIT License.

## 📩 Contact
For any issues, please contact [your-email@example.com](mailto:your-email@example.com).
