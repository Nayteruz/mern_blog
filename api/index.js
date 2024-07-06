import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';


dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);  
  })

const app = express();

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

app.use('/api/user', userRoutes);