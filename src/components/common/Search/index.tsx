import React, { type ComponentPropsWithoutRef } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";

import "./Search.scss";

type SearchProps = {
  onClear?: () => void;
} & ComponentPropsWithoutRef<"input">;

const Search: React.FC<SearchProps> = ({
  placeholder = "Search...",
  value,
  onClear,
  ...rest
}) => {
  const showClearIcon = value && String(value).length > 0;

  return (
    <div className="search-input-wrapper">
      <IoSearchOutline className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        {...rest}
      />
      {showClearIcon && (
        <IoCloseOutline className="search-clear-icon" onClick={onClear} />
      )}
    </div>
  );
};

export default Search;
