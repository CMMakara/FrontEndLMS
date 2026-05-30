import React from 'react';

const Pagination = ({ currentPage = 1, totalPages = 10, onPageChange = () => {} }) => {
  
  if(totalPages <= 1) {
    return null
  }
  // Generate the page number array dynamically based on totalPages
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Glow Pagination">
      <ul className="pagination glow-pagination justify-content-end gap-3 my-4">
        
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link rounded-3 px-3 py-2 bg-white text-dark shadow-sm fw-medium"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>

        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button 
              className={`page-link rounded-3 px-3 py-2 fw-bold text-center shadow-sm ${
                currentPage === number 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-secondary'
              }`}
              style={{ minWidth: '40px' }}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link rounded-3 px-3 py-2 bg-white text-dark shadow-sm fw-medium"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>

      </ul>
    </nav>
  );
};

export default Pagination;