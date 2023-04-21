const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRouter = require('./routes/auth');
const agenciesRouter = require('./routes/agencies');
const clientsRouter = require('./routes/clients');

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

// Create Express app
const app = express();

// Use middleware
app.use(express.json());

// Define routes
app.use('/api/auth', authRouter);
app.use('/api/agencies', agenciesRouter);
app.use('/api/clients', clientsRouter);

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
