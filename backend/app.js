const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const Competitors = require('./models/Competitors');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Routes
app.get('/', (req, res) => res.send('Hello, world!'));

app.post('/candidate', async (req, res) => {
  const { candidateId, name } = req.body;
  if (!candidateId || !name) return res.status(400).json("Please fill all the fields");

  const competitor = await Competitors.create({ candidateId, name });
  res.status(200).json({ message: "User created successfully", competitor });
});

app.get('/candidates', async (req, res) => {
  try {
    const all = await Competitors.find();
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});

app.get('/points', async (req, res) => {
  try {
    const allPoints = await Competitors.find().select("candidateId points");
    res.json(allPoints);
  } catch (error) {
    res.status(500).json("Failed to fetch points");
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log("✅ Client connected");

  Competitors.find().select("candidateId points").then(points => {
    socket.emit('pointsUpdated', points);
  });

  socket.on('updatePoints', async (updated) => {
    try {
      for (const item of updated) {
        await Competitors.updateOne(
          { candidateId: item.candidateId },
          { $set: { points: item.points } }
        );
      }
      const allUpdated = await Competitors.find().select("candidateId points");
      io.emit('pointsUpdated', allUpdated);
    } catch (err) {
      console.error("Error updating points:", err);
    }
  });
});
  
// DB & Server Start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  server.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
}).catch(err => console.error('❌ MongoDB error:', err));
