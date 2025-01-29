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
├── backend/
│   ├── component/
│   │   ├── systemPrompt.js
│   ├── .env
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── vercel.json
├── frontend/
│   ├── .bolt/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── vite-env.d.ts
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vercel.json
│   ├── vite.config.ts
├── .gitignore
```

## 📑 Frontend Code
### `AiAssistant Component`
This component is the main entry point for the AI Assistant in the application. It manages the chat interface and displays a real-time to-do list.

#### Features:
- Fetches to-do items from the backend when the component loads.
- Allows users to interact with the AI Assistant via chat.
- Displays AI-generated responses dynamically.

#### Key Code:
```tsx
function AiAssistant() {
  const SYSTEM_PROMPT = "Hello! I'm your AI assistant. How can I help you today?";
  const [todos, setTodos] = useState<Todo[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: SYSTEM_PROMPT },
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/get-todo`);
        if (response.data && Array.isArray(response.data.tasks)) {
          setTodos(response.data.tasks);
        }
      } catch (error) {
        console.error('Error fetching to-do list:', error);
      }
    };
    fetchTodos();
  }, [messages]);

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;
    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/ai-response`, {
        message: query,
      });

        content: response.data.response || "I'm sorry, I couldn't understand that.",
  };

 
```

## 🤝 Contributing
If you'd like to contribute, please fork the repository and submit a pull request.

## 📜 License
This project is licensed under the codeFolio License.

## 📩 Contact
For any issues, please contact [codefolio.inquiry@gmail.com](mailto:your-email@example.com).
