const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const aiRoutes = require('./routes/aiRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Increase payload size limit
app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workspace',workspaceRoutes);
app.use('/api/ai',aiRoutes) ;


app.get('/', (req, res) => {
  res.send('Hello World!');
});
 

// Connect to MongoDB
mongoose.connect(`${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}`, {})
.then(() => {  console.log('Connected to MongoDB ');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
