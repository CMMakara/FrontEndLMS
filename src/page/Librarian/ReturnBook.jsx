import React, { useEffect, useState } from 'react';
import '../../assets/returnBook.css';
import Input from '../../components/ui/Input';
import useBorrows from '../../hook/useBorrow';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/Textarea';
import { useToast } from '../../context/ToastContext.jsx';

const ReturnBook = () => {
  const [search, setSearch] = useState('');
  const [borrowerInfo, setBorrowerInfo] = useState(null);
  const [borrowBooks, setBorrowBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [returnDetails, setReturnDetails] = useState({
    bookCondition: 'Excellent',
    notes: '',
  });
  const [borrowPage, setBorrowPage] = useState(1);
  const [returnPage, setReturnPage] = useState(1);
  const { showToast } = useToast();

  const per_page = 5;
  const { borrow, getAllBorrowRecord, pagination, returnBook } = useBorrows();
  useEffect(() => {
    getAllBorrowRecord(search, 1, 10000);
  }, [search]);
  const borrowedBooks = borrow.filter((item) =>
    ['borrowed', 'overdue'].includes(item.status?.toLowerCase()),
  );

  const returnedBooks = borrow
    .filter((item) => item.status?.toLowerCase() === 'returned')
    .map((item) => ({
      ...item,
      status: 'Complete',
    }));

  const paginatedBorrowBooks = borrowedBooks.slice(
    (borrowPage - 1) * per_page,
    borrowPage * per_page,
  );

  const paginatedReturnBooks = returnedBooks.slice(
    (returnPage - 1) * per_page,
    returnPage * per_page,
  );

  const column = [
    {
      header: '#',
      accessor: 'id',
      render: (_, rowIndex) => (borrowPage - 1) * per_page + rowIndex + 1,
    },
    { header: 'Member name', accessor: 'member_name' },
    { header: 'title', accessor: 'book_title' },
    { header: 'author', accessor: 'author_name' },
    { header: 'category', accessor: 'category_name' },
    {
      header: 'Borrow Date',
      accessor: 'borrow_date',
      render: (row) => new Date(row.borrow_date).toLocaleDateString('en-GB'),
    },
    {
      header: 'Due Date',
      accessor: 'due_date',
      render: (row) => new Date(row.due_date).toLocaleDateString('en-GB'),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (book) => {
        const status = book.status?.toLowerCase();

        return (
          <span
            className={`badge ${status === 'overdue'
              ? 'bg-warning text-dark'
              : status === 'borrowed'
                ? 'bg-danger'
                : 'bg-success'
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (book) => {
        const status = book.status?.toLowerCase();

        if (status === 'returned') return null;

        return (
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => setSelectedBook(book)}
          >
            <i className="bi bi-arrow-return-left"></i> Return
          </button>
        );
      },
    },
  ];

  const columnReturn = [
    {
      header: '#',
      accessor: 'id',
      render: (_, rowIndex) => (returnPage - 1) * per_page + rowIndex + 1,
    },
    { header: 'Member name', accessor: 'member_name' },
    { header: 'book title', accessor: 'book_title' },
    {
      header: 'Return Date',
      accessor: 'return_date',
      render: (row) =>
        row.return_date
          ? new Date(row.return_date).toLocaleDateString('en-GB')
          : '-',
    },
    {
      header: 'Late Days',
      accessor: 'due_date',
      render: (row) => {
        const dueDate = new Date(row.due_date);
        const endDate =
          ['returned', 'complete'].includes(row.status?.toLowerCase())
            ? new Date(row.return_date)
            : new Date();

        const lateDays = Math.max(
          0,
          Math.floor((endDate - dueDate) / (1000 * 60 * 60 * 24))
        );

        return (
          <span
            className="badge"
            style={{
              backgroundColor: lateDays > 0 ? '#ff4d4f' : '#52c41a',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '8px',
              fontWeight: '600',
            }}
          >
            {lateDays > 0 ? `${lateDays} day(s)` : 'On time'}
          </span>
        );
      }
    },
    {
      header: 'Fine',
      accessor: 'fine',
      render: (row) => {
        const usd = Number(row.fine || 0) / 4100;
        return `$${usd.toFixed(2)}`;
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <span className="badge bg-success">{row.status}</span>,
    },
  ];
  // Handle Return Details Change
  const handleReturnDetailsChange = (e) => {
    const { name, value } = e.target;
    setReturnDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook?.id) return;
    const payload = {
      book_condition: returnDetails.bookCondition,
      note: returnDetails.notes,
    };
    const result = await returnBook(selectedBook?.id, payload);
    if (result) {
      setSelectedBook(null);
    }
    await getAllBorrowRecord(search, 1, 10000);
  };
  const calculateLateDays = () => {
    if (!selectedBook) return 0;

    const dueDate = new Date(selectedBook.due_date);
    dueDate.setHours(0, 0, 0, 0);

    const endDate = selectedBook.return_date
      ? new Date(selectedBook.return_date)
      : new Date();

    endDate.setHours(0, 0, 0, 0);

    return Math.max(
      0,
      Math.round((endDate - dueDate) / 86400000)
    );
  };

  const lateDays = calculateLateDays();
  const fine = selectedBook?.fine || 0;


  const formatDate = (d) => new Date(d).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  const borrowedTodayCount = borrow.filter(
    (item) => formatDate(item.borrow_date) === today
  ).length;

  const returnedTodayCount = borrow.filter((item) => {
    if (!item.return_date) return false;

    return (
      new Date(item.return_date).toISOString().split('T')[0] === today
    );
  }).length;

  const overdueCount = borrow.filter((item) => {
    return item.status?.toLowerCase() === 'overdue';
  }).length;

  const totalFineUSD =
    borrow
      .filter((b) => b.status?.toLowerCase() === 'returned')
      .reduce((sum, b) => sum + Number(b.fine || 0), 0) / 4100;

  return (
    <div className="return-book-container">
      {/* Page Header */}
      <div className="page-header mb-4">
        <div>
          <h1 className="page-title">
            <i className="bi bi-arrow-return-left"></i> Return Book
          </h1>
          <p className="page-subtitle">
            Manage returned books and update availability status.
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card stat-card-blue">
            <div className="stat-icon text-white">
              <i className="bi bi-journal-bookmark"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Books Borrowed Today</p>
              <h3 className="stat-number">{borrowedTodayCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card stat-card-green">
            <div className="stat-icon text-white">
              <i className="bi bi-arrow-return-left"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Books Returned Today</p>
              <h3 className="stat-number">{returnedTodayCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card stat-card-orange">
            <div className="stat-icon text-white">
              <i className="bi bi-exclamation-circle"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Overdue Books</p>
              <h3 className="stat-number">{overdueCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="stat-card stat-card-purple">
            <div className="stat-icon text-white">
              <i className="bi bi-cash-stack"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Fines</p>
              <h3 className="stat-number">$ {totalFineUSD.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Search Borrowed Book */}
      <div className="card mb-4 dashboard-card">
        <div className="card-header border-0">
          <h5 className="card-title mb-0">
            <i className="bi bi-search"></i> Search Borrowed Book
          </h5>
        </div>

        <div className="card-body">
          <div className="row align-items-end g-3">
            <div className="col-md-4">
              <Input
                width="100%"
                label="Search Member / Member Code / Book Title"
                placeholder="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Borrowed Books List */}
      <div className="card mb-4 dashboard-card">
        <div className="card-header border-0">
          <h5 className="card-title mb-0">
            <i className="bi bi-book"></i> Borrowed Books
          </h5>
        </div>
        <div className="card-body p-0">
          <Table hover={false} columns={column} data={paginatedBorrowBooks} />
        </div>
      </div>
      {/* pagination */}
      <Pagination
        currentPage={borrowPage}
        onPageChange={setBorrowPage}
        totalPages={Math.ceil(borrowedBooks.length / per_page)}
      />

      {/* Section 3: Selected Book Summary */}
      {selectedBook && (
        <div className="row mb-4 g-4 fade-in">
          <div className="col-md-5">
            <div className="card dashboard-card h-100 border-start border-success border-3">
              <div className="card-header border-0 bg-transparent pt-3">
                <h5 className="card-title mb-0 text-success fw-bold">
                  <i className="bi bi-info-circle-fill me-2"></i> Return
                  Transaction Target
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3 p-3 bg-light rounded">
                  <label className="text-muted small d-block uppercase fw-semibold mb-1">
                    Member Name
                  </label>
                  <span className="fs-5 fw-bold text-dark">
                    {selectedBook.member_name}
                  </span>
                </div>

                <div className="mb-3">
                  <label className="text-muted small d-block fw-semibold">
                    Member Code
                  </label>
                  <span className="text-secondary">
                    {selectedBook.member_code}
                  </span>
                </div>
                <div className="mb-3">
                  <label className="text-muted small d-block fw-semibold">
                    Email
                  </label>
                  <span className="text-secondary">
                    {selectedBook.member_email}
                  </span>
                </div>

                <div className="mb-3">
                  <label className="text-muted small d-block fw-semibold">
                    Book Title
                  </label>
                  <span className="text-secondary">
                    {selectedBook.book_title}
                  </span>
                </div>

                <div className="mb-3">
                  <label className="text-muted small d-block fw-semibold">
                    Book Code
                  </label>
                  <span className="text-secondary">{selectedBook.isbn}</span>
                </div>
                <div className="mb-3">
                  <label className="text-muted small d-block fw-semibold">
                    Category
                  </label>
                  <span className="text-secondary">
                    {selectedBook.category_name}
                  </span>
                </div>
                <div className="mb-3">
                  <label className="text-muted small d-block fw-semibold">
                    Author
                  </label>
                  <span className="text-secondary">
                    {selectedBook.author_name}
                  </span>
                </div>

                <div className="row g-2 pt-2 border-top">
                  <div className="col-6">
                    <label className="text-muted small d-block fw-semibold">
                      Issued On
                    </label>
                    <div className="badge bg-light text-dark border p-2 w-100 text-start">
                      <i className="bi bi-calendar-check me-2 text-primary"></i>
                      {new Date(selectedBook.borrow_date).toLocaleDateString(
                        'en-GB',
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small d-block fw-semibold">
                      Expected Return
                    </label>
                    <div className="badge bg-light text-dark border p-2 w-100 text-start">
                      <i className="bi bi-calendar-x me-2 text-danger"></i>
                      {new Date(selectedBook.due_date).toLocaleDateString(
                        'en-GB',
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Return Management Form */}
          <div className="col-md-7">
            <div className="card dashboard-card h-100">
              <div className="card-header border-0 bg-transparent pt-3">
                <h5 className="card-title mb-0 text-dark fw-bold">
                  <i className="bi bi-pencil-square me-2"></i> Return Manifest
                  Details
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleReturnSubmit}>
                  <div className="row g-3">
                    {/* Book Condition Dropdown */}
                    <div className="col-md-6">
                      <Select
                        label="Assess Condition"
                        placeholder="selected..."
                        name="bookCondition"
                        value={returnDetails.bookCondition}
                        onChange={handleReturnDetailsChange}
                        options={[
                          { value: 'Excellent', label: 'Excellent ✨' },
                          { value: 'Good', label: 'Good 👍' },
                          { value: 'Fair', label: 'Fair 🤕' },
                          { value: 'Damaged', label: 'Damaged ❌' },
                        ]}
                      />
                    </div>

                    {/* Notes Field */}
                    <div className="col-12">
                      <TextArea
                        label="Librarian Notes"
                        width="100%"
                        name="notes"
                        placeholder="Add remarks about fine collection, condition, etc..."
                        value={returnDetails.notes}
                        onChange={handleReturnDetailsChange}
                      />
                    </div>

                    {/* Live Fine Ledger Alert Box */}
                    <div className="col-12 mt-3">
                      <div
                        className="border-0 shadow-sm d-flex justify-content-between align-items-center m-0 py-3 px-4"
                        style={{
                          background: lateDays > 0 ? "#ff4d4f" : "#7EF27F",
                          color: "#fff",
                          borderRadius: "10px"
                        }}
                      >
                        {/* Late Days */}
                        <div>
                          <div className="small text-uppercase fw-bold opacity-75">
                            Late Days
                          </div>

                          <span className="fs-5 fw-bold">
                            {lateDays > 0 ? `${lateDays} day(s)` : "0 day"}
                          </span>
                        </div>

                        {/* Fine */}
                        <div className="text-end">
                          <div className="small text-uppercase fw-bold opacity-75">
                            Fine Accrued
                          </div>

                          <span className="fs-4 fw-bold">
                            ${(Number(fine || 0) / 4100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Form Action Controls */}
                    <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-light border px-4"
                        onClick={() => setSelectedBook(null)}
                      >
                        Dismiss
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success px-4 shadow-sm fw-semibold"
                      >
                        Complete Return{' '}
                        <i className="bi bi-check2-all ms-1"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Recent Returns Table */}
      <div className="card dashboard-card">
        <div className="card-header border-0">
          <h5 className="card-title mb-0">
            <i className="bi bi-clock-history"></i> Recent Return Records
          </h5>
        </div>
        <div className="card-body p-0">
          <Table
            columns={columnReturn}
            data={paginatedReturnBooks}
            hover={false}
          />
          <Pagination
            currentPage={returnPage}
            onPageChange={setReturnPage}
            totalPages={Math.ceil(returnedBooks.length / per_page)}
          />
        </div>
      </div>
    </div>
  );
};

export default ReturnBook;
