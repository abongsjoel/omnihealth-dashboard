import { Fragment, useEffect, useState } from "react";

import Icon from "../Icon";
import rightIcon from "../../../assets/svgs/chevron-right.svg";
import leftIcon from "../../../assets/svgs/chevron-left.svg";

import "./Table.scss";

const DISPLAY_NUMBER = 15;

interface TableColumn<T> {
  label: string;
  size?: string;
  header?: () => React.ReactNode;
  render: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  config: TableColumn<T>[];
  keyFn: (row: T) => string | number;
}

export default function Table<T>({ data, config, keyFn }: TableProps<T>) {
  const [renderedData, setRenderedData] = useState<T[]>([]);
  const [activePageNum, setActivePageNum] = useState(1);
  const [navDisplay, setNavDisplay] = useState(0);

  const pages = Math.ceil(data.length / DISPLAY_NUMBER);
  const start = activePageNum * DISPLAY_NUMBER - (DISPLAY_NUMBER - 1);
  const end = activePageNum * DISPLAY_NUMBER;

  const renderdHeaders = config.map((column) => {
    if (column.header) {
      return <Fragment key={column.label}>{column.header()}</Fragment>;
    }

    return <th key={column.label}>{column.label}</th>;
  });

  const renderedRows = renderedData.map((rowData) => {
    const renderedCells = config.map((column) => {
      return <td key={column.label}>{column.render(rowData)}</td>;
    });
    return (
      <tr className="border-b" key={keyFn(rowData)}>
        {renderedCells}
      </tr>
    );
  });

  const handleChangePage = (newPageNum: number) => {
    setActivePageNum(newPageNum);
    const base = (newPageNum - 1) * DISPLAY_NUMBER;
    setRenderedData(data.slice(base, base + DISPLAY_NUMBER));
  };

  const handleNavDisplay = (action: "increment" | "decrement") => {
    if (action === "increment") {
      setNavDisplay((prev) => (prev < pages - 3 ? prev + 1 : prev));
    }
    if (action === "decrement") {
      setNavDisplay((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  useEffect(() => {
    setRenderedData(data.slice(0, 15));
    setActivePageNum(1);
    setNavDisplay(0);
  }, [data]);

  return (
    <div className="pageWrappe">
      <div className="contentWrapper">
        <div className="tableScroll">
          <table className="table">
            <colgroup>
              {config.map((con) => (
                <col
                  key={con.label}
                  style={{ width: con.size ?? "100px", textAlign: "center" }}
                />
              ))}
            </colgroup>
            <thead>
              <tr>{renderdHeaders}</tr>
            </thead>
            <tbody>{renderedRows}</tbody>
          </table>
        </div>
      </div>
      <div className="tableFooter">
        <div>
          <span className="displayNumber">
            {start} -{end > data.length ? data.length : end}
          </span>{" "}
          of {data.length} results
        </div>
        <div className="tableNav">
          <button onClick={() => handleNavDisplay("decrement")}>
            <Icon src={leftIcon} alt="Left Icon" />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1)
            .splice(navDisplay, navDisplay + 3)
            .map((num) => (
              <button
                onClick={() => handleChangePage(num)}
                key={num}
                className={num === activePageNum ? "activePage" : ""}
              >
                {num}
              </button>
            ))}
          <button onClick={() => handleNavDisplay("increment")}>
            <Icon src={rightIcon} alt="Right Icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
