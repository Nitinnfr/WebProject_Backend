// ✅ Use your actual Render backend URL here
const API_URL = 'https://api-node-servers.onrender.com/api/books';

// ==================== FETCH BOOKS ====================
async function fetchBooks(search = '') {
    try {
        const res = await fetch(`${API_URL}?search=${encodeURIComponent(search)}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const books = await res.json();
        renderBooks(books);
    } catch (err) {
        console.error("❌ Failed to fetch books:", err);
        document.getElementById('bookList').innerHTML =s
            `<li class="text-red-500">⚠️ Failed to load books. Please try again later.</li>`;
    }
}

// Render books in the list
function renderBooks(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    if (books.length === 0) {
        bookList.innerHTML = `<li class="text-gray-500">No books found.</li>`;
        return;
    }

    books.forEach(book => {
        const li = document.createElement('li');
        li.className = 'book-item flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-600 rounded-lg shadow-sm transition duration-300';
        li.innerHTML = `
            <div>
                <h3 class="font-bold">${book.title}</h3>
                <p>Author: ${book.author} | ISBN: ${book.isbn} | Year: ${book.publishedYear}</p>
            </div>
            <div>
                <button onclick="editBook('${book._id}', '${book.title}', '${book.author}', '${book.isbn}', ${book.publishedYear})"
                    class="text-blue-500 hover:text-blue-700 mr-2">✏️</button>
                <button onclick="deleteBook('${book._id}')"
                    class="text-red-500 hover:text-red-700">🗑️</button>
            </div>
        `;
        bookList.appendChild(li);
    });
}

// ==================== ADD BOOK ====================
document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value,
        publishedYear: document.getElementById('publishedYear').value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        await res.json();
        fetchBooks();
        e.target.reset();
    } catch (err) {
        alert("❌ Failed to add book: " + err.message);
    }
});

// ==================== EDIT BOOK ====================
function editBook(id, title, author, isbn, publishedYear) {
    document.getElementById('editId').value = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editAuthor').value = author;
    document.getElementById('editIsbn').value = isbn;
    document.getElementById('editPublishedYear').value = publishedYear;
    document.getElementById('editModal').classList.remove('hidden');
}

document.getElementById('editBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const book = {
        title: document.getElementById('editTitle').value,
        author: document.getElementById('editAuthor').value,
        isbn: document.getElementById('editIsbn').value,
        publishedYear: document.getElementById('editPublishedYear').value
    };

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        await res.json();
        fetchBooks();
        closeModal();
    } catch (err) {
        alert("❌ Failed to update book: " + err.message);
    }
});

// ==================== DELETE BOOK ====================
async function deleteBook(id) {
    if (confirm('Delete this book?')) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            await res.json();
            fetchBooks();
        } catch (err) {
            alert("❌ Failed to delete book: " + err.message);
        }
    }
}

// ==================== CLOSE MODAL ====================
document.getElementById('closeModal').addEventListener('click', closeModal);
function closeModal() {
    document.getElementById('editModal').classList.add('hidden');
}

// ==================== SEARCH ====================
document.getElementById('searchInput').addEventListener('input', (e) => fetchBooks(e.target.value));

// ==================== DARK MODE ====================
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

// ==================== INITIAL FETCH ====================
fetchBooks();
