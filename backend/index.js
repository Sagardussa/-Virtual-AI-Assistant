import express, { json } from 'express';
import dotenv from 'dotenv';
dotenv.config()
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import userRouter from './routes/uesr.routes.js';
import geminiRespone from './gemini.js';

const app = express();

const port = process.env.PORT || 5000;
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
// app.use("",(req,res)=> {
// res.json("helllo")
// })
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

// app.get('/', async (req, res) => {
//     try {
//         const prompt = req.query.prompt;

//         if (!prompt) {
//             return res.status(400).json({ error: 'Missing prompt query parameter' });
//         }

//         const data = await geminiRespone(prompt);
        
//         res.json(data);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });



app.listen(
    port, () => {
        connectDB();
        console.log("server started")
    }
)