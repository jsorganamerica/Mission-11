import { useEffect, useState } from "react";


interface Book {
    bookID: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    category: string;
    pageCount: number;
    price: number;
}

interface ApiResponse {
    totalCount: number;
    books: Book[];
}

interface Props {
    addToCart: (book: { bookID: number; title: string; price: number }) => void;
    onViewCart: () => void;
    totalItems: number;
}

export default function BookList({ addToCart, onViewCart, totalItems }: Props) {
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [sortAsc, setSortAsc] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const totalPages = Math.ceil(totalCount / pageSize);

    useEffect(() => {
        fetch("http://localhost:5293/api/books/categories")
            .then((res) => res.json())
            .then((data: string[]) => setCategories(data));
    }, []);

    useEffect(() => {
        fetch(
            `http://localhost:5293/api/books?page=${page}&pageSize=${pageSize}&sortAsc=${sortAsc}&category=${selectedCategory}`
        )
            .then((res) => res.json())
            .then((data: ApiResponse) => {
                setBooks(data.books);
                setTotalCount(data.totalCount);
            });
    }, [page, pageSize, sortAsc, selectedCategory]);

    const handlePageSize = (val: number) => {
        setPageSize(val);
        setPage(1);
    };

    const handleSort = () => {
        setSortAsc((prev) => !prev);
        setPage(1);
    };

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setPage(1);
    };

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">📚 Bookstore</h1>
                <button className="btn btn-success position-relative" onClick={onViewCart}>
                    🛒 Cart
                    {totalItems > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {totalItems}
                        </span>
                    )}
                </button>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                <div>
                    <label className="me-2 fw-semibold">Results per page:</label>
                    {[5, 10, 25].map((n) => (
                        <button
                            key={n}
                            className={`btn btn-sm me-1 ${pageSize === n ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => handlePageSize(n)}
                        >
                            {n}
                        </button>
                    ))}
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={handleSort}>
                    Sort by Title {sortAsc ? "▲" : "▼"}
                </button>
                <div>
                    <label className="me-2 fw-semibold">Category:</label>
                    <select
                        className="form-select form-select-sm d-inline-block w-auto"
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                        <option value="">All</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="table table-striped table-hover table-bordered">
                <thead className="table-dark">
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Publisher</th>
                    <th>ISBN</th>
                    <th>Classification</th>
                    <th>Category</th>
                    <th>Pages</th>
                    <th>Price</th>
                    <th>Add to Cart</th>
                </tr>
                </thead>
                <tbody>
                {books.map((book) => (
                    <tr key={book.bookID}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.publisher}</td>
                        <td>{book.isbn}</td>
                        <td>{book.classification}</td>
                        <td>{book.category}</td>
                        <td>{book.pageCount}</td>
                        <td>${book.price.toFixed(2)}</td>
                        <td>
                            <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => addToCart({ bookID: book.bookID, title: book.title, price: book.price })}
                            >
                                + Add
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted">
                    Showing {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount} books
                </span>
                <nav>
                    <ul className="pagination mb-0">
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPage((p) => p - 1)}>
                                Previous
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setPage(p)}>
                                    {p}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPage((p) => p + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}