// components/ui/BaseTable.jsx

import React from "react";
import "../../assets/Table.css";

function Table({ columns = [], data = [] }) {
  return (
    <div className="custom-table-container">
      <div className="table-responsive">
        <table className="table align-middle custom-table">
          
          {/* Table Header */}
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={column.className || ""}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={column.cellClassName || ""}
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default Table;