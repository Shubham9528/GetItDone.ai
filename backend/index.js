import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import pkg from 'pg';
const { Client } = pkg;
import SYSTEM_PROMPT from './component/systemPrompt.js';


dotenv.config();
const app = express();
const PORT = process.env.BACKEND_PORT_NO
app.use(cors());
app.use(bodyParser.json());
const openai = new OpenAI();//creating openAI instance

//***********************************************DataBase Connection Start*********************************************** */


// Render database connection
const connectionString = process.env.RENDER_DB;

//Database connection
const db = new Client({
    connectionString, // Connection string includes user, host, database, password, and port
    ssl: {
      rejectUnauthorized: true, // Required for connecting to databases with SSL, like Render
    },
  });
db.connect(); 


//connection to local database

// const db = new pg.Client({
//     user: "postgres",
//     host: "localhost",
//     database: "todo",
//     password: "Shubham@123",
//     port: 5432,
// })
// db.connect();

//***********************************************


//************************************************Tools Start*************************************************//




// async function getAllTodos() {
//     const todo = await db.select().from(todosTable);
//     return todo;
// }

// async function createTodos(todo) {
//     const [result] = await db.insert(todosTable).values({ todo }).returning({
//         id: todosTable.id
//     });
//     return result;

// }

// async function searchTodo(search) {
//     const todos = await db.select().from(todosTable).where(ilike(todosTable.todo, `%${search}%`));
//     return todos;
// }


// async function deleteTodo(id) {
//     await db.delete(todosTable).where(eq(todosTable.id, id));
// }

async function getAllTodos() {
    const query = 'SELECT * FROM todos;';
    const result = await db.query(query);
    return result.rows; // Returns all rows from the todos table
}

async function createTodos(todo) {
    const query = `
        INSERT INTO todos (todo)
        VALUES ($1)
        RETURNING id;
    `;
    const values = [todo];
    const result = await db.query(query, values);
    return result.rows[0]; // Returns the inserted row with the id
}

async function searchTodo(search) {
    const query = `
        SELECT * 
        FROM todos
        WHERE todo ILIKE $1;
    `;
    const values = [`%${search}%`];
    const result = await db.query(query, values);
    return result.rows; // Returns all matching rows
}


async function deleteTodo(id) {
    const query = `
        DELETE FROM todos
        WHERE id = $1;
    `;
    const values = [id];
    await db.query(query, values);
    console.log(`Todo with ID ${id} has been deleted.`);
}


















//************************************************Tools End*************************************************//


//******************************************************************************************************************************** */
const tools = {
    getAllTodos: getAllTodos,
    createTodos: createTodos,
    searchTodo: searchTodo,
    deleteTodo: deleteTodo
}
//********************************************************************************************









//*************************************System Prompt Start************************************************//

// const SYSTEM_PROMPT = `
// You are an AI To-Do List Assistant, with START, PLAN, ACTION, Observation and Ouput State.
// Wait for the user prompt and first PLAN using available tools.
// After Planning, Take the action with appropriate tools and wait for Obervation based on the Action.
// Once you get the observation, Return the AI response based on START prompt and observations

// You can manage tasks by adding,viewing,updating,deleting them.
// You must strictly follow the JSON output format.

// Todo DB Schema:
// id: Int and Primary Key
// todo: String
// created_at: Date Time
// updated_at: Date Time


// Available Tools:
//   -getAllTodos():Return all the Todos from Database
//   -createTodos(todo: string):Create a new Todo in the DB and take todo as a string and return the ID of created todo
//   -deleteTodo(id: number):Delete the Todo todo by ID given in the DB
//   -searchTodo(query: string):Search for all the todos matching the query string using ilike in DB


// Example:

// START:
//  {"type":"user","user":"Add a task for shopping groceries."}
//  {"type":"plan","plan":"I will use try to get more context on what user needs to shop."}
//  {"type":"output","output":"Can u tell me what all items you want to shop for?"}
//  {"type":"user","user":"I Want to shop for milk, cheese, eggs and bread."}
//  {"type":"plan","plan":"I will use addTask to create a new Todo in DB."}
//  {"type":"action","function ":"createTodos","input":"Shopping for milk, cheese, eggs and bread."}
//  {"type":"observation","observation":"2"}
//  {"type":"output","output":"Your todo has been added successfully."}

// `


//*************************************System Prompt End*************************************************//

 // Initialize message array with the system prompt









//***************************************AI Agent*******************************************************//

// const message = [{
//     role: 'system',
//     content: SYSTEM_PROMPT
// }];


// while (true) {
//     const query = readlineSync.question('>> : ');
//     const userMessage = {
//         type: 'user',
//         user: query,
//     };

//     message.push({
//         role: 'user',
//         content: JSON.stringify(userMessage)
//     });
//     message.push({ role: 'user', content: JSON.stringify(userMessage) });
//     while (true) {
//         const chat = await openai.chat.completions.create({
//             model: 'gpt-4o-mini',
//             messages: message,
//             response_format: { type: 'json_object' }
//         });


//         const result = chat.choices[0].message.content;

//         message.push({
//             role: 'assistant',
//             content: result
//         });
//         const action = JSON.parse(result);


//         if (action.type === 'output') {
//             console.log(`🤖: ${action.output}`);
//             break;
//         }

//         else if (action.type === 'action') {
//             const fn = tools[action.function];


//             if (!fn) throw new Error(`Invalid tool call`);
//             const observation = await fn(action.input);
//             const observationMessage = {
//                 type: 'observation',
//                 observation: observation
//             }
//             message.push({
//                 role: 'developer',
//                 content: JSON.stringify(observationMessage)
//             });
//         }
//     }
// }



//***************************************AI Agent End*******************************************************//







//********************************Express Routes Start***********************************************//


app.post('/ai-response', async (req, res) => {
    const message = [
        {
            role: 'system',
            content: SYSTEM_PROMPT,
        },
    ];
    const query = req.body.message; // Query from frontend
   

   

    console.log(`Query: ${query}`);

    if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
    }

    try {
        // Add user message to the conversation
        const userMessage = {
            type: 'user',
            user: query,
        };

        message.push({ role: 'user', content: JSON.stringify(userMessage) });

        while (true) {
            // Call OpenAI API to get chat completion
            const chat = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: message,
                response_format: { type: 'json_object' },
            });

            const result = chat.choices[0].message.content;

            // Add AI's response to the message array
            message.push({
                role: 'assistant',
                content: result,
            });

            const action = JSON.parse(result);

            // Handle output action
            if (action.type === 'output') {
               
      // Return the output and tasks to the frontend
                return res.json({ response: action.output });
            }
            
            // Handle action execution
            else if (action.type === 'action') {
                const fn = tools[action.function];

                if (!fn) {
                    throw new Error(`Invalid tool call: ${action.function}`);
                }

                // Execute the tool and capture the observation
                const observation = await fn(action.input);

                const observationMessage = {
                    type: 'observation',
                    observation,
                };

                // Add observation to the message array
                message.push({
                    role: 'developer',
                    content: JSON.stringify(observationMessage),
                });
            }
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});




app.post('/get-todo', async (req, res) => {
    try {
        const todos = await getAllTodos();
       
        
        res.json({tasks:todos});
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'An error occurred while fetching todos.' });
    }
});



//********************************Express Routes End***********************************************//




app.get('/', (req, res) => {
    res.send('<h1>Backend Server is running!!!!!</h1>');
})

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})





