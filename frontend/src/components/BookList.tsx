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

export default function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [sortAsc, setSortAsc] = useState(true);

    const totalPages = Math.ceil(totalCount / pageSize);

    useEffect(() => {
        fetch(
            `http://localhost:5293/api/books?page=${page}&pageSize=${pageSize}&sortAsc=${sortAsc}`
        )
            .then((res) => res.json())
            .then((data: ApiResponse) => {
                setBooks(data.books);
                setTotalCount(data.totalCount);
            });
    }, [page, pageSize, sortAsc]);

    const handlePageSize = (val: number) => {
        setPageSize(val);
        setPage(1);
    };

    const handleSort = () => {
        setSortAsc((prev) => !prev);
        setPage(1);
    };

    return (
        <div className="container my-4">
            <h1 className="mb-4">📚 Bookstore</h1>

            <div className="d-flex align-items-center gap-3 mb-3">
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
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="d-flex align-items-center justify-content-between">
        <span className="text-muted">
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount} books
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