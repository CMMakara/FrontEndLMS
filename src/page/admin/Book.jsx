import React from 'react';
import useBooks from '../../hook/useBooks';
import useAuthors from '../../hook/useAuthor'
import useCategory from '../../hook/useCategory'
import Card from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
function Book() {
  const navigate = useNavigate()
  const { books, getAllBooks } = useBooks();
  const {author} = useAuthors();
  const { category } = useCategory(1, {per_page : 10000 });
  return (
    <div
      className="container-fluid p-4"
      style={{
        background: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            <i className="bi bi-book me-2"></i>
            Book Dashboard
          </h2>
          <p className="text-muted">Overview of your library system</p>
        </div>

        <button className="btn btn-dark px-4" onClick={()=> navigate('/admin/books/create')}>
          <i className="bi bi-plus-circle-fill me-2 text-white"></i>
          Add Book
        </button>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">Total Books</small>
              <h2 className="fw-bold mt-2">{books.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">Authors</small>
              <h2 className="fw-bold mt-2">{author.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">Categories</small>
              <h2 className="fw-bold mt-2">{category.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">Available</small>
              <h2 className="fw-bold mt-2 text-success">1,180</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Books */}
      <h4 className="fw-bold mb-3">Recent Books</h4>

      <div className="row g-4">
        {books?.length > 0 ? (
          books.map((data) => (
            <div className="col-12" key={data.id}>
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body p-4">
                  <div className="row align-items-center">

                    {/* Book Cover */}
                    <div className="col-md-2 text-center">
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          width: "120px",
                          height: "170px",
                          background: "#f1f5f9",
                          borderRadius: "15px",
                          margin: "auto",
                          overflow: "hidden",
                        }}
                      >
                        {data.thumbnail ? (
                          <img
                            src={data.thumbnail}
                            alt={data.book_title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <i
                            className="bi bi-book-half"
                            style={{ fontSize: "4rem", color: "#94a3b8" }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Main Info */}
                    <div className="col-md-7">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h4 className="fw-bold mb-0">
                          {data.book_title}
                        </h4>

                        <span
                          className={`badge ${data.status === "available"
                            ? "bg-success"
                            : "bg-danger"
                            }`}
                        >
                          {data.status}
                        </span>
                      </div>

                      <p className="text-muted mb-3">
                        {data.description}
                      </p>

                      <div className="row">
                        <div className="col-md-6">
                          <p className="mb-2">
                            <i className="bi bi-person me-2"></i>
                            Athor Name : {data.author_name}
                          </p>

                          <p className="mb-2">
                            <i className="bi bi-building me-2"></i>
                            Publisher Name : {data.publisher_name}
                          </p>

                          <p className="mb-0">
                            <i className="bi bi-upc me-2"></i>
                            bar code book : {data.isbn}
                          </p>
                        </div>

                        <div className="col-md-6">
                          <p className="mb-2">
                            <i className="bi bi-tag me-2"></i>
                            {data.category_name}
                          </p>

                          <p className="mb-2">
                            <i className="bi bi-calendar me-2"></i>
                            {data.publish_year}
                          </p>

                          <p className="mb-0">
                            <i className="bi bi-translate me-2"></i>
                            {data.language}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats + Action */}
                    <div className="col-md-3">
                      <div className="row text-center g-3">

                        <div className="col-6">
                          <div className="bg-light rounded p-3">
                            <h5 className="fw-bold mb-0">
                              {data.pages}
                            </h5>
                            <small>Pages</small>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="bg-light rounded p-3">
                            <h5 className="fw-bold mb-0">
                              {data.total_copies}
                            </h5>
                            <small>Copies</small>
                          </div>
                        </div>

                        <div className="col-12">
                          <button className="btn btn-primary w-100">
                            <i className="bi bi-eye me-2"></i>
                            View Details
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-5">
            No books found
          </div>
        )}
      </div>
    </div>
  );
}

export default Book;
