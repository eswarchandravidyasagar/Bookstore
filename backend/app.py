from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuring the SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///books.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database model for Books
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    author = db.Column(db.String(80), nullable=False)


    def to_dict(self):
        return {"id": self.id, "title": self.title, "author": self.author}

# Initialize the database
@app.before_first_request
def create_tables():
    db.create_all()




@app.route('/api/books', methods=['GET'])
def list_books():
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books])

@app.route('/api/book', methods=['POST'])
def add_book():
    data = request.json
    new_book = Book(title=data['title'], author=data['author'])
    db.session.add(new_book)
    db.session.commit()
    return jsonify(new_book.to_dict()), 201


# edit book


@app.route('/api/book/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.get(book_id)
    if book:
        db.session.delete(book)
        db.session.commit()
        return jsonify({"message": "Book deleted"}), 200
    else:
        return jsonify({"message": "Book not found"}), 404

if __name__ == "__main__":
    app.run()
