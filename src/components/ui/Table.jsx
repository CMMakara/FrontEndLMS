import React from "react";
import "../../assets/Table.css";

function Table({
  columns = [],
  data = [],
  onRowClick,
  hover = true,
}) {
  return (
    <div className="custom-table-container">
      <div className="table-responsive">

        <table
          className={`table align-middle custom-table ${hover ? "table-hover-on" : "table-hover-off"
            }`}
        >

          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={col.className || ""}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={onRowClick ? "row-clickable" : ""}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={col.cellClassName || ""}>
                      {col.render
                        ? col.render(row, rowIndex)
                        : (row[col.accessor] ?? "N/A")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length || 1} className="text-center py-4">
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