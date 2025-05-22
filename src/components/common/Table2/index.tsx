// Table.tsx
import { Fragment } from "react";
import type { ReactNode } from "react";

import "./Table.scss";

interface TableColumn<T> {
  label: string;
  size?: string;
  header?: () => ReactNode;
  render: (row: T) => ReactNode;
}

interface TableProps<T> {
  data: T[];
  config: TableColumn<T>[];
  keyFn: (row: T) => string | number;
}

export default function Table<T>({ data, config, keyFn }: TableProps<T>) {
  const renderedHeaders = config.map((column) => {
    if (column.header) {
      return <Fragment key={column.label}>{column.header()}</Fragment>;
    }
    return <th key={column.label}>{column.label}</th>;
  });

  const renderedRows = data.map((row) => {
    const cells = config.map((column) => (
      <td key={column.label}>{column.render(row)}</td>
    ));
    return <tr key={keyFn(row)}>{cells}</tr>;
  });

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table className="custom-table">
          <colgroup>
            {config.map((col) => (
              <col key={col.label} style={{ width: col.size ?? "120px" }} />
            ))}
          </colgroup>
          <thead>
            <tr>{renderedHeaders}</tr>
          </thead>
          <tbody>{renderedRows}</tbody>
        </table>
      </div>
    </div>
  );
}
