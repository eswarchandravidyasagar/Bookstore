import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Bookstore = () => {
  const [books, setBooks] = useState([]);
 
  // Fetch books from the API
  

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const createBook = async (title, author) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/book', {
        title,
        author,
      });
      fetchBooks(); // Re-fetch books to update the list
      return response.data;
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/book/${bookId}`);
      fetchBooks(); // Re-fetch books to update the list
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

   
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
    
  <h1 className="text-3xl font-semibold text-gray-700 mb-6">Bookstore</h1>

  <form
    className="flex mb-6 bg-white shadow-lg rounded-lg p-4"
    onSubmit={async (e) => {
      e.preventDefault();
      const title = e.target.title.value;
      const author = e.target.author.value;
      await createBook(title, author);
      e.target.reset();
    }}
  >
    <input
      type="text"
      name="title"
      placeholder="Title"
      className="flex-grow mr-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
    <input
      type="text"
      name="author"
      placeholder="Author"
      className="flex-grow mr-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
    >
      Add Book
    </button>
  </form>

  <ul>
    {books.map((book) => (
      <li key={book.id} className="mb-3 bg-white shadow-lg rounded-lg p-4 flex justify-between items-center">
        <div>
          <span className="font-semibold text-gray-700">{book.title}</span> by <span className="text-gray-600">{book.author}</span>
        </div>
        <button
          className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
          onClick={() => deleteBook(book.id)}
        >
          Delete
        </button>
       
      </li>
    ))}
  </ul>
</div>

  );
};

export default Bookstore;
