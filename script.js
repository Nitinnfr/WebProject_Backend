
const API_URL = 'https://api-node-serverr.onrender.com/api/books';



async function fetchBooks(search = '') {
    const res = await fetch(`${API_URL}?search=${search}`);
    const books = await res.json();
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    books.forEach(book => {
        const li = document.createElement('li');
        li.className = 'book-item flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-600 rounded-lg shadow-sm transition duration-300';
        li.innerHTML = `
            <div>
                <h3 class="font-bold">${book.title}</h3>
                <p>Author: ${book.author} | ISBN: ${book.isbn} | Year: ${book.publishedYear}</p>
            </div>
            <div>
                <button onclick="editBook('${book._id}', '${book.title}', '${book.author}', '${book.isbn}', ${book.publishedYear})" class="text-blue-500 hover:text-blue-700 mr-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                <button onclick="deleteBook('${book._id}')" class="text-red-500 hover:text-red-700"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
            </div>
        `;
        bookList.appendChild(li);
    });
}

// Add book
document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value,
        publishedYear: document.getElementById('publishedYear').value
    };
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });
    fetchBooks();
    e.target.reset();
});

// Edit book
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
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });
    fetchBooks();
    closeModal();
});

// Delete book
async function deleteBook(id) {
    if (confirm('Delete this book?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchBooks();
    }
}

// Close modal
document.getElementById('closeModal').addEventListener('click', closeModal);
function closeModal() {
    document.getElementById('editModal').classList.add('hidden');
}

// Search
document.getElementById('searchInput').addEventListener('input', (e) => fetchBooks(e.target.value));

// Dark Mode Toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

// Initial fetch
fetchBooks();