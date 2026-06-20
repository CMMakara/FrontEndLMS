import React, { useState } from 'react';
import '../../assets/IssueBook.css';
import useMember from '../../hook/useMember'
import useBook from '../../hook/useBooks'
import Input from '../../components/ui/Input'
import Table from '../../components/ui/Table'
import useBorrows from '../../hook/useBorrow';
import { useToast } from '../../context/ToastContext'
const IssueBook = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [borrowDate, setBorrowDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [dueDate, setDueDate] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { members , page , pagination , setPage } = useMember({perPage:100});
  const { books } = useBook();
  const { createBorrowRecord, borrow } = useBorrows()
  const [memberNotFound, setMemberNotFound] = useState(false);
  const { showToast } = useToast()

  const statistics = [
    { label: 'Total Books', value: books.length, icon: 'bi-book', color: '#00C18F' },
    {
      label: 'Available Books',
      value: books.filter(book => book.status === 'available').length,
      icon: 'bi-check-circle',
      color: '#10B981',
    },
    {
      label: 'Borrowed Books',
      value: books?.reduce(
        (sum, book) =>
          sum + (Number(book.total_copies) - Number(book.available_copies)),
        0
      ) || 0,
      icon: 'bi-hand-index',
      color: '#3B82F6',
    },
    {
      label: "Today's Transactions",
      value:
        borrow?.filter(
          record =>
            new Date(record.borrow_date).toDateString() ===
            new Date().toDateString()
        ).length || 0,
      icon: "bi-calendar-event",
      color: "#F59E0B",
    }
  ];

  const columns = [
    { header: 'id', accessor: 'id' },
    { header: 'book title', accessor: 'book_title' },
    { header: 'book code', accessor: 'isbn' },
    {
      header: 'Status',
      accessor: 'status',
      render: (book) => {
        const isAvailable =
          book.status === 'available' &&
          Number(book.available_copies) > 0;

        return (
          <span className={`status-badge ${isAvailable ? 'available' : 'unavailable'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        );
      },
    },
    { header: 'author', accessor: 'author_name' },
    { header: 'category', accessor: 'category_name' },
    {
      header: 'Action',
      accessor: 'action',
      render: (book) => {
        const isSelected = selectedBooks.some((b) => b.id === book.id);

        const isAvailable =
          book.status === 'available' &&
          Number(book.available_copies) > 0;

        const isDisabled =
          book.status !== 'available' ||
          Number(book.available_copies) <= 0 ||
          selectedBooks.some((b) => b.id === book.id);

        return (
          <button
            className={`btn btn-sm border-0  ${isDisabled ? 'text-danger border-0' : ''
              }`}
            onClick={() => handleAddBook(book)}
            disabled={isDisabled}
          >
            <i className="bi bi-plus-circle"></i>
          </button>
        );
      },
    }
  ]
  const handleMemberSearch = () => {
    if (!memberSearch.trim()) {
      return
    }
    const keyword = memberSearch.trim().toLocaleLowerCase()
    const found = members.find(
      (member) =>
        String(member.user_id).toLowerCase().includes(keyword) ||
        member.member_code?.toLowerCase().includes(keyword) ||
        member.full_name?.toLowerCase().includes(keyword)
    )
    if (found) {
      setSelectedMember(found);
      setMemberNotFound(false);
    } else {
      setSelectedMember(null);
      setMemberNotFound(true);
    }
  };




  const handleAddBook = (book) => {
    const isAvailable = book.status === 'available' && Number(book.available_copies) > 0;
    if (!book.available_copies) {
      showToast('This book is not available for borrowing', 'warning')
      return;
    }
    setSelectedBooks((prev) => {
      const exists = prev.some((b) => b.id === book.id);
      if (exists) {
        showToast('This book is already selected', 'warning')
        return prev;
      }

      return [...prev, book];
    });
  };

  const handleRemoveBook = (bookId) => {
    setSelectedBooks((prev) =>
      prev.filter((b) => b.id !== bookId)
    );
  };

  const handleCreateBorrow = async () => {
    if (!selectedMember) {
      showToast('Please select a member', 'error')
      return;
    }
    if (selectedBooks.length === 0) {
      showToast('Please select at least one book', 'error')
      return;
    }
    if (!borrowDate || !dueDate) {
      showToast('Please set both borrow and due dates', 'error')
      return;
    }

    const payload = {
      member_id: selectedMember.user_id,
      book_ids: selectedBooks.map(book => book.id),
      borrow_date: borrowDate,
      due_date: dueDate,
      borrow_status: 'borrowed'
    };
    const result = await createBorrowRecord(payload);

    if (result) {
      handleClearForm();
    }
  };

  const handleClearForm = () => {
    setSelectedMember(null);
    setSelectedBooks([]);
    setBorrowDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setMemberSearch('');
    setBookSearch('');
  };

  const calculateDueDate = (days = 14) => {
    const date = new Date(borrowDate);
    date.setDate(date.getDate() + days);
    setDueDate(date.toISOString().split('T')[0]);
  };

  const keyword = bookSearch.toLowerCase();
  const filteredBooks = books.filter(
    (book) =>
      book.book_title?.toLowerCase().includes(keyword) ||
      book.author?.toLowerCase().includes(keyword) ||
      book.isbn?.toLowerCase().includes(keyword) ||
      String(book.id)?.toLowerCase().includes(keyword)
  );

  return (
    <div>
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Issue Book</h1>
          <p className="page-subtitle">Create a new borrowing transaction</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="statistics-grid">
        {statistics.map((stat, index) => (
          <div key={index} className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
            >
              <i className={`bi ${stat.icon}`}></i>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Form Card */}
      <div className="form-card">
        {/* -------- SECTION 1: MEMBER INFORMATION -------- */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">
              <i className="bi bi-person-check"></i> Member Information
            </h3>
          </div>

          <div className="search-section">
            <div className="row g-3">
              <div className="col-md-4">
                <Input
                  width='100%'
                  placeholder="Search by Member code or full name"
                  icon='bi-search'
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleMemberSearch()}
                />
              </div>
              <div className="col-md-8 ">
                <button className='btn btn-success btn-lg' onClick={handleMemberSearch}>
                  search
                </button>
              </div>
            </div>
          </div>

          {selectedMember ? (
            <div className="member-info-card">
              <div className="member-header">
                <div className="member-avatar">
                  <i className="bi bi-person"></i>
                </div>
                <div className="member-details">
                  <h5 className="member-name"> Name : {selectedMember.full_name}</h5>
                </div>
              </div>

              <div className="member-info-grid">
                <div className="info-item">
                  <label>Member ID</label>
                  <p>{selectedMember.user_id}</p>
                </div>
                <div className="info-item">
                  <label>Member code</label>
                  <p>{selectedMember.member_code}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{selectedMember.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{selectedMember.phone || "No phone number"}</p>
                </div>
                <div className="info-item">
                  <label>Member Type</label>
                  <p>{selectedMember.member_type}</p>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <p>
                    {new Date(selectedMember.registered_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                className="btn btn-link btn-change-member"
                onClick={() => {
                  setSelectedMember(null);
                  setMemberSearch('');
                }}
              >
                Change Member
              </button>
            </div>
          ) : memberNotFound ? (
            <div className="empty-state text-center">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/073/037/960/small_2x/error-404-illustration-concept-with-3d-character-page-not-found-404-page-error-scene-png.png"
                alt="not found"
                style={{ width: "320px", marginBottom: "10px" }}
              />
              <p>Member not found</p>
            </div>
          ) : (
            <div className="empty-state text-text-center">
              <i className="bi bi-search"></i>
              <p>Search and select a member to proceed</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <hr className="form-divider" />

        {/* -------- SECTION 2: BOOK SELECTION -------- */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">
              <i className="bi bi-book-half"></i> Book Selection
            </h3>
          </div>

          <div className="search-section">
            <div className="row g-3">
              <div className="col-md-4">
                <Input
                  width='100%'
                  icon='bi-search'
                  placeholder="Search by Book ID, Title, or Author"
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                />
              </div>
              <div className="col-md-8 ">
                <button className='btn btn-success btn-lg btn-secondary disabled'>
                  <i className="bi bi-funnel"></i> Filter
                </button>
              </div>
            </div>
          </div>
          {filteredBooks.length > 0 ?
            (
              <Table
                columns={columns}
                data={filteredBooks}
                hover={false}
              />

            ) : (
              <div className="empty-state text-center">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/073/037/960/small_2x/error-404-illustration-concept-with-3d-character-page-not-found-404-page-error-scene-png.png"
                  alt="not found"
                  style={{ width: "300px" }}
                />
                <p>No books found</p>
              </div>
            )

          }
          {/* Selected Books */}
          {selectedBooks.length > 0 && (
            <div className="selected-books-section">
              <h5 className="selected-title">
                <i className="bi bi-check-circle"></i> Selected Books (
                {selectedBooks.length})
              </h5>
              <div className="selected-books-list">
                {selectedBooks.map((book) => (
                  <div key={book.id} className="selected-book-item">
                    <div className="book-item-info">
                      <strong>{book.book_title}</strong>
                      <small>{book.author_name}</small>
                    </div>
                    <button
                      className="btn btn-remove"
                      onClick={() => handleRemoveBook(book.id)}
                      title="Remove book"
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <hr className="form-divider" />

        {/* -------- SECTION 3: BORROWING DETAILS -------- */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">
              <i className="bi bi-calendar-event"></i> Borrowing Details
            </h3>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Borrow Date</label>
              <input
                type="date"
                className="form-control form-control-custom"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Due Date</label>
              <div className="due-date-wrapper">
                <input
                  type="date"
                  className="form-control form-control-custom"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <div className="due-date-presets">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => calculateDueDate(14)}
                    title="Set due date to 14 days from now"
                  >
                    14 days
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => calculateDueDate(30)}
                    title="Set due date to 30 days from now"
                  >
                    30 days
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="form-divider" />

        {/* -------- SECTION 4: BORROW SUMMARY -------- */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">
              <i className="bi bi-receipt"></i> Borrow Summary
            </h3>
          </div>

          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Selected Books</span>
              <span className="summary-value">{selectedBooks.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Member Name</span>
              <span className="summary-value">
                {selectedMember?.full_name || 'Not Selected'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Borrow Date</span>
              <span className="summary-value">
                {borrowDate
                  ? new Date(borrowDate).toLocaleDateString()
                  : 'Not Set'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Due Date</span>
              <span className="summary-value">
                {dueDate ? new Date(dueDate).toLocaleDateString() : 'Not Set'}
              </span>
            </div>
          </div>
        </div>

        {/* -------- ACTION BUTTONS -------- */}
        <div className="form-actions">
          <div className="d-flex justify-content-end gap-3 flex-wrap">
            <button
              className="btn btn-primary px-4"
              onClick={handleCreateBorrow}
            >
              <i className="bi bi-check-circle me-2"></i>
              Create Borrow Record
            </button>

            <button
              className="btn btn-outline-secondary px-4"
              onClick={handleClearForm}
            >
              <i className="bi bi-x-circle me-2"></i>
              Clear Form
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default IssueBook;
