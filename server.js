const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());


mongoose.connect("mongodb://localhost:27017/librarydb")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));


const Book = require('./models/Book');

app.get('/api/books', async (req, res) => {
    const search = req.query.search || '';
    const books = await Book.find({
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } }
        ]
    });
    res.json(books);
});

// Add a book
app.post('/api/books', async (req, res) => {
    const { title, author, isbn, publishedYear } = req.body;
    const book = new Book({ title, author, isbn, publishedYear });
    await book.save();
    res.json(book);
});

// Update a book
app.put('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedBook);
});

// Delete a book
app.delete('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.json({ message: 'Book deleted' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));