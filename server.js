import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appletv', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database Models
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ShowSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['tvshow', 'movie'], required: true },
  category: { type: String, required: true },
  image: String,
  description: String,
  rating: Number,
  year: Number,
  cast: [String],
  tags: [String],
  isTrending: Boolean,
  isFeatured: Boolean,
  seasons: Number,
  episodes: Number,
  runtime: Number,
  seasonsData: [{
    seasonNumber: Number,
    year: Number,
    description: String,
    episodes: [{
      episodeNumber: Number,
      title: String,
      description: String,
      duration: Number,
      rating: Number,
      image: String,
      director: String,
      writer: String,
      releaseDate: Date
    }]
  }]
});

const NewsSchema = new mongoose.Schema({
  title: String,
  date: String,
  excerpt: String,
  image: String,
  category: String,
  author: String
});

const ActorSchema = new mongoose.Schema({
  name: String,
  trending: Number,
  shows: [String],
  image: String,
  bio: String
});

const User = mongoose.model('User', UserSchema);
const Show = mongoose.model('Show', ShowSchema);
const News = mongoose.model('News', NewsSchema);
const Actor = mongoose.model('Actor', ActorSchema);

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin Middleware
const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Routes

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin
    const isAdmin = email === 'admin@apple.tv' || email === 'ginchevalex@gmail.com';

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      isAdmin
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
      token,
      user: {
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
      token,
      user: {
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Shows Routes
app.get('/api/shows', async (req, res) => {
  try {
    const { type, category } = req.query;
    let filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;

    const shows = await Show.find(filter);
    res.json(shows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/shows/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }
    res.json(show);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/shows', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const show = new Show(req.body);
    await show.save();
    res.json(show);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/shows/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }
    res.json(show);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/shows/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ error: 'Show not found' });
    }
    res.json({ message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// News Routes
app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/news', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newsItem = new News(req.body);
    await newsItem.save();
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/news/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newsItem = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!newsItem) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/news/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newsItem = await News.findByIdAndDelete(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Actors Routes
app.get('/api/actors', async (req, res) => {
  try {
    const actors = await Actor.find().sort({ trending: -1 });
    res.json(actors);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/actors', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const actor = new Actor(req.body);
    await actor.save();
    res.json(actor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/actors/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const actor = await Actor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actor) {
      return res.status(404).json({ error: 'Actor not found' });
    }
    res.json(actor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/actors/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const actor = await Actor.findByIdAndDelete(req.params.id);
    if (!actor) {
      return res.status(404).json({ error: 'Actor not found' });
    }
    res.json({ message: 'Actor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize with sample data
app.post('/api/init', async (req, res) => {
  try {
    // Clear existing data
    await Show.deleteMany({});
    await News.deleteMany({});
    await Actor.deleteMany({});

    // Sample shows
    const sampleShows = [
      {
        title: "Stellar Horizons",
        type: "tvshow",
        category: "Sci-Fi",
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",
        description: "A crew of explorers ventures into the unknown reaches of space, discovering ancient civilizations and facing cosmic threats.",
        rating: 9.2,
        seasons: 3,
        episodes: 24,
        cast: ["Emma Stone", "Oscar Isaac", "Tilda Swinton"],
        year: 2024,
        isTrending: true,
        isFeatured: true,
        tags: ["Space", "Adventure", "Mystery"],
        seasonsData: [
          {
            seasonNumber: 1,
            year: 2024,
            description: "The beginning of an epic space journey",
            episodes: [
              {
                episodeNumber: 1,
                title: "The Final Frontier",
                description: "The crew embarks on their maiden voyage into deep space, encountering unexpected challenges.",
                duration: 52,
                rating: 8.9,
                image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80",
                director: "Christopher Nolan",
                writer: "Jonathan Nolan",
                releaseDate: "2024-01-15"
              }
            ]
          }
        ]
      },
      {
        title: "Quantum Leap",
        type: "movie",
        category: "Sci-Fi",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        description: "A physicist accidentally opens a portal to parallel universes and must find his way home.",
        rating: 8.9,
        runtime: 142,
        cast: ["Ryan Gosling", "Lupita Nyong'o", "Mark Ruffalo"],
        year: 2024
      }
    ];

    // Sample news
    const sampleNews = [
      {
        title: "Stellar Horizons Renewed for Season 4",
        date: "2 days ago",
        excerpt: "The hit sci-fi series gets the green light for another season following record-breaking viewership.",
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80",
        category: "Series News",
        author: "Entertainment Weekly"
      }
    ];

    // Sample actors
    const sampleActors = [
      { 
        name: "Emma Stone", 
        trending: 98, 
        shows: ["Stellar Horizons"], 
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", 
        bio: "Academy Award winning actress" 
      }
    ];

    await Show.insertMany(sampleShows);
    await News.insertMany(sampleNews);
    await Actor.insertMany(sampleActors);

    res.json({ message: 'Sample data initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
