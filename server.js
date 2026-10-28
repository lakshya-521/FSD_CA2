require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/Book');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Connection error', err);
});

app.post('/api/books', async (req, res) => {
  try {
    const { title, author, category } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const book = new Book({ title, author, category });
    const savedBook = await book.save();
    
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/books', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(limit);
    const totalRecords = await Book.countDocuments();

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      books
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/books/:id', async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});