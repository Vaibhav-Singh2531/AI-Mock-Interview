import express from 'express';
import cors from 'cors';
import path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Main health check port
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Express server is running perfectly.' });
});

// Import and use routes (Will add them in Part 2)
// import feedbackRoutes from './routes/feedback';
// import vapiRoutes from './routes/vapi';
// app.use('/api/feedback', feedbackRoutes);
// app.use('/api/vapi', vapiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
