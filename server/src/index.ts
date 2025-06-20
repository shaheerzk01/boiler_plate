import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';

const app: Application = express();
const PORT = 8989;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
