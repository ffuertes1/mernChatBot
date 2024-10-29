// server/index.js - Backend of the SaaS chatbot
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = 5000;
const JWT_SECRET = 'mysecretkey';

// Middleware
app.use(cors());
app.use(express.json());

// Connection to MongoDB Atlas
mongoose.connect(
  'mongodb+srv://<user>:<password>@cluster0.rtb7f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error:', error));

// MongoDB schemas and models
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const ConversationSchema = new mongoose.Schema({
  userId: String,
  message: String,
  response: String,
  date: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);
const Conversation = mongoose.model('Conversation', ConversationSchema);

// Authentication routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.json({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.json({ token });
});

// Chatbot route
app.post('/chat', async (req, res) => {
    const { message, token } = req.body;
    try {
        const { userId } = jwt.verify(token, JWT_SECRET);
        console.log('UserId obtained from token:', userId);
        
        // Basic response
        let response;
        if (message.includes('hello')) {
            response = 'Hello! How can I help you?';
        } else if (message.includes('goodbye')) {
            response = 'See you later!';
        } else {
            response = 'Sorry, I don\'t understand that question.';
        }

        // Save the conversation
        const conversation = new Conversation({ userId, message, response });
        await conversation.save();
        console.log('Conversation saved:', conversation);
        res.json({ response });
    } catch (error) {
        console.error('JWT token error:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
