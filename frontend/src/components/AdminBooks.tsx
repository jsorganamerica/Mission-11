import { useEffect, useState } from "react";

const API = "https://bookstore-backend-james-bhawdhhjceaphefs.centralus-01.azurewebsites.net/api/books";

type Book = {
    bookID: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    category: string;
    pageCount: number;
    price: number;
};

const emptyBook: Omit<Book, "bookID"> = {
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    classification: "",
    category: "",
    pageCount: 0,
    price: 0,
};

export default function AdminBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [formData, setFormData] = useState<Omit<Book, "bookID">>(emptyBook);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    const fetchAllBooks = async () => {
        const res = await fetch(`${API}?page=1&pageSize=1000`);
        const data = await res.json();
        setBooks(data.books);
    };

    useEffect(() => {
        fetchAllBooks();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "pageCount" || name === "price" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId !== null) {
            await fetch(`${API}/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookID: editingId, ...formData }),
            });
        } else {
            await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookID: 0, ...formData }),
            });
        }
        setFormData(emptyBook);
        setEditingId(null);
        setShowForm(false);
        fetchAllBooks();
    };

    const handleEdit = (book: Book) => {
        setEditingId(book.bookID);
        setFormData({
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            isbn: book.isbn,
            classification: book.classification,
            category: book.category,
            pageCount: book.pageCount,
            price: book.price,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this book?")) return;
        await fetch(`${API}/${id}`, { method: "DELETE" });
        fetchAllBooks();
    };

    const fields: { label: string; name: keyof Omit<Book, "bookID">; type?: string }[] = [
        { label: "Title", name: "title" },
        { label: "Author", name: "author" },
        { label: "Publisher", name: "publisher" },
        { label: "ISBN", name: "isbn" },
        { label: "Classification", name: "classification" },
        { label: "Category", name: "category" },
        { label: "Page Count", name: "pageCount", type: "number" },
        { label: "Price", name: "price", type: "number" },
    ];

    return (
        <div className="container mt-4">
            <h2>Admin — Manage Books</h2>

            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setFormData(emptyBook);
                    setEditingId(null);
                    setShowForm(true);
                }}
            >
                + Add New Book
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="card p-4 mb-4">
                    <h5>{editingId !== null ? "Edit Book" : "Add New Book"}</h5>
                    <div className="row g-2">
                        {fields.map(({ label, name, type }) => (
                            <div className="col-md-6" key={name}>
                                <label className="form-label">{label}</label>
                                <input
                                    className="form-control"
                                    type={type || "text"}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 d-flex gap-2">
                        <button type="submit" className="btn btn-success">
                            {editingId !== null ? "Update Book" : "Add Book"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {books.map((book) => (
                    <tr key={book.bookID}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.category}</td>
                        <td>${book.price.toFixed(2)}</td>
                        <td>
                            <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => handleEdit(book)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(book.bookID)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}