import React, { useState, useMemo, useEffect } from 'react';
import '../../assets/BorrowRequests.css'
import useBorrowRequest from '../../hook/useBorrowRequest';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';

const BorrowRequests = () => {
  const { borrowsRequest, approveBorrow, getAllBorrowRequest , rejectBorrow } = useBorrowRequest({ perPage: 10000 });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const requests = borrowsRequest || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery, showUrgentOnly]);

  const filteredRequests = useMemo(() => {
    const keyword = searchQuery.toLowerCase().trim();

    return requests.filter((request) => {
      const matchStatus =
        filterStatus === 'all' || request.status === filterStatus;

      const matchUrgent =
        !showUrgentOnly || request.priority === 'urgent';

      const matchSearch =
        !keyword ||
        String(request.member_name ?? '').toLowerCase().includes(keyword) ||
        String(request.book_title ?? '').toLowerCase().includes(keyword) ||
        String(request.member_code ?? '').toLowerCase().includes(keyword) ||
        String(request.id ?? '').includes(keyword);

      return matchStatus && matchUrgent && matchSearch;
    });
  }, [requests, filterStatus, searchQuery, showUrgentOnly]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;


  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };


  const handleApprove = async (requestId) => {
    if (!requestId) {
      return;
    }
    const result = await approveBorrow(requestId);

    if (result === true) {
      await getAllBorrowRequest();
      setSelectedRequest(null); 
      setCurrentPage(1);
    }
  };

  const handleReject = async(requestId) => {
     if (!requestId) {
      return;
    }
    const result = await rejectBorrow(requestId);

    if (result === true) {
      await getAllBorrowRequest();
      setSelectedRequest(null); 
      setCurrentPage(1);
    }
  };

  const handleRefresh = () => {
    setSelectedRequest(null);
    setSearchQuery('');
    setFilterStatus('all');
    setShowUrgentOnly(false);
    setCurrentPage(1);
  };

  const activityTimeline = selectedRequest
    ? [
      {
        id: 1,
        action: 'Borrow request created',
        timestamp: new Date(
          selectedRequest.request_date
        ).toLocaleString(),
        icon: 'bi-file-earmark-plus',
        color: '#3B82F6',
      },
      ...(selectedRequest.status === 'approved'
        ? [{
          id: 2,
          action: 'Request approved',
          timestamp: 'Recently',
          icon: 'bi-check-circle',
          color: '#00C18F',
        }]
        : []),
      ...(selectedRequest.status === 'rejected'
        ? [{
          id: 3,
          action: 'Request rejected',
          timestamp: 'Recently',
          icon: 'bi-x-circle',
          color: '#EF4444',
        }]
        : []),
    ]
    : [];

  const column = [
     {
      header: "No",
      render: (row, index) =>
        (currentPage - 1) * 5 + index + 1
    },
    {
      header: 'Member Info',
      accessor: '',
      render: (row) => {
        const imagePath = row.profile_image
          ? row.profile_image.replace('/uploads/', '')
          : 'profiles/default-profile.png';

        return (
          <div className="d-flex align-items-center gap-2">
            <img
              src={`${import.meta.env.VITE_API_URL}${imagePath}`}
              alt={row.member_name}
              width={40}
              height={40}
              className="rounded-circle"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = `${import.meta.env.VITE_API_URL}profiles/default-profile.png`;
              }}
            />

            <div>
              <div>{row.member_name}</div>
              <small className="text-muted">
                {row.member_code}
              </small>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Book Info',
      accessor: '',
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <img
            src={`${import.meta.env.VITE_API_URL}${row.thumbnail}`}
            alt={row.book_title}
            width={40}
            height={60}
            className="rounded"
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = `${import.meta.env.VITE_API_URL}books/default-book.png`;
            }}
          />

          <div>
            <div>{row.book_title}</div>
            <small className="text-muted">
              by : {row.author_name}
            </small>
          </div>
        </div>
      )
    },
    {
      header: 'Request Date',
      accessor: 'request_date',
      render: (row) => (
        <div>
          {new Date(row.request_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const statusClass = {
          pending: 'bg-warning text-dark',
          approved: 'bg-success',
          rejected: 'bg-danger',
          returned: 'bg-primary'
        }[row.status?.toLowerCase()] || 'bg-secondary';

        return (
          <span className={`badge ${statusClass}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-link"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedRequest(row)
            }}
            title="View Details"
          >
            <i className="bi bi-eye"></i>
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="borrow-requests-container">
      {/* Page Header */}
      <div className="page-header mb-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="page-title">Borrow Requests</h1>
            <p className="page-subtitle">
              Manage and process all book borrowing requests from members
            </p>
          </div>
          <div className="col-md-6 text-end">
            <div className="header-actions">
              <button
                className="btn btn-light me-2"
                title="Refresh"
                onClick={handleRefresh}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
              <div className="dropdown d-inline">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  id="filterDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-funnel"></i> Filter
                </button>
                <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                  <li>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setFilterStatus('all'); }}>All</a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setFilterStatus('pending'); }}>Pending</a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setFilterStatus('approved'); }}>Approved</a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setFilterStatus('rejected'); }}>Rejected</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
          <div className="stat-card">
            <div className="stat-icon total"><i className="bi bi-inbox"></i></div>
            <div className="stat-content">
              <h5 className="stat-label">Total Requests</h5>
              <h3 className="stat-value">{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
          <div className="stat-card">
            <div className="stat-icon pending"><i className="bi bi-hourglass-split"></i></div>
            <div className="stat-content">
              <h5 className="stat-label">Pending Requests</h5>
              <h3 className="stat-value">{stats.pending}</h3>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
          <div className="stat-card">
            <div className="stat-icon approved"><i className="bi bi-check-circle"></i></div>
            <div className="stat-content">
              <h5 className="stat-label">Approved Requests</h5>
              <h3 className="stat-value">{stats.approved}</h3>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
          <div className="stat-card">
            <div className="stat-icon rejected"><i className="bi bi-x-circle"></i></div>
            <div className="stat-content">
              <h5 className="stat-label">Rejected Requests</h5>
              <h3 className="stat-value">{stats.rejected}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="row">
        <div className="col-lg-8 col-md-12 mb-4">
          {/* Quick Filters */}
          <div className="card filter-card mb-4">
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-600">Search Requests</label>
                <div className="search-box">
                  <i className="bi bi-search search-icon"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by member name, book title, or request ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-chips">
                <button className={`chip ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>All</button>
                <button className={`chip ${filterStatus === 'pending' ? 'active' : ''}`} onClick={() => setFilterStatus('pending')}>Pending</button>
                <button className={`chip ${filterStatus === 'approved' ? 'active' : ''}`} onClick={() => setFilterStatus('approved')}>Approved</button>
                <button className={`chip ${filterStatus === 'rejected' ? 'active' : ''}`} onClick={() => setFilterStatus('rejected')}>Rejected</button>
              </div>
            </div>
          </div>

          {/* Request List Table */}
          <div className="card request-table-card">
            <div className="card-header">
              <h5 className="card-title mb-0">All Borrow Requests</h5>
              <small className="text-muted">
                {filteredRequests.length} result(s)
              </small>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                {/* Notice we pass paginatedRequests here instead of filteredRequests */}
                <Table
                  columns={column}
                  data={paginatedRequests}
                  hover={false}
                />
              </div>
              {/* Wiring up UI pagination properties */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="col-lg-4 col-md-12">
          {selectedRequest ? (
            <div className="card detail-panel mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Request Details</h5>
                <button className="btn-close" onClick={() => setSelectedRequest(null)}></button>
              </div>
              <div className="card-body">
                <div className="detail-section">
                  <h6 className="section-title">Request Information</h6>
                  <div className="detail-row">
                    <span className="detail-label">Request ID:</span>
                    <code>{selectedRequest.id}</code>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Request Date:</span>
                    <span>{new Date(selectedRequest.request_date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`badge ${{ pending: 'bg-warning text-dark', approved: 'bg-success', rejected: 'bg-danger', returned: 'bg-primary' }[selectedRequest?.status?.toLowerCase()] || 'bg-secondary'}`}>
                      {selectedRequest?.status?.charAt(0).toUpperCase() + selectedRequest?.status?.slice(1) || 'Unknown'}
                    </span>
                  </div>
                </div>

                <hr className="detail-divider" />

                <div className="detail-section">
                  <h6 className="section-title">Member Information</h6>
                  <div className="member-card">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${selectedRequest?.profile_image?.replace('/uploads/', '') || 'profiles/default-profile.png'}`}
                      alt={selectedRequest?.member_name}
                      className="member-avatar"
                      onError={(e) => { e.target.src = `${import.meta.env.VITE_API_URL}profiles/default-profile.png`; }}
                    />
                    <div className="member-details">
                      <div className="fw-600">{selectedRequest?.member_name}</div>
                      <small className="text-muted d-block">{selectedRequest?.member_code}</small>
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span>{selectedRequest.phone || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <small>{selectedRequest.email}</small>
                  </div>
                </div>

                <hr className="detail-divider" />

                <div className="detail-section">
                  <h6 className="section-title">Book Information</h6>
                  <div className="book-info-detail">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${selectedRequest?.thumbnail || 'books/default-book.png'}`}
                      alt={selectedRequest?.book_title}
                      className="book-cover-detail"
                      onError={(e) => { e.target.src = `${import.meta.env.VITE_API_URL}books/default-book.png`; }}
                    />
                    <div className="book-info-text">
                      <div className="fw-600">{selectedRequest?.book_title}</div>
                      <small className="text-muted d-block">ISBN: {selectedRequest?.isbn}</small>
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Book ID:</span>
                    <code>{selectedRequest.bookId}</code>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Category:</span>
                    <span>{selectedRequest.category_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Availability:</span>
                    <span className={`badge ${selectedRequest?.availability === 'available' ? 'bg-success' : 'bg-danger'}`}>
                      {selectedRequest?.availability || 'Unknown'}
                    </span>
                  </div>
                </div>

                <hr className="detail-divider" />

                {selectedRequest.status === 'pending' && (
                  <div className="approval-actions">
                    <button className="btn btn-primary btn-approve w-100 mb-2"
                      onClick={() => handleApprove(selectedRequest.id)}
                      disabled={selectedRequest.availability === "unavailable"}
                    >
                      <i className="bi bi-check-circle me-2"></i> Approve Request
                    </button>
                    <button className="btn btn-outline-danger w-100" onClick={() => handleReject(selectedRequest.id)}>
                      <i className="bi bi-x-circle me-2"></i> Reject Request
                    </button>
                  </div>
                )}
                {selectedRequest.status !== 'pending' && (
                  <div className="alert alert-info mb-0">
                    <i className="bi bi-info-circle me-2"></i> This request has already been processed.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card detail-panel-empty">
              <div className="card-body text-center py-5">
                <i className="bi bi-inbox text-muted mb-3" style={{ fontSize: '2rem' }}></i>
                <p className="text-muted">Select a request to view details</p>
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="card timeline-card">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="activity-timeline">
                {activityTimeline.length > 0 ? (
                  activityTimeline.map((activity, index) => (
                    <div key={activity.id} className="timeline-item">
                      <div className="timeline-marker" style={{ color: activity.color }}>
                        <i className={`bi ${activity.icon}`}></i>
                      </div>
                      <div className="timeline-content">
                        <p className="timeline-action mb-1">{activity.action}</p>
                        <small className="timeline-time text-muted">{activity.timestamp}</small>
                      </div>
                      {index < activityTimeline.length - 1 && <div className="timeline-line"></div>}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-3">No recent activity</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowRequests;